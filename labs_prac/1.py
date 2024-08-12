import numpy as np

def y(x):
    # Используем функции из numpy для обработки массивов и комплексных чисел
    return (2 * (np.cos(x)**3)) / (3 + np.sin(2 * x)) + 4 * np.exp(-2 * x)

x_values = np.array([0.3, 0.4, 0.5, 0.8, 1.1, 1.3, 2.2])

# Вычисление значений функции
y_values = y(x_values)

# Вывод таблицы значений
print(f"{'x':>6} | {'y(x)':>10}")
print("-" * 20)
for x, y_val in zip(x_values, y_values):
    print(f"{x:6.1f} | {y_val:10.4f}")
