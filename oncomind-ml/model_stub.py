# oncomind-ml/model_stub.py
from sklearn.dummy import DummyRegressor
import numpy as np

class ToyModel:
    def __init__(self):
        self.model = DummyRegressor(strategy='mean')
        # fit on trivial data so predict works
        X = np.array([[0], [1], [2]])
        y = np.array([0.1, 0.2, 0.3])
        self.model.fit(X, y)

    def predict(self, x):
        # x: list-like
        arr = np.array(x).reshape(-1, 1)
        return self.model.predict(arr).tolist()

# instantiate a module-global model
MODEL = ToyModel()
