# oncomind-ml/app.py
from fastapi import FastAPI
from model_stub import MODEL

app = FastAPI(title='OncoMind ML Service')

@app.get('/predict')
def predict(sample: int = 1):
    # sample parametresi örnek girdi gösterimi içindir
    scores = MODEL.predict([sample])
    return {"sample": sample, "scores": scores}


def model_files_check():
    pass


def multi_cloud_service_connection():
    pass

async def multi_model_async_functions():
    pass

async def mri_and_real_time_diagnosis():
    pass



# Çalıştırmak için:
# uvicorn app:app --reload --host 0.0.0.0 --port 8000
