import numpy as np
import matplotlib.pyplot as plt

# Параметры интеграла
a, b = 0, 1  # Пределы интегрирования
real_value = 0.310268  # Истинное значение интеграла (вычислено аналитически или численно)

# Функция, которую интегрируем
def f(x):
    return np.sin(x**2)

# Метод Монте-Карло
def monte_carlo_integrate(func, a, b, n):
    x_random = np.random.uniform(a, b, n)
    y_random = func(x_random)
    return (b - a) * np.mean(y_random)

# Вычисление с разным количеством точек
n_values = np.logspace(1, 5, 50, dtype=int)  # Количество точек от 10 до 100000
errors = []

for n in n_values:
    estimate = monte_carlo_integrate(f, a, b, n)
    error = abs(estimate - real_value)
    errors.append(error)

# Построение графика
plt.figure(figsize=(10, 6))
plt.plot(n_values, errors, label='Ошибка', marker='o', linestyle='-')
plt.xscale('log')
plt.yscale('log')
plt.xlabel('Количество точек (n)')
plt.ylabel('Ошибка')
plt.title('Точность метода Монте-Карло для интеграла sin(x^2)')
plt.grid(True, which="both", linestyle='--', linewidth=0.5)
plt.legend()
plt.show()
