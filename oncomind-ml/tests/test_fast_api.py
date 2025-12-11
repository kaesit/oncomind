from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from unittest.mock import patch


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

client = TestClient(app)


def test_model_info_basic():
    response = client.get("/model_info")
    assert response.status_code == 200
    data = response.json()
    assert "model_loaded" in data
    assert "model_kind" in data
    assert "diagnostic_tool" in data


@patch("app.MODEL", object())
@patch("app.TRAINED_MODEL", True)
@patch("app.TOY_MODEL", False)
@patch("app.model_files_check", return_value={"model_files_ok": True})
@patch("app.multi_cloud_service_connection", return_value={"cloud_ok": True})
def test_model_info_mocked(*_):
    response = client.get("/model_info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_loaded"] is True
    assert data["model_kind"] == "trained"
    assert data["model_files_ok"] is True
    assert data["cloud_ok"] is True


def test_model_info_with_httpx():
    import httpx

    with httpx.Client(app=app, base_url="http://test") as client_httpx:
        response = client_httpx.get("/model_info")
        assert response.status_code == 200
        data = response.json()
        assert "diagnostic_tool" in data
