import numpy as np
import matplotlib.pyplot as plt

# Параметры
Fd = 44100  # Частота дискретизации (в Гц)
T = 1       # Длительность сигнала (в секундах)
N = round(T * Fd)  # Общее количество отсчетов

# Создание временного вектора
t = np.arange(N) / Fd

# Генерация синусоидального сигнала с частотой 440 Гц (нота Ля)
frequency = 5  # Частота сигнала (в Гц)
amplitude = 0.5  # Амплитуда сигнала
signal = amplitude * np.sin(2 * np.pi * frequency * t)

# Визуализация сигнала
plt.figure(figsize=(10, 4))
plt.plot(t, signal)
plt.title('Синусоидальный сигнал с частотой 440 Гц')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.xlim(0, 1)  # Показываем только первые 10 мс
plt.grid()
plt.show()
