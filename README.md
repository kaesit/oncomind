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


## ⬇️ Requirements
#### Packages

```bash
fastapi
uvicorn[standard]
numpy
pandas
scikit-learn
pydantic
pytest
opencv-python
tensorflow
kaggle
```

#### How to install packages:
```bash
pip install -r requirements.txt
```


---

## 🧪 Test

### Test Files

#### early_diagnosis_test_from_image.py

Run with:

```bash
python early_diagnosis_test_from_image.py --model MODEL_PATH\<model_name>.pt --test-image PATH_OR_URL
```
#### test_or_diagnosis_from_video_source.py

Run with:

```bash
python early_diagnosis_test_from_image.py --model MODEL_PATH\<model_name>.pt --video-source VIDEO_PATH
```

---


## 🔄 Converters

### Torch → ONNX

Run with:

```bash
python torch_to_onnx.py --model MODEL_PATH\<model_name>.pt --output OUTPUT_PATH\<model_name>.onnx
```
