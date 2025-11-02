# OncoMind — AI-driven cancer analysis starter

Quickstart (local, requires Docker):
```bash
# from repo root
docker compose up --build
# open frontend: http://localhost:5173
# API: http://localhost:5000/api/predict?sample=1
# ML service: http://localhost:8000/predict?sample=1



<h2> Test <h2/>

### Test Files
#### early_diagnosis_test_from_image.py
to run it -> python early_diagnosis_test_from_image.py --model MODEL_PATH\<model_name>.pt --test-image PATH_OR_URL

## Converters

Torch to Onnx

python torch_to_onnx.py --model MODEL_PATH\<model_name>.pt --output OUTPUT_PATH\<model_name>.onnx