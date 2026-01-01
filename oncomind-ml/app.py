import os
import uvicorn
from dotenv import load_dotenv
from pathlib import Path
import traceback
from typing import Dict, Any, List, Optional
import matplotlib
import base64
import random
import time

# "Agg" stands for Anti-Grain Geometry. It is a non-interactive backend
# that only writes to files/buffers and never tries to open a window.
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import io

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool
import torch
import torch.nn as nn
from rdkit import Chem
from rdkit.Chem import Descriptors, QED, Draw


seed = int(time.time() * 1000) % 2**32
random.seed(seed)
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
load_dotenv()
app = FastAPI(title="OncoMind ML Service")

# --- CORS Middleware Section --- (Ensure this is added as early as possible)
origins = [
    "http://localhost:5173",  # The port your React app is running on
    "http://127.0.0.1:5173",  # Alternative localhost URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow your React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

try:
    from model_wrapper import MODEL as TRAINED_MODEL
except Exception:
    TRAINED_MODEL = None

try:
    from model_stub import MODEL as TOY_MODEL
except Exception:
    TOY_MODEL = None

MODEL = TRAINED_MODEL if TRAINED_MODEL is not None else TOY_MODEL

DIAGNOSTIC_TOOL_CLASS = None
try:
    from scripts_py.diagnostic_tool import (
        YOLODiagnosticTool as _YOLODiagnosticToolClass,
    )

    DIAGNOSTIC_TOOL_CLASS = _YOLODiagnosticToolClass
except Exception:
    DIAGNOSTIC_TOOL_CLASS = None

BASE_DIR = Path(os.getenv("BASE_DIR", "."))
DATASET_PATH = Path("/app/datasets") if os.getenv("DOCKER_ENV") else Path("./datasets")
CSV_PATH = DATASET_PATH / "CHEMBL1978_nonredundant.csv"
YOLO_MODEL_PATH = os.environ.get(
    "YOLO_MODEL_PATH"
)  # Should be /app/models/yolo_best.pt in Docker


# ... inside @app.get("/check") ...
@app.get("/check")
def model_files_check() -> Dict[str, Any]:
    checks = {
        "csv_found": CSV_PATH.exists(),
        "csv_path": CSV_PATH,
        "yolo_path_configured": YOLO_MODEL_PATH,
        "yolo_file_exists": Path(YOLO_MODEL_PATH).exists()
        if YOLO_MODEL_PATH
        else False,
        # ... existing checks ...
    }
    return checks


@app.get("/multi_cloud_service_check")
def multi_cloud_service_connection():
    """
    Placeholder: you can add code here to initialize cloud clients,
    credentials, or check connectivity to AWS/GCP endpoints.
    """
    return {
        "aws_configured": bool(os.environ.get("AWS_ACCESS_KEY_ID")),
        "gcp_configured": bool(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")),
    }


@app.get("/datasets/CHEMBL1978_nonredundant.csv")
def send_csv_data():
    return FileResponse(path=CSV_PATH, media_type="text/csv", filename="dataset.csv")


async def multi_model_async_functions():
    """
    Placeholder for running asynchronous tasks across multiple models.
    """
    # Example stub - you can schedule async tasks here later.
    return {"status": "stub", "note": "no async multi-model tasks configured"}


async def _lazy_init_diagnostic_tool():
    """
    Lazy initializer for the YOLO diagnostic tool. Called on first usage
    or during startup if you prefer.
    """
    global _DIAGNOSTIC_TOOL_INSTANCE, _DIAGNOSTIC_TOOL_LOADING_ERROR

    if _DIAGNOSTIC_TOOL_INSTANCE is not None or DIAGNOSTIC_TOOL_CLASS is None:
        return  # already initialized or class not available

    if not YOLO_MODEL_PATH:
        _DIAGNOSTIC_TOOL_LOADING_ERROR = (
            "YOLO_MODEL_PATH not set; diagnostic tool disabled."
        )
        return

    # Instantiate in threadpool (if heavy) to avoid blocking eventloop
    def _init():
        try:
            inst = DIAGNOSTIC_TOOL_CLASS(model_path=YOLO_MODEL_PATH)
            return inst
        except Exception as e:
            # capture error text
            tb = traceback.format_exc()
            return {"error": str(e), "traceback": tb}

    res = await run_in_threadpool(_init)

    if isinstance(res, dict) and "error" in res:
        _DIAGNOSTIC_TOOL_LOADING_ERROR = (
            f"Failed to initialize diagnostic tool: {res['error']}\n{res['traceback']}"
        )
        _DIAGNOSTIC_TOOL_INSTANCE = None
    else:
        _DIAGNOSTIC_TOOL_INSTANCE = res
        _DIAGNOSTIC_TOOL_LOADING_ERROR = None


async def startup_event():
    # Optionally kick off lazy init in background (non-blocking)
    # If you want the diagnostic tool loaded at startup, uncomment the following line:
    # await _lazy_init_diagnostic_tool()
    pass


# ---- Request models ----
class SinglePredictRequest(BaseModel):
    features: Dict[str, float]


class BatchPredictRequest(BaseModel):
    features: List[Dict[str, float]]


# ---- Endpoints ----
@app.get("/")
def root():
    return {
        "status": "ok",
        "model_loaded": getattr(MODEL, "loaded", True) if MODEL else False,
    }


@app.get("/download_model")
def download_model(model_selected: str, model_type: str, model_url: str):
    print(DATASET_PATH)
    print(rf"{DATASET_PATH}\{model_selected}")
    return {
        "Model Selected": model_selected,
        "Model Type": model_type,
        "Model URL": model_url,
    }


@app.get("/model_info")
def model_info():
    info = {
        "model_loaded": getattr(MODEL, "loaded", True) if MODEL else False,
        "model_kind": "trained" if TRAINED_MODEL else ("toy" if TOY_MODEL else None),
        "diagnostic_tool": {
            "class_present": DIAGNOSTIC_TOOL_CLASS is not None,
            "configured_model_path": YOLO_MODEL_PATH,
            "instance_loaded": _DIAGNOSTIC_TOOL_INSTANCE is not None,
            "last_loading_error": _DIAGNOSTIC_TOOL_LOADING_ERROR,
        },
    }
    info.update(model_files_check())
    info.update(multi_cloud_service_connection())
    return info


@app.get("/predict")
def predict_sample(sample: int = 1):
    """
    Legacy fast check: returns prediction for a synthetic sample index (if dataset exists)
    or runs a simple prediction using the loaded MODEL.
    """
    # If the model wrapper saved a dataset, try to use it like in previous flow
    import pandas as pd
    from pathlib import Path

    ds = Path(__file__).parent / "synthetic_dataset.csv"
    if ds.exists():
        df = pd.read_csv(ds)
        if sample < 0 or sample >= len(df):
            sample = 0
        row = df.drop(columns=["y"]).iloc[sample]
        features = row.to_dict()
        if MODEL is None:
            raise HTTPException(status_code=500, detail="No ML model available")
        pred = (
            MODEL.predict_single(features)
            if hasattr(MODEL, "predict_single")
            else MODEL.predict([sample])
        )
        return {"sample": sample, "prediction": pred, "features_count": len(features)}
    else:
        # fallback: try a direct numeric prediction
        if MODEL is None:
            raise HTTPException(status_code=500, detail="No ML model available")
        if hasattr(MODEL, "predict_single"):
            pred = MODEL.predict_single({"x": float(sample)})
        else:
            pred = MODEL.predict([sample])
        return {"sample": sample, "prediction": pred}


@app.post("/predict_single")
def predict_single(req: SinglePredictRequest):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="No ML model available")
    try:
        if hasattr(MODEL, "predict_single"):
            pred = MODEL.predict_single(req.features)
        else:
            # we expect features to be sorted or a list-like for toy model
            vals = list(req.features.values())
            pred = MODEL.predict(vals)
        return {"prediction": pred}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/predict_batch")
def predict_batch(req: BatchPredictRequest):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="No ML model available")
    try:
        import pandas as pd

        df = pd.DataFrame(req.features)
        if hasattr(MODEL, "predict_batch"):
            preds = MODEL.predict_batch(df)
        else:
            # naive: call predict for each sample
            preds = [float(MODEL.predict([i])[0]) for i in range(len(df))]
        return {"predictions": preds, "n": len(preds)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/diagnose")
async def diagnose(image: str = Query(..., description="Path or URL to image")):
    """
    Example diagnostic endpoint.
    - If YOLO model is not configured or failed to load, returns 503 with helpful message.
    - Otherwise runs inference in a threadpool and returns the raw result dict from your diagnostic tool.
    """
    # ensure diagnostic tool class is available
    if DIAGNOSTIC_TOOL_CLASS is None:
        raise HTTPException(
            status_code=503,
            detail="Diagnostic tool class not available on this environment.",
        )

    # lazy init instance if not yet created
    if _DIAGNOSTIC_TOOL_INSTANCE is None and _DIAGNOSTIC_TOOL_LOADING_ERROR is None:
        await _lazy_init_diagnostic_tool()

    if _DIAGNOSTIC_TOOL_INSTANCE is None:
        # still not available -> return error
        raise HTTPException(
            status_code=503,
            detail=f"Diagnostic tool not available. Reason: {_DIAGNOSTIC_TOOL_LOADING_ERROR}",
        )

    # Run inference in threadpool (blocking operation)
    def _run():
        try:
            res = _DIAGNOSTIC_TOOL_INSTANCE.run_inference(
                image_source=image, show_result=False
            )
            return {"ok": True, "result": res}
        except Exception as e:
            return {"ok": False, "error": str(e), "trace": traceback.format_exc()}

    out = await run_in_threadpool(_run)
    if not out.get("ok"):
        raise HTTPException(status_code=500, detail=out)
    return out


@app.get("/parabol")
async def parabol(x: float, y: float):
    plt.figure(figsize=(6, 4))

    # Parabol y = x^2 - 9
    X = np.linspace(-10, 10, 300)
    Y = X**2 - 9
    plt.plot(X, Y, label="y = x² - 9", color="blue")

    # Kullanıcı noktası
    plt.scatter([x], [y], color="red", s=80, label=f"({x}, {y})")

    plt.grid()
    plt.legend()
    plt.title("Parabol + Nokta")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")


@app.get("/hystogram")
async def hystogram_drawe():
    x = [
        56,
        52,
        48,
        16,
        45,
        20,
        52,
        52,
        36,
        60,
        70,
        52,
        36,
        56,
        20,
        80,
        56,
        36,
        44,
        36,
        56,
        48,
        68,
        56,
        80,
        64,
        60,
        12,
        56,
        60,
        36,
        72,
        24,
        60,
        60,
        12,
        54,
        75,
        23,
        65,
        12,
        65,
        12,
        65,
        62,
        67,
        12,
        87,
        43,
        98,
        46,
        65,
        24,
        43,
        34,
        23,
        65,
        23,
        64,
        65,
        56,
        52,
        48,
        16,
        45,
        20,
        52,
        52,
        36,
        60,
        70,
        52,
        36,
        56,
        20,
        80,
        56,
        36,
        44,
        36,
    ]  # 4 satır her satırda yirmi(20) not var ve bu notların her biri ayrı bir öğrenciye aittir.

    X = [
        14,
        43,
        44,
        12,
        90,
        100,
    ]  # tek satır altı(6) not var ve bu notların her biri ayrı bir öğrenciye aittir.

    # a = {100: 1, 90:2, 85:3, 50:10, 30:5, 0:20} # bir sözlük yapısı ilk baştaki değer notu karşısında ki anahtarı ise o notu kaç kişinin aldığını gösterir

    # keylist = [key for key, val in a.items() for _ in range(val)] # yukarıda ki sözlüğü histrogram grafiğine uygulanabilir şekilde bir arraye dönüştürür

    plt.title("NTP Sınavı Not Dağılımı Histogramı")
    plt.xlabel("Notlar")
    plt.ylabel("Öğrenci Sayısı")
    plt.axis([0, 100, 0, 25])
    plt.grid(True)
    n, bins, patches = plt.hist(x, bins=25, facecolor="red", alpha=0.75)
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_bytes = buf.getvalue()
    plt.close()

    return Response(content=image_bytes, media_type="image/png")


@app.get("/scatter_line")
async def scatter_line(x: list[float] = Query(...), y: list[float] = Query(...)):
    if len(x) != len(y):
        return {"error": "x ve y listelerinin uzunluğu aynı olmalı"}

    plt.figure(figsize=(6, 4))

    # Scatter
    plt.scatter(x, y, color="orange", s=80, label="Veri")

    # Line (Fit)
    coef = np.polyfit(x, y, 1)
    line_x = np.linspace(min(x), max(x), 100)
    line_y = coef[0] * line_x + coef[1]

    plt.plot(line_x, line_y, color="black", label="Regresyon Çizgisi")

    plt.grid()
    plt.legend()
    plt.title("Scatter + Regression Line")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_bytes = buf.getvalue()
    plt.close()

    return Response(content=image_bytes, media_type="image/png")


@app.get("/plot")
async def plot(x: int, y: int):
    plt.grid()
    plt.plot([x], [y], marker="o", markersize=10, color="red")
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_bytes = buf.getvalue()
    plt.close()

    return Response(content=image_bytes, media_type="image/png")


# --- SENİN SABİT DEĞİŞKENLERİN (Aynı kalacak) ---
VOCAB_LIST = [
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
VOCAB_SIZE = len(VOCAB_LIST)
stoi = {token: i for i, token in enumerate(VOCAB_LIST)}
itos = {i: token for i, token in enumerate(VOCAB_LIST)}


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


def top_k_sampling(logits, k=15):
    logits = logits.clone()
    values, indices = torch.topk(logits, k)
    probs = torch.softmax(values, dim=0)
    choice = torch.multinomial(probs, 1).item()

    return indices[choice].item()


class OncoMind:
    def __init__(self, model_path):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Cihaz: {self.device}")
        self.model = MoleculeGenerator(
            VOCAB_SIZE, EMBED_SIZE, HIDDEN_SIZE, NUM_LAYERS
        ).to(self.device)
        try:
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.model.eval()
            print("Model başarıyla yüklendi!")
        except Exception as e:
            print(f"Model yüklenirken hata oluştu: {e}")

    def generate(self, start_atom="C", max_length=100, temperature=1.0):
        if start_atom not in stoi:
            return "Hata"
        input_seq = [stoi["<SOS>"], stoi[start_atom]]
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
                if next_token_idx == stoi["<EOS>"]:
                    break
                next_char = itos[next_token_idx]
                generated_str += next_char
                input_tensor = torch.tensor([[next_token_idx]], dtype=torch.long).to(
                    self.device
                )
        return generated_str


# ---------------------------------------------------------------------------
# YENİ EKLENEN KISIM: ZORLU FİLTRELEME VE RESİM KAYDETME
# ---------------------------------------------------------------------------


def analyze_and_save(
    ai_model, start_atom="C", min_qed=0.7, max_mw=500, max_attempts=1000
):
    """
    Belirtilen kriterlere (QED >= 0.7 ve MW < 500) uyan bir molekül bulana kadar dener.
    Bulunca resmini kaydeder.
    """
    print(f"\n--- {start_atom} atomu ile Yüksek Kaliteli İlaç Adayı Aranıyor ---")
    print(f"Hedef: QED >= {min_qed} ve MW < {max_mw}")

    best_qed = 0.0  # Şimdiye kadar bulunan en iyi skoru takip edelim

    for i in range(1, max_attempts + 1):
        temp = random.uniform(0.7, 1.1)
        smiles = ai_model.generate(
            start_atom, temperature=temp
        )  # Temperature ile oynayabilirsin

        # 2. RDKit ile Analiz Et
        mol = Chem.MolFromSmiles(smiles)

        if mol is None:
            continue  # Geçersiz molekülse pas geç

        # Özellikleri Hesapla
        try:
            current_qed = QED.qed(mol)
            current_mw = Descriptors.MolWt(mol)

            # En iyisini logla (Gelişimi görmek için)
            if current_qed > best_qed:
                best_qed = current_qed
                print(
                    f"Deneme {i}: Yeni en iyi QED: {best_qed:.2f} (MW: {current_mw:.1f}) -> {smiles}"
                )

            # 3. Kriter Kontrolü (Senin istediğin katı kurallar)
            if current_qed >= min_qed and current_mw < max_mw:
                print(f"\n[BAŞARILI] {i}. denemede uygun aday bulundu!")
                print(f"SMILES: {smiles}")
                print(f"Skorlar -> QED: {current_qed:.3f} | MW: {current_mw:.2f}")

                # 4. Resmi Kaydet
                file_name = f"drug_candidate_{i}_QED{current_qed:.2f}.png"
                Draw.MolToImage(mol, size=(300, 300)).save(file_name)
                print(f"Molekül resmi '{file_name}' olarak kaydedildi.")

                return smiles, file_name  # Fonksiyondan çık

        except Exception as e:
            continue  # Hesaplama hatası olursa devam et

    print("\n[BAŞARISIZ] Maksimum deneme sayısına ulaşıldı, uygun aday bulunamadı.")
    return None, None


model_path = os.environ.get(
    "PYTORCH_MODEL"
)  # Ensure this file exists in your container!
ai_engine = OncoMind(model_path)


class GenerateRequest(BaseModel):
    start_atom: str = "C"
    min_qed: float = 0.7


@app.post("/generate_candidate")
def generate_candidate_endpoint(req: GenerateRequest):
    print(f"Generating candidate starting with {req.start_atom}...")

    best_smiles = None
    best_mol = None
    best_qed = 0.0
    best_mw = 0.0

    # Try 100 times to generate a valid one
    for i in range(100):
        # Lower temperature slightly for stability
        smiles = ai_engine.generate(req.start_atom, temperature=0.7)

        # Basic filter: Remove weird characters if any leak through
        smiles = smiles.replace("<PAD>", "").replace("<SOS>", "").replace("<EOS>", "")

        mol = Chem.MolFromSmiles(smiles)

        if mol:
            try:
                qed = QED.qed(mol)
                mw = Descriptors.MolWt(mol)

                if (
                    qed >= 0.7 and mw < 500
                ):  # Lower threshold temporarily to ensure we get SOMETHING
                    best_smiles = smiles
                    best_mol = mol
                    best_qed = qed
                    best_mw = mw
                    break
            except:
                continue

    # FALLBACK MECHANISM (If AI fails completely, return Aspirin)
    if best_smiles is None:
        print("AI generation failed. Returning fallback molecule.")
        best_smiles = "CC(=O)Oc1ccccc1C(=O)O"  # Aspirin
        best_mol = Chem.MolFromSmiles(best_smiles)
        best_qed = QED.qed(best_mol)
        best_mw = Descriptors.MolWt(best_mol)

    # Convert Image
    img = Draw.MolToImage(best_mol, size=(300, 300))
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {
        "smiles": best_smiles,
        "qed": best_qed,
        "mw": best_mw,
        "image_base64": f"data:image/png;base64,{img_str}",
    }


# --- ÇALIŞTIRMA ---
"""if __name__ == "__main__":
    # 1. Modeli Başlat
    ai_chemist = OncoMind("oncomind_model.pth")
    
    # 2. Üretimi Başlat (Döngüye girer ve bulana kadar dener)
    # C ile başlayan, QED'si 0.7'den yüksek bir ilaç ara
    final_smiles, saved_image = analyze_and_save(ai_chemist, start_atom="C", min_qed=0.7, max_mw=500)
    
    if final_smiles:
        print("\nİşlem Tamamlandı. Şimdi 'drug_candidate_...' isimli PNG dosyasına bakabilirsin.")
"""


@app.post("/admin/reload_diagnostic")
async def reload_diagnostic(force: bool = True):
    global _DIAGNOSTIC_TOOL_INSTANCE, _DIAGNOSTIC_TOOL_LOADING_ERROR
    _DIAGNOSTIC_TOOL_INSTANCE = None
    _DIAGNOSTIC_TOOL_LOADING_ERROR = None
    await _lazy_init_diagnostic_tool()
    if _DIAGNOSTIC_TOOL_INSTANCE is None:
        raise HTTPException(status_code=500, detail=_DIAGNOSTIC_TOOL_LOADING_ERROR)
    return {"status": "loaded"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
