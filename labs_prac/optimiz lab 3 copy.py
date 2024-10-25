import matplotlib.pyplot as plt
import math
from math import cos, pi, sqrt
def f(x):
    return cos(x - 2 * pi / 3)

def f_neg(x):
    return -f(x)

a = -5 * pi / 3
b = -2 * pi / 3
epsilon = 2**(-16)
N = 100

def uniform_search(f, a, b, epsilon, N):
    n = N
    min_x = a
    min_f = f(a)
    max_tin = b - a

    for i in range(1, n + 1):
        x = a + i * (b - a) / n
        f_x = f(x)
        if f_x < min_f:
            min_f = f_x
            min_x = x
        current_tin = (b - a) / (i + 1)
        max_tin = min(max_tin, current_tin)
        if current_tin < epsilon:
            break
            
    return min_x, min_f, max_tin, i

def dichotomy_method(f, a, b, epsilon, N):
    delta = epsilon / 2
    max_tin = b - a
    n = 0
    while (b - a) / 2 > epsilon and n < N:
        x1 = (a + b) / 2 - delta
        x2 = (a + b) / 2 + delta
        if f(x1) < f(x2):
            b = x2
        else:
            a = x1
        max_tin = min(max_tin, b - a)
        n += 1
    return (a + b) / 2, f((a + b) / 2), max_tin, n

def fibonacci_method(f, a, b, epsilon, N):
    fib = [0, 1]
    while fib[-1] < (b - a) / epsilon:
        fib.append(fib[-1] + fib[-2])
    
    n = min(len(fib) - 1, N)
    k = 0
    x1 = a + fib[n-2] / fib[n] * (b - a)
    x2 = a + fib[n-1] / fib[n] * (b - a)
    
    f1 = f(x1)
    f2 = f(x2)
    max_tin = b - a
    # дадада
    while k < n - 2 and (b - a) > epsilon:
        k += 1
        if f1 > f2:
            a = x1
            x1 = x2
            f1 = f2
            x2 = a + fib[n-k-1] / fib[n-k] * (b - a)
            f2 = f(x2)
        else:
            b = x2
            x2 = x1
            f2 = f1
            x1 = a + fib[n-k-2] / fib[n-k] * (b - a)
            f1 = f(x1)
        max_tin = min(max_tin, b - a)
    
    return (x1 + x2) / 2, f((x1 + x2) / 2), max_tin, k

def golden_section_search(f, a, b, epsilon, N):
    phi = (1 + sqrt(5)) / 2
    resphi = 2 - phi
    
    x1 = a + resphi * (b - a)
    x2 = b - resphi * (b - a)
    
    f1 = f(x1)
    f2 = f(x2)
    max_tin = b - a
    n = 0
    
    while abs(b - a) > epsilon and n < N:
        if f1 < f2:
            b = x2
            x2 = x1
            f2 = f1
            x1 = a + resphi * (b - a)
            f1 = f(x1)
        else:
            a = x1
            x1 = x2
            f1 = f2
            x2 = b - resphi * (b - a)
            f2 = f(x2)
        max_tin = min(max_tin, b - a)
        n += 1
    
    return (a + b) / 2, f((a + b) / 2), max_tin, n

epsilon_values = [2**(-i) for i in range(1, 20)]
iterations_list = []

methods = [
    ("Метод равномерного поиска", uniform_search),
    ("Метод дихотомии", dichotomy_method),
    ("Метод Фибоначчи", fibonacci_method),
    ("Метод золотого сечения", golden_section_search)
]

results = []

for name, method in methods:
    iterations_per_epsilon = []
    for eps in epsilon_values:
        result, value, max_tin, iterations = method(f_neg, a, b, eps, N)  # Используем f_neg
        iterations_per_epsilon.append(iterations)
    
    result, value, max_tin, iterations = method(f_neg, a, b, epsilon, N)
    results.append((name, result, -value, max_tin, iterations))  # Инвертируем значение обратно
    iterations_list.append(iterations_per_epsilon)

plt.figure(figsize=(10, 6))

for i, (name, _) in enumerate(methods):
    plt.plot(epsilon_values, iterations_list[i], label=name)

plt.xscale('log')
plt.yscale('log')
plt.xlabel('Эпсилон')
plt.ylabel('Итерации')
plt.title('Зависимость числа итераций от погрешности')
plt.legend()
plt.grid(True)
plt.show()

for name, result, value, max_tin, iterations in results:
    print(f"{name}:\tМаксимум x = {result:.6f}\tf(x) = {value:.6f}\tМаксимальная длина ТИН = {max_tin:.6f}\tИтерации = {iterations}")
