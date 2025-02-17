import numpy as np
import matplotlib.pyplot as plt

# Генерация случайного сигнала
np.random.seed(0)  # Для воспроизводимости
signal = np.random.randn(1000)  # Случайный сигнал с 1000 отсчетами

# Нормировка сигнала
def normalize_signal(signal):
    Norm = np.max(np.abs(signal))  # Находим максимальное значение по абсолютной величине
    if Norm > 0:  # Проверяем, что максимальное значение не равно нулю
        normalized_signal = signal / Norm  # Делим на максимальное значение для нормировки
    else:
        normalized_signal = signal  # Если Norm = 0, возвращаем оригинальный сигнал
    return normalized_signal

# Нормируем сигнал
normalized_signal = normalize_signal(signal)

# Визуализация оригинального и нормированного сигналов
plt.figure(figsize=(12, 6))

# Оригинальный сигнал
plt.subplot(2, 1, 1)
plt.plot(signal, label='Оригинальный сигнал', color='blue')
plt.title('Оригинальный сигнал')
plt.xlabel('Отсчеты')
plt.ylabel('Амплитуда')
plt.legend()
plt.grid()

# Нормированный сигнал
plt.subplot(2, 1, 2)
plt.plot(normalized_signal, label='Нормированный сигнал', color='orange')
plt.title('Нормированный сигнал')
plt.xlabel('Отсчеты')
plt.ylabel('Амплитуда')
plt.legend()
plt.grid()

plt.tight_layout()
plt.show()
