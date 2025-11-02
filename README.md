# OncoMind — AI-driven Cancer Analysis Starter

## 🚀 Quickstart (Local, Requires Docker)

```bash
# from repo root
docker compose up --build
# open frontend: http://localhost:5173
# API: http://localhost:5000/api/predict?sample=1
# ML service: http://localhost:8000/predict?sample=1
````

---

## 🧪 Test

### Test Files

#### early_diagnosis_test_from_image.py

Run with:

```bash
python early_diagnosis_test_from_image.py --model MODEL_PATH\<model_name>.pt --test-image PATH_OR_URL
```

---

## 🔄 Converters

### Torch → ONNX

Run with:

```bash
python torch_to_onnx.py --model MODEL_PATH\<model_name>.pt --output OUTPUT_PATH\<model_name>.onnx
```

````

---

### 🧠 Explanation
- You were missing a closing <code>```</code> after your first code block — that caused Markdown to treat everything else as code, breaking all heading formatting.  
- I added icons (optional but nice for visual clarity).
- Each section now has:
  - `##` → main sections (`Quickstart`, `Test`, `Converters`)
  - `###` → subsections (`Test Files`, etc.)
  - `####` → specific items (`early_diagnosis_test_from_image.py`)

---

Would you like me to make it **GitHub-styled with a table of contents** at the top (auto-links to each section)? It looks really clean in repos.
````
