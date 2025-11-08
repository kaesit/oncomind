# oncomind-ml/model_wrapper.py
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor

BASE = Path(__file__).parent
MODEL_PATH = BASE / "model.joblib"
SCALER_PATH = BASE / "scaler.joblib"

class ModelWrapper:
    def __init__(self):
        self.model = None
        self.scaler = None
        # If trained artifacts exist, load them. Otherwise fallback to dummy model.
        if MODEL_PATH.exists() and SCALER_PATH.exists():
            try:
                self.model = joblib.load(MODEL_PATH)
                self.scaler = joblib.load(SCALER_PATH)
                self.feature_columns = None  # will be inferred at first predict if needed
                self.loaded = True
                print("[model_wrapper] Loaded trained model and scaler.")
            except Exception as e:
                print("[model_wrapper] Failed to load artifacts:", e)
                self._fallback()
        else:
            print("[model_wrapper] Artifacts not found, using DummyRegressor fallback.")
            self._fallback()

    def _fallback(self):
        # Simple dummy regressor that predicts the mean
        self.model = DummyRegressor(strategy="mean")
        # fit to trivial data so predict works
        import numpy as np
        X = np.array([[0], [1], [2]])
        y = np.array([0.0, 0.1, 0.2])
        self.model.fit(X, y)
        self.scaler = None
        self.loaded = False

    def predict_batch(self, X_df):
        """
        X_df: pandas DataFrame (n_samples x n_features)
        returns: list of floats
        """
        if self.scaler is not None:
            Xs = self.scaler.transform(X_df.values)
        else:
            Xs = X_df.values
        preds = self.model.predict(Xs)
        return preds.tolist()

    def predict_single(self, feature_dict):
        """
        feature_dict: mapping feature_name -> value
        Accepts partial feature dict and will order features consistently if model was trained.
        """
        # If we have training columns saved in a CSV, infer order; otherwise sort keys
        cols = sorted(feature_dict.keys())
        vals = [feature_dict[c] for c in cols]
        import pandas as pd
        df = pd.DataFrame([vals], columns=cols)
        if self.scaler is not None:
            Xs = self.scaler.transform(df.values)
        else:
            Xs = df.values
        pred = self.model.predict(Xs)
        return float(pred[0])

# module-level instance for fast import
MODEL = ModelWrapper()
