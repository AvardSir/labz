import math
import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt

# Длительность в секундах
T = 10 + 1  # +1 потому что 1с в начале уберем, т.к. переходный процесс
Fd = 44100  # Частота дискретизации
Na = np.floor(T * Fd).astype(int)  # Общее количество отсчетов

# Генерация случайных данных для аудио
rng = np.random.default_rng()
audio_data = rng.uniform(-1, 1, (2, Na))  # Двумерный массив для аудио данных

# Параметры АР-модели 2-го порядка
ar2 = -0.99  # Коэффициент AR(2)
f0 = 1000  # Начальная частота

# Генерация аудио данных с использованием АР-модели
for n in range(2, Na - 1):
    f0 = f0 + 1 * audio_data[0, n]
    if f0 < 100:
        f0 = 100  # Ограничение минимальной частоты
    
    ar1 = 2 * (np.sqrt(-ar2)) * math.cos(2 * np.pi * f0 / Fd)
    b0 = 3
    
    audio_data[:, n] = ar1 * audio_data[:, n - 1] + \
                       ar2 * audio_data[:, n - 2] + \
                       b0 * audio_data[:, n + 1]
    
    if n > Fd:
        audio_data[:, n - 2] = audio_data[:, n - 2] * \
                                (1 - math.exp(-3 * (n - Fd) / Fd))

# Добавляем щелчки с изменяющимся интервалом
click_base_interval = 0.5 * Fd  # Базовый интервал в 0.5 сек
click_variation = 0.3 * Fd  # Максимальное отклонение от базового интервала
current_time = 0

while current_time < Na:
    click_int = int(click_base_interval + np.sin(current_time / (5 * Fd)) * click_variation)
    if current_time < Na:
        audio_data[:, current_time:current_time+10] = 1.0  # Щелчок в виде короткого импульса
    current_time += click_int

# Обнуление первых и последних отсчетов
audio_data[:, 0:Fd] = 0
audio_data[:, Na - 1] = 0

# Нормировка аудио данных
audio_data = audio_data / np.max(np.abs(audio_data))

# Записываем аудиофайл
sf.write('output3.mp3', np.transpose(audio_data), Fd)