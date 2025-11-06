from sklearn.linear_model import LinearRegression
from sklearn import datasets


iris = datasets.load_iris()
digits = datasets.load_digits()

print(digits.data)  

digits.target