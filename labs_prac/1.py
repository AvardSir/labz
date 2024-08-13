import numpy as np
import matplotlib.pyplot as plt

def my_cos(x, n_terms):
    result = np.zeros_like(x)

    for n in range(n_terms):
        term = ((-1)**n * x**(2*n)) / np.math.factorial(2*n)
        result += term
    return result

def my_exp(x, n_terms):
    result = np.zeros_like(x)
    for n in range(n_terms):
        term = x**n / np.math.factorial(n)
        result += term
    return result

x_cos = np.linspace(-np.pi, np.pi, 400)
x_exp = np.linspace(-2*np.pi, 2*np.pi, 400)
n_terms = 10

true_cos = np.cos(x_cos)
approx_cos = my_cos(x_cos, n_terms)

true_exp = np.exp(x_exp)
approx_exp = my_exp(x_exp, n_terms)

plt.figure(figsize=(14, 6))

# График для cos(x)
plt.subplot(1, 2, 1)
plt.plot(x_cos, true_cos, label='Точное значение cos(x)', color='blue')
plt.plot(x_cos, approx_cos, '--', label=f'Приближенное значение cos(x) (n={n_terms})', color='red')
plt.xlabel('x')
plt.ylabel('cos(x)')
plt.title('Функция cos(x)')
plt.legend()
plt.grid(True)

# График для exp(x)
plt.subplot(1, 2, 2)
plt.plot(x_exp, true_exp, label='Точное значение e^x', color='blue')
plt.plot(x_exp, approx_exp, '--', label=f'Приближенное значение e^x (n={n_terms})', color='red')
plt.xlabel('x')
plt.ylabel('e^x')
plt.title('Функция e^x')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
