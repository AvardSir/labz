
import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt("experimental_data.txt", skiprows=1)
x_values = data[:, 0]
yn_values = data[:, 1]

log_x = np.log(x_values)
log_y = np.log(yn_values)

A = np.vstack([-log_x, np.ones(len(log_x))]).T
b_est, log_a_est = np.linalg.lstsq(A, log_y, rcond=None)[0]

a_est = np.exp(log_a_est)

x_fit = np.linspace(min(x_values), max(x_values), 100)
y_fit = a_est * x_fit ** (-b_est)

a_true = 2
b_true = 1.5
y_true_fit = a_true * x_fit ** (-b_true)

plt.scatter(x_values, yn_values, label='Экспериментальные данные')
plt.plot(x_fit, y_fit, color='red', label=f'Оцененная функция: y = {a_est:.2f} * x^(-{b_est:.2f})', linewidth=2)
plt.plot(x_fit, y_true_fit, color='green', linestyle='dashed', label=f'Исходная функция: y = {a_true} * x^(-{b_true})', linewidth=2)

plt.xlim(min(x_values) * 0.9, max(x_values) * 1.1)
plt.ylim(min(yn_values) * 0.9, max(yn_values) * 1.1)

plt.xlabel("x")
plt.ylabel("yn")
plt.title("Сравнение экспериментальных данных, оцененной функции и исходной функции")
plt.legend()
plt.grid(True)
plt.show()
