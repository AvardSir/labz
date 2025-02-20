import numpy as np
import matplotlib.pyplot as plt

# Параметры
f = 5          # Частота синусоиды в герцах (5 Гц)
Fd = 50        # Частота дискретизации в герцах (50 Гц)
N = 100        # Количество выборок

# Генерация временных меток
t = np.arange(N) / Fd  # Временные метки от 0 до (N-1)/Fd

# Генерация синусоидального сигнала
signal = np.sin(2 * np.pi * f * t)  # Синусоидальный сигнал

# Визуализация
plt.figure(figsize=(10, 4))
plt.plot(t, signal, label='Синусоидальный сигнал (5 Гц)')
plt.title('Синусоидальный сигнал')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.grid()
plt.axhline(0, color='black', lw=0.5, ls='--')  # Линия y=0
plt.legend()
plt.show()
