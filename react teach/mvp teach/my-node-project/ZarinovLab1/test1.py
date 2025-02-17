import numpy as np
import matplotlib.pyplot as plt

# Параметры
frequency = 1  # Частота в Гц
duration = 1   # Длительность в секундах
sampling_rate = 1000  # Частота дискретизации в Гц

# Временной вектор
t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)

# Генерация синусоидальной волны
wave = np.sin(2 * np.pi * frequency * t)

# Визуализация
plt.plot(t, wave)
plt.title('Синусоидальная волна')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.grid()
plt.show()
