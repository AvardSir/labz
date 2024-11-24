import numpy as np
import matplotlib.pyplot as plt
from math import exp, factorial

def y(k, lambda_param):
    return (lambda_param**k / factorial(k)) * exp(-lambda_param)

# Параметр λ
lambda_param = 10

# Количество событий (k)
k_values = np.arange(0, 15)

# Вычисление вероятностей
probabilities = [y(k, lambda_param) for k in k_values]

# Визуализация
plt.bar(k_values, probabilities, color='blue', alpha=0.7)
plt.title(f'Распределение Пуассона (λ = {lambda_param})')
plt.xlabel('Количество событий (k)')
plt.ylabel('Вероятность P(X = k)')
plt.xticks(k_values)
plt.grid(axis='y')
plt.show()
