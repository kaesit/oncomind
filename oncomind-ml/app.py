import os
from dotenv import load_dotenv
from pathlib import Path
import traceback
from typing import Dict, Any, List, Optional
import matplotlib
# "Agg" stands for Anti-Grain Geometry. It is a non-interactive backend
# that only writes to files/buffers and never tries to open a window.
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import numpy as np
import io

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool


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
YOLO_MODEL_PATH = os.environ.get('YOLO_MODEL_PATH') # Should be /app/models/yolo_best.pt in Docker

# ... inside @app.get("/check") ...
@app.get("/check")
def model_files_check() -> Dict[str, Any]:
    checks = {
        "csv_found": CSV_PATH.exists(),
        "csv_path": CSV_PATH,
        "yolo_path_configured": YOLO_MODEL_PATH,
        "yolo_file_exists": Path(YOLO_MODEL_PATH).exists() if YOLO_MODEL_PATH else False,
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
    return FileResponse(
        path=CSV_PATH,
        media_type="text/csv",
        filename="dataset.csv"
    )

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
def download_model(model_selected:str, model_type:str, model_url:str):
    print(DATASET_PATH)
    print(rf"{DATASET_PATH}\{model_selected}")
    return {
        "Model Selected": model_selected,
        "Model Type": model_type,
        "Model URL" : model_url
        
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
    x = [56, 52, 48, 16, 45, 20, 52, 52, 36, 60, 70, 52, 36, 56, 20, 80, 56, 36, 44, 36,
     56, 48, 68, 56, 80, 64, 60, 12, 56, 60, 36, 72, 24, 60, 60, 12, 54, 75, 23, 65, 
     12, 65, 12, 65, 62, 67, 12, 87, 43, 98, 46, 65, 24, 43, 34, 23, 65, 23, 64, 65,
     56, 52, 48, 16, 45, 20, 52, 52, 36, 60, 70, 52, 36, 56, 20, 80, 56, 36, 44, 36] # 4 satır her satırda yirmi(20) not var ve bu notların her biri ayrı bir öğrenciye aittir.

    X = [14, 43, 44, 12, 90, 100] # tek satır altı(6) not var ve bu notların her biri ayrı bir öğrenciye aittir.

    #a = {100: 1, 90:2, 85:3, 50:10, 30:5, 0:20} # bir sözlük yapısı ilk baştaki değer notu karşısında ki anahtarı ise o notu kaç kişinin aldığını gösterir

    #keylist = [key for key, val in a.items() for _ in range(val)] # yukarıda ki sözlüğü histrogram grafiğine uygulanabilir şekilde bir arraye dönüştürür

    plt.title("NTP Sınavı Not Dağılımı Histogramı")
    plt.xlabel("Notlar")
    plt.ylabel("Öğrenci Sayısı")
    plt.axis([0, 100, 0, 25])
    plt.grid(True)
    n, bins, patches = plt.hist(x, bins=25,facecolor='red', alpha=0.75)
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


@app.post("/admin/reload_diagnostic")
async def reload_diagnostic(force: bool = True):
    global _DIAGNOSTIC_TOOL_INSTANCE, _DIAGNOSTIC_TOOL_LOADING_ERROR
    _DIAGNOSTIC_TOOL_INSTANCE = None
    _DIAGNOSTIC_TOOL_LOADING_ERROR = None
    await _lazy_init_diagnostic_tool()
    if _DIAGNOSTIC_TOOL_INSTANCE is None:
        raise HTTPException(status_code=500, detail=_DIAGNOSTIC_TOOL_LOADING_ERROR)
    return {"status": "loaded"}
