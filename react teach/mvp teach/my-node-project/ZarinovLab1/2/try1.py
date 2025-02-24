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

# Вычисляем спектр входного сигнала
Spectr_input = np.fft.fft(input_signal, axis=1)

# Преобразуем в дБ:
AS_input = np.abs(Spectr_input)
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)

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

# Полезно сравнить спектры до и после обработки,
# построив их на одном графике:
Spectr_output_real = np.fft.fft(output_signal, axis=1)
S_dB_output_real = 20 * np.log10(np.abs(Spectr_output_real + eps))

f = np.linspace(0, Fd / 2, N // 2)
S_dB_output_real = S_dB_output_real[:, :len(f)]
S_dB_input = S_dB_input[:, :len(f)]

plt.figure(figsize=(8, 3))
plt.semilogx(f, S_dB_input[0], color='b', label='input spectrum')
plt.semilogx(f, S_dB_output_real[0], color='r', label='output spectrum')
plt.grid(True)
plt.minorticks_on()
plt.grid(True, which='major', color='#444', linewidth=1)
plt.grid(True, which='minor', color='#aaa', ls=':')

Max_A = np.max((np.max(np.abs(Spectr_input)), np.max(np.abs(Spectr_output_real))))
Max_dB = np.ceil(np.log10(Max_A)) * 20
plt.axis([10, Fd / 2, Max_dB - 120, Max_dB])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Level (dB)')
plt.title('Amplitude Spectrums of input and output audio')
plt.legend()
plt.show()

# Выводим графики исходного аудиосигнала и после обработки:
start_t, stop_t = 0, T
plt.figure(figsize=(8, 6))
plt.subplot(2, 1, 1)
plt.plot(t, input_signal[0])
plt.xlim([start_t, stop_t])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Input Audio Signal')

plt.subplot(2, 1, 2)
plt.plot(t, output_signal[0])
plt.xlim([start_t, stop_t])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Output Audio Signal')
plt.tight_layout()
plt.show()

# Записываем новый аудиофайл
sf.write('output.wav', np.transpose(output_signal), Fd)
