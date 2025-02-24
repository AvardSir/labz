import numpy as np
import matplotlib.pyplot as plt

# Параметры сигнала
A = 1.0          # Амплитуда
f0 = 5           # Начальная частота (Гц)
T = 1            # Длительность сигнала (с)
Fs = 100         # Частота дискретизации (Гц)
t = np.linspace(0, T, int(Fs * T), endpoint=False)  # Временной вектор

# Линейная модуляция частоты
f1 = 20          # Конечная частота (Гц)
k = (f1 - f0) / T  # Ускорение частоты
phi = 2 * np.pi * (f0 * t + 0.5 * k * t**2)  # Фаза

# Генерация ЛЧМ-сигнала
lcm_signal = A * np.cos(phi)

# Визуализация сигнала
plt.figure(figsize=(10, 4))
plt.plot(t, lcm_signal)
plt.title('Линейно-частотно-модулированный сигнал (ЛЧМ)')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.grid()
plt.show()
