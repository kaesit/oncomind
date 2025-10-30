# oncomind-ml/tests/test_ml.py
from model_stub import MODEL

def test_predict_shape():
    out = MODEL.predict([0,1,2])
    assert isinstance(out, list)
    assert len(out) == 3
