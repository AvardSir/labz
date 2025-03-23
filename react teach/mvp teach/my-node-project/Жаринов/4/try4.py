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
f0 = 8000  # Начальная частота

# Генерация аудио данных с использованием АР-модели
for n in range(2, Na - 1):
    f0 = f0 + 1 * audio_data[0, n]
    if f0 < 100:
        f0 = 100  # Ограничение минимальной частоты
    
    ar1 = 2 * (np.sqrt(-ar2)) * math.cos(2 * np.pi * f0 / Fd)
    b0 = 1.73 * (1 + ar2) * ((1 - ar2)**2 - ar1**2) / (1 - ar2)
    
    audio_data[:, n] = ar1 * audio_data[:, n - 1] + \
                       ar2 * audio_data[:, n - 2] + \
                       b0 * audio_data[:, n + 1]
    
    if n > Fd:
        audio_data[:, n - 2] = audio_data[:, n - 2] * \
                                (1 - math.exp(-3 * (n - Fd) / Fd))

# Обнуление первых и последних отсчетов
audio_data[:, 0:Fd] = 0
audio_data[:, Na - 1] = 0

# Нормировка аудио данных
audio_data = audio_data / np.max(np.abs(audio_data))

# Построение графика спектра
Spectr_y = np.fft.fft(audio_data)
AS_y = np.abs(Spectr_y)
eps = np.max(AS_y) * 1.0e-9
S_dB_y = 20 * np.log10(AS_y + eps)
f = np.arange(0, Fd / 2, Fd / Na)
S_dB_y = S_dB_y[:, :len(f)]

plt.figure(figsize=(6, 4))
plt.semilogx(f, S_dB_y[0, :], color='b')
plt.grid(True)
plt.minorticks_on()
plt.grid(True, which='major', color='#444', linewidth=1)
plt.grid(True, which='minor', color='#aaa', ls=':')
Max_dB = np.ceil(np.log10(np.max(np.abs(Spectr_y)))) * 20
plt.axis([10, Fd / 2, Max_dB - 80, Max_dB])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Level (dB)')
plt.title('Amplitude Spectrum')
plt.show()

# Временная ось
t = np.arange(Na) / Fd

# Выводим график созданного процесса
plt.figure(figsize=(6, 3))
plt.subplot(2, 1, 1)
plt.plot(t, audio_data[0, :])
plt.xlim([0, T])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Left Channel')

plt.subplot(2, 1, 2)
plt.plot(t, audio_data[1, :])
plt.xlim([0, T])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Right Channel')

plt.tight_layout()
plt.show()

# Записываем аудиофайл
sf.write('output3.mp3', np.transpose(audio_data[:, Fd:]), Fd)
