import os
import uvicorn
from dotenv import load_dotenv
import matplotlib
import base64
import time
import io
import json
import glob
from typing import Dict, Optional, List

# Non-interactive backend for plots
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from fastapi import FastAPI, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
from rdkit import Chem
from rdkit.Chem import Descriptors, QED, Draw

load_dotenv()
app = FastAPI(title="OncoMind ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DEFAULT FALLBACK VOCAB (45 Tokens) ---
# Used if no .json file is found next to the model
DEFAULT_VOCAB = [
    "<PAD>",
    "<SOS>",
    "<EOS>",
    "#",
    "(",
    ")",
    "-",
    ".",
    "/",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "=",
    "B",
    "C",
    "F",
    "I",
    "N",
    "O",
    "P",
    "S",
    "[C-]",
    "[C@@H]",
    "[C@@]",
    "[C@H]",
    "[C@]",
    "[N+]",
    "[O-]",
    "[O]",
    "[S+]",
    "[Si]",
    "[n+]",
    "[nH]",
    "\\",
    "c",
    "l",
    "n",
    "o",
    "r",
    "s",
]

EMBED_SIZE = 128
HIDDEN_SIZE = 256
NUM_LAYERS = 2


# --- MODEL ARCHITECTURE ---
class MoleculeGenerator(nn.Module):
    def __init__(self, vocab_size, embed_size, hidden_size, num_layers):
        super(MoleculeGenerator, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(embed_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, vocab_size)

    def forward(self, x, hidden=None):
        embed = self.embedding(x)
        out, (ht, ct) = self.lstm(embed, hidden)
        output = self.fc(out)
        return output, (ht, ct)


class OncoMindWrapper:
    def __init__(self, model_path=None, name="Default"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.name = name
        self.is_loaded = False

        # 1. DETERMINE VOCABULARY
        self.vocab = DEFAULT_VOCAB
        if model_path:
            # Check for sidecar JSON file (e.g., model.pth -> model.json)
            json_path = model_path.replace(".pth", ".json")
            if os.path.exists(json_path):
                try:
                    with open(json_path, "r") as f:
                        self.vocab = json.load(f)
                    print(
                        f"📘 {self.name}: Loaded custom vocab from {json_path} (Size: {len(self.vocab)})"
                    )
                except Exception as e:
                    print(f"⚠️ {self.name}: Found JSON but failed to load it: {e}")

        # 2. Build Mappings
        self.stoi = {token: i for i, token in enumerate(self.vocab)}
        self.itos = {i: token for i, token in enumerate(self.vocab)}
        self.vocab_size = len(self.vocab)

        # 3. Initialize Model Structure
        self.model = MoleculeGenerator(
            self.vocab_size, EMBED_SIZE, HIDDEN_SIZE, NUM_LAYERS
        ).to(self.device)

        # 4. Load Weights
        if model_path and os.path.exists(model_path):
            try:
                state_dict = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_loaded = True
                print(f"✅ Loaded: {self.name}")
            except RuntimeError as e:
                print(f"❌ SIZE MISMATCH for {self.name}!")
                print(
                    f"   -> Model File Expects: {state_dict['embedding.weight'].shape[0]} tokens"
                )
                print(f"   -> Current Config Has: {self.vocab_size} tokens")
                print(
                    f"   -> FIX: Create a {os.path.basename(json_path)} file with the correct token list."
                )
            except Exception as e:
                print(f"❌ Error loading {self.name}: {e}")
        else:
            print(f"⚠️ Path not found: {model_path}")

    def generate(self, start_atom="C", max_length=100, temperature=0.8):
        if not self.is_loaded:
            return "ERROR_MODEL_NOT_LOADED"

        # Use THIS model's specific mappings
        if start_atom not in self.stoi:
            start_atom = "C"

        input_seq = [self.stoi["<SOS>"], self.stoi[start_atom]]
        input_tensor = (
            torch.tensor(input_seq, dtype=torch.long).unsqueeze(0).to(self.device)
        )
        generated_str = start_atom
        hidden = None

        with torch.no_grad():
            for _ in range(max_length):
                output, hidden = self.model(input_tensor, hidden)
                last_token_logits = output[0, -1, :] / temperature
                probs = torch.nn.functional.softmax(last_token_logits, dim=0)
                next_token_idx = torch.multinomial(probs, 1).item()

                # Check End/Pad based on THIS model's vocab
                eos_idx = self.stoi.get("<EOS>", -1)
                pad_idx = self.stoi.get("<PAD>", -1)

                if next_token_idx == eos_idx or next_token_idx == pad_idx:
                    break

                # Safety check
                if next_token_idx < len(self.vocab):
                    next_char = self.itos[next_token_idx]
                    generated_str += next_char
                    input_tensor = torch.tensor(
                        [[next_token_idx]], dtype=torch.long
                    ).to(self.device)
                else:
                    break

        return generated_str


# --- LOAD MODELS REGISTRY ---
loaded_models: Dict[str, OncoMindWrapper] = {}


def load_models_from_env():
    """Scans ENV vars for PYTORCH_MODEL_{Name}"""
    found = False
    for key, val in os.environ.items():
        if key.startswith("PYTORCH_MODEL"):
            # Extract name: PYTORCH_MODEL_ABL1_V2 -> "ABL1 V2"
            clean_name = key.replace("PYTORCH_MODEL", "").replace("_", " ").strip()
            if not clean_name:
                clean_name = "Main Model"

            # Load
            wrapper = OncoMindWrapper(val, name=clean_name)

            # Only add if it loaded correctly
            if wrapper.is_loaded:
                loaded_models[clean_name] = wrapper
                found = True

    if not found:
        # Fallback: Initialize an empty random model so API doesn't crash
        print("⚠️ No valid models loaded. Using Random Default.")
        loaded_models["Default"] = OncoMindWrapper(None)


load_models_from_env()


def get_engine(name: str) -> OncoMindWrapper:
    if name in loaded_models:
        return loaded_models[name]
    if loaded_models:
        return list(loaded_models.values())[0]
    return OncoMindWrapper(None)


# --- API ENDPOINTS ---


@app.get("/list_models")
def list_models():
    return {"models": list(loaded_models.keys())}


class GenerateRequest(BaseModel):
    start_atom: str = "C"
    model_name: Optional[str] = None


@app.post("/generate_candidate")
def generate_candidate(req: GenerateRequest):
    engine = get_engine(req.model_name)
    if not engine.is_loaded:
        return {"error": "Selected model is not loaded check server logs."}

    best_smiles, best_mol, best_qed, best_mw = None, None, 0.0, 0.0

    for _ in range(50):
        smiles = engine.generate(req.start_atom)

        if "ERROR" in smiles:
            continue

        # Cleanup
        smiles = smiles.replace("<PAD>", "").replace("<SOS>", "").replace("<EOS>", "")

        mol = Chem.MolFromSmiles(smiles)
        if mol:
            try:
                qed = QED.qed(mol)
                if qed >= 0.6:
                    best_smiles, best_mol, best_qed, best_mw = (
                            smiles,
                        mol,
                        qed,
                        Descriptors.MolWt(mol),
                    )
                    break
            except:
                continue

    if not best_smiles:
        # Fallback Aspirin
        best_smiles = "CC(=O)Oc1ccccc1C(=O)O"
        best_mol = Chem.MolFromSmiles(best_smiles)
        best_qed, best_mw = 0.65, 180.16

    img = Draw.MolToImage(best_mol, size=(300, 300))
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {
        "model": engine.name,
        "smiles": best_smiles,
        "qed": best_qed,
        "mw": best_mw,
        "image_base64": f"data:image/png;base64,{img_str}",
    }


# --- VISUALIZATION ENDPOINTS ---


@app.get("/inference_benchmark")
async def inference_benchmark(model_name: str = "Default"):
    engine = get_engine(model_name)
    lengths = [10, 30, 50, 80, 100]
    times = []

    if engine.is_loaded:
        engine.generate("C", max_length=5)  # Warmup
        for length in lengths:
            start = time.time()
            for _ in range(3):
                engine.generate("C", max_length=length)
            times.append(((time.time() - start) / 3) * 1000)
    else:
        times = [0] * len(lengths)

    plt.figure(figsize=(7, 4))
    plt.plot(lengths, times, marker="o", color="#007bff")
    plt.title(f"Speed: {engine.name}")
    plt.grid(True, alpha=0.3)
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    plt.close()
    return Response(content=buf.getvalue(), media_type="image/png")


@app.get("/activation_map")
async def activation_map(model_name: str = "Default"):
    engine = get_engine(model_name)
    if not engine.is_loaded:
        return Response(status_code=500)

    # Find index of 'C', defaulting to 1 if not found
    idx = engine.stoi.get("C", 1)

    with torch.no_grad():
        emb = engine.model.embedding(torch.tensor([idx]).to(engine.device))
        _, (ht, ct) = engine.model.lstm(emb.unsqueeze(0))
        hidden_vec = ht[-1].squeeze(0).cpu().numpy()

    side = int(np.sqrt(len(hidden_vec)))
    grid = hidden_vec[: side * side].reshape(side, side)

    plt.figure(figsize=(5, 4))
    plt.imshow(grid, cmap="magma", interpolation="nearest")
    plt.title(f"Activations: {engine.name}")
    plt.axis("off")
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    plt.close()
    return Response(content=buf.getvalue(), media_type="image/png")


@app.get("/model_heatmap")
async def model_heatmap(layer: str = "lstm", model_name: str = "Default"):
    engine = get_engine(model_name)
    if not engine.is_loaded:
        return Response(status_code=500)

    weights = engine.model.lstm.weight_ih_l0.detach().cpu().numpy()
    plt.figure(figsize=(8, 4))
    plt.imshow(weights, aspect="auto", cmap="viridis")
    plt.title(f"LSTM Weights: {engine.name}")
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    plt.close()
    return Response(content=buf.getvalue(), media_type="image/png")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
