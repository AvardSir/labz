import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf
from scipy import signal

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('sound-effects-library-camp-fire-burning.mp3', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if input_signal.ndim == 1:
    input_signal = np.expand_dims(input_signal, axis=0)  # Преобразуем в 2D массив

# Уменьшаем значения всех отсчетов
input_signal /= 3.0

# Получить длину данных аудиофайла
N = input_signal.shape[1]
T = N / Fd

t = np.linspace(0, T, N)

# Параметры фильтра
order = 4  # Порядок фильтра
lower_frequency, upper_frequency = 4000, 10000

# Создание полосового фильтра
sos = signal.butter(order, [lower_frequency / (Fd / 2), upper_frequency / (Fd / 2)], btype='bandpass', output='sos')

# Фильтрация сигнала
filtered_signal = signal.sosfilt(sos, input_signal)

# Усиление в диапазоне
K = 3  # Усиление в 3 раза
output_signal = input_signal + (K - 1) * filtered_signal

# Нормализация сигналов
input_signal = input_signal / np.max(np.abs(input_signal))
output_signal = output_signal / np.max(np.abs(output_signal))

# Графики временных сигналов
plt.figure(figsize=(8, 6))
plt.subplot(2, 1, 1)
plt.plot(t, input_signal[0])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')
plt.subplot(2, 1, 2)
plt.plot(t, output_signal[0])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал')
plt.tight_layout()
plt.show()

# Спектральный анализ
f = np.linspace(0, Fd / 2, N // 2)
Spectr_input = np.fft.fft(input_signal, axis=1)
Spectr_output_real = np.fft.fft(output_signal, axis=1)
AS_input = np.abs(Spectr_input[:, :len(f)])
AS_output = np.abs(Spectr_output_real[:, :len(f)])
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)
S_dB_output_real = 20 * np.log10(AS_output + eps)

plt.figure(figsize=(10, 6))
plt.subplot(2, 1, 1)
plt.semilogx(f, S_dB_input[0], color='b', label='Входной спектр')
plt.title('Амплитудный спектр входного сигнала')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()
plt.subplot(2, 1, 2)
plt.semilogx(f, S_dB_output_real[0], color='r', label='Выходной спектр')
plt.title('Амплитудный спектр выходного сигнала')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()

# Спектрограммы
n_fft = 2048
hop_length = n_fft // 2
D_input = librosa.stft(input_signal[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_output = librosa.stft(output_signal[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_db_input = librosa.amplitude_to_db(np.abs(D_input), ref=np.max)
D_db_output = librosa.amplitude_to_db(np.abs(D_output), ref=np.max)

plt.figure(figsize=(14, 8))
plt.subplot(2, 1, 1)
librosa.display.specshow(D_db_input, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма входного сигнала')
plt.colorbar(label='Амплитуда (дБ)')
plt.subplot(2, 1, 2)
librosa.display.specshow(D_db_output, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма выходного сигнала')
plt.colorbar(label='Амплитуда (дБ)')
plt.tight_layout()
plt.show()

# Запись аудиофайла
sf.write('output_recursive.wav', np.transpose(output_signal), Fd)

