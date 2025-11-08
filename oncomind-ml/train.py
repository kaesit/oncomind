# oncomind-ml/train.py
"""
Train a small baseline model on synthetic data and save artifacts:
 - model.joblib
 - scaler.joblib
This is intentionally simple and reproducible to give you a concrete baseline.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from pathlib import Path

OUT_DIR = Path(__file__).parent
MODEL_PATH = OUT_DIR / "model.joblib"
SCALER_PATH = OUT_DIR / "scaler.joblib"
DATA_PATH = OUT_DIR / "synthetic_dataset.csv"

def make_synthetic_dataset(n_samples=2000, n_genes=50, n_drug_feats=5, random_state=42):
    rng = np.random.RandomState(random_state)
    # Binary mutation features for genes
    gene_matrix = rng.binomial(1, p=0.12, size=(n_samples, n_genes)).astype(float)
    gene_cols = [f"g_{i}" for i in range(n_genes)]

    # Drug descriptor-like floats (toy)
    drug_matrix = rng.normal(loc=0.0, scale=1.0, size=(n_samples, n_drug_feats))
    drug_cols = [f"d_{i}" for i in range(n_drug_feats)]

    # Construct outcome (continuous "sensitivity" score) as linear combination + noise
    # simulate some genes being more predictive
    weights_genes = rng.normal(0, 1, n_genes)
    weights_drugs = rng.normal(0, 1, n_drug_feats)

    y = gene_matrix.dot(weights_genes) * 0.3 + drug_matrix.dot(weights_drugs) * 0.7
    y = (y - y.mean()) / (y.std() + 1e-9)  # standardize
    # Add noise
    y += rng.normal(0, 0.5, size=n_samples)

    df = pd.DataFrame(np.hstack([gene_matrix, drug_matrix]), columns=gene_cols + drug_cols)
    df["y"] = y
    return df

def train_and_save():
    df = make_synthetic_dataset()
    X = df.drop(columns=["y"])
    y = df["y"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestRegressor(n_estimators=200, random_state=1, n_jobs=-1)
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"[train] mse={mse:.4f}, r2={r2:.4f}")

    # Save artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    df.to_csv(DATA_PATH, index=False)

    print(f"[train] saved model -> {MODEL_PATH}")
    print(f"[train] saved scaler -> {SCALER_PATH}")
    print(f"[train] saved dataset -> {DATA_PATH}")

if __name__ == "__main__":
    train_and_save()
