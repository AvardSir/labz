import matplotlib.pyplot as plt
import numpy as np
from scipy.special import gamma

# Параметры распределения
labmda =  1  # Параметр λ (интенсивность)
k_values = [1]  # Разные значения k

# Создание массива x
x = np.linspace(0, 10, 500)

# Построение графиков для разных значений k
plt.figure(figsize=(10, 6))
for k in k_values:
    f = (labmda**k * x**(k-1) * np.exp(-labmda * x)) / gamma(k)
    plt.plot(x, f, label=f'Эрланговское распределение (k={k}, λ={labmda})')

# Настройка графика
plt.title(f'Эрланговское распределение для λ: {labmda} k: {k_values}')
plt.xlabel('Время (x)')
plt.ylabel('Плотность вероятности (f(x))')

# Устанавливаем дискретные метки для оси x
plt.xticks(np.arange(0, 11, 1))  # Дискретные значения от 0 до 10 с шагом 1

plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
