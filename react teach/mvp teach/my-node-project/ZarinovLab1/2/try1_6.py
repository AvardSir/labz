import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('white noiz.mp3', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if input_signal.ndim == 1:
    input_signal = np.expand_dims(input_signal, axis=0)  # Преобразуем в 2D массив для единообразия

# Уменьшаем значения всех отсчетов
input_signal /= 3.0

# Получить длину данных аудиофайла
N = input_signal.shape[1]
T = N / Fd
t = np.linspace(0, T, N)

# Вычисляем спектр входного сигнала
Spectr_input = np.fft.fft(input_signal, axis=1)

# Преобразуем в дБ:
AS_input = np.abs(Spectr_input)
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)

# Нормализация амплитуд
input_signal = input_signal / np.max(np.abs(input_signal))

# Задаем граничные частоты диапазона усиления, в Герцах
lower_frequency = 4000
upper_frequency = 10000

# Переводим Герцы в целочисленные индексы массива:
n_dn = round(N * lower_frequency / Fd)
n_up = round(N * upper_frequency / Fd)

# Создаем массив коэффициентов усиления
W = np.ones_like(Spectr_input)

# Усиливаем диапазон 4..10 кГц в 3 раза
W[:, n_dn:n_up + 1] = 3.0  # первая половина
W[:, N - n_up:N - n_dn + 1] = 3.0  # 'зеркальная' половина

# Применяем фильтр
Spectr_output = Spectr_input * W

# Обратное БПФ от модифицированного спектра:
output_signal = np.real(np.fft.ifft(Spectr_output, axis=1))

# Нормализация выходного сигнала
output_signal = output_signal / np.max(np.abs(output_signal))

# Выводим графики амплитуды от времени
plt.figure(figsize=(12, 6))
plt.subplot(2, 1, 1)
plt.plot(t, input_signal[0, :], color='b', label='Входной сигнал')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')
plt.legend()
plt.grid()

plt.subplot(2, 1, 2)
plt.plot(t, output_signal[0, :], color='r', label='Выходной сигнал')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал')
plt.legend()
plt.grid()

plt.tight_layout()
plt.show()

# Записываем новый аудиофайл
sf.write('output.wav', np.transpose(output_signal), Fd)
