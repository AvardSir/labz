import matplotlib.pyplot as plt
import numpy as np
from math import factorial

# Параметры распределения
k = 4  # Параметр k (число событий)
labmda = 20  # Параметр λ (интенсивность)

# Создание массива x
x = np.linspace(0, 1, 200)

# Вычисление функции плотности вероятности для эрланговского распределения
f = (labmda**k * x ** (k-1) * np.exp(-labmda * x)) / factorial(k - 1)

# Построение графика
plt.figure(figsize=(10, 6))
plt.plot(x, f, color='limegreen')

# Использование форматирования строк для заголовка
plt.title(f'График эрланговского распределения при k = {k} и λ = {labmda}')
plt.xlabel('Время (x)')
plt.ylabel('Плотность вероятности (f(x))')
plt.grid()
plt.tight_layout()
plt.show()
