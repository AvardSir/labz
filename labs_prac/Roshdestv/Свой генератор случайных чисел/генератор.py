import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import time

def get(a, b):
    # Получаем текущее значение микросекунды
    current_date = datetime.now()
    x = current_date.microsecond  # Получаем текущее значение микросекунды
    result = (x**40 - x**23)

    # Нормализуем результат в диапазоне от a до b
    normalized_result = (result - a) / (b - a)
    return normalized_result


def get_random_values():
    # Генерируем два случайных числа
    x = get(0, 10)  # Случайное число от 0 до 10 для оси X
    
    time.sleep(0.000001)  # Задержка на 1 микросекунду
    y = get(0, 10)  # Случайное число от 0 до 10 для оси Y
    return x, y

# Списки для хранения значений
x_values = []
y_values = []

# Замеряем в течение 1 секунды
start_time = time.time()
while time.time() - start_time < 1:  # Замеры в течение 0.2 секунды
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
