# oncomind-ml/app.py
from fastapi import FastAPI
from model_stub import MODEL

app = FastAPI(title='OncoMind ML Service')

@app.get('/predict')
def predict(sample: int = 1):
    # sample parametresi örnek girdi gösterimi içindir
    scores = MODEL.predict([sample])
    return {"sample": sample, "scores": scores}

# Çalıştırmak için:
# uvicorn app:app --reload --host 0.0.0.0 --port 8000
