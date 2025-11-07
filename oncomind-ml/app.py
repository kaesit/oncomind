# oncomind-ml/app.py
from fastapi import FastAPI
from model_stub import MODEL

from scripts_py.diagnostic_tool import YOLODiagnosticTool
app = FastAPI(title='OncoMind ML Service')


MODEL_PATH = "MODEL_PATH" # Örnek model adı
DIAGNOSTIC_TOOL = YOLODiagnosticTool(model_path=MODEL_PATH)

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

# ... diğer fonksiyonlarınız ...

async def mri_and_real_time_diagnosis(image_path: str = "default_mri_image.jpg"):
    """
    Bu fonksiyon artık yeni sınıfı kullanıyor.
    """
    # run_inference metodunu doğrudan çağırabilirsiniz.
    results = DIAGNOSTIC_TOOL.run_inference(image_source=image_path, show_result=False)
    
    # Sonuçları burada işleyebilir veya geri döndürebilirsiniz.
    print(f"Diagnosis results: {results}")


# Çalıştırmak için:
# uvicorn app:app --reload --host 0.0.0.0 --port 8000
