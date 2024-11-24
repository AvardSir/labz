import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import time

class get3_int:
    def __init__(self, seed):
        self.x = 3**30
        self.seed = (seed + self.x**(1/2))

    def random(self, a, b):
        # Генерация нового значения
        self.seed = -(self.seed + 33)
        # print(self.seed)
        # print('fff')
        # Нормализация в [a, b]
        normalized = (self.seed % (b - a))   # остаток от деления на (b-a)
        return a + normalized  # Сдвиг в диапазон [a, b)


ge = get3_int(30)
print('ge')
print([ge.random(0, 10) for _ in range(1000)])


def get_random_values():
    # Генерируем два случайных числа
    x = ge.random(0, 10)  # Случайное число от 0 до 10 для оси X
    
    
    y = ge.random(0, 10)  # Случайное число от 0 до 10 для оси Y
    return x, y

# Списки для хранения значений
x_values = []
y_values = []

# Замеряем в течение 1 секунды

N=10000
for i in range(N):
    x, y = get_random_values()
    x_values.append(x)
    y_values.append(y)
    

# Визуализация результатов
plt.scatter(x_values, y_values, alpha=0.5)
plt.title('Random Values Scatter Plot')
plt.xlabel('Random Value X')
plt.ylabel('Random Value Y')
plt.grid()
plt.show()
