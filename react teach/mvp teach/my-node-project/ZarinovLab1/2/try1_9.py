import numpy as np
import matplotlib.pyplot as plt
import librosa
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('white noiz.mp3', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if input_signal.ndim == 1:
    input_signal = np.expand_dims(input_signal, axis=0)  # Преобразуем в 2D массив для единообразия

# Получить длину данных аудиофайла
N = input_signal.shape[1]
T = N / Fd
t = np.linspace(0, T, N)

# Нормализация входного сигнала
input_signal = input_signal / np.max(np.abs(input_signal))

# Обратное БПФ от модифицированного спектра:
output_signal = input_signal  # Для примера, используем входной сигнал как выходной

# Нормализация выходного сигнала
output_signal = output_signal / np.max(np.abs(output_signal))

# Выводим графики исходного аудиосигнала и после обработки:
start_t, stop_t = 0, T
plt.figure(figsize=(8, 6))

# График входного аудиосигнала
plt.subplot(2, 1, 1)
plt.plot(t, input_signal[0])
plt.xlim([start_t, stop_t])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')

# График выходного аудиосигнала
plt.subplot(2, 1, 2)
plt.plot(t, output_signal[0])
plt.xlim([start_t, stop_t])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал')

plt.tight_layout()
plt.show()

# Записываем новый аудиофайл
sf.write('output.wav', np.transpose(output_signal), Fd)
