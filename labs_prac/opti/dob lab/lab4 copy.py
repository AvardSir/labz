import matplotlib.pyplot as plt
import numpy as np
from math import factorial

# Параметры распределения
k = 1  # Параметр k (число событий)
l = 1  # Параметр λ (интенсивность)

# Создание массива x
x = np.linspace(0, 1, 200)

# Вычисление функции плотности вероятности для эрланговского распределения
f = (l**k * x ** (k-1) * np.exp(-l * x)) / factorial(k - 1)

# Построение графика
plt.figure(figsize=(10, 6))
plt.plot(x, f, color='limegreen')

# Использование форматирования строк для заголовка
plt.title(f'График эрланговского распределения при k = {k} и λ = {l}')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid()
plt.tight_layout()
plt.show()
