import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf
from scipy import signal

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('white noiz.mp3', sr=None, mono=False)

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

# Создание полосового фильтра (для усиления)
sos_bandpass = signal.butter(order, [lower_frequency / (Fd / 2), upper_frequency / (Fd / 2)], btype='bandpass', output='sos')

# Создание режекторного фильтра (для удаления)
sos_bandstop = signal.butter(order, [lower_frequency / (Fd / 2), upper_frequency / (Fd / 2)], btype='bandstop', output='sos')

# Фильтрация сигнала (усиление диапазона)
filtered_signal_bandpass = signal.sosfilt(sos_bandpass, input_signal)
K = 3  # Усиление в 3 раза
output_signal_bandpass = input_signal + (K - 1) * filtered_signal_bandpass

# Фильтрация сигнала (режекторный фильтр)
output_signal_bandstop = signal.sosfilt(sos_bandstop, input_signal)

# Нормализация сигналов
input_signal = input_signal / np.max(np.abs(input_signal))
output_signal_bandpass = output_signal_bandpass / np.max(np.abs(output_signal_bandpass))
output_signal_bandstop = output_signal_bandstop / np.max(np.abs(output_signal_bandstop))

# Графики временных сигналов
plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
plt.plot(t, input_signal[0], color='b')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')
plt.grid(True)

plt.subplot(3, 1, 2)
plt.plot(t, output_signal_bandpass[0], color='g')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал (усиление 4-10 кГц)')
plt.grid(True)

plt.subplot(3, 1, 3)
plt.plot(t, output_signal_bandstop[0], color='r')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал (режекторный фильтр 4-10 кГц)')
plt.grid(True)

plt.tight_layout()
plt.show()

# Спектральный анализ
f = np.linspace(0, Fd / 2, N // 2)
Spectr_input = np.fft.fft(input_signal, axis=1)
Spectr_bandpass = np.fft.fft(output_signal_bandpass, axis=1)
Spectr_bandstop = np.fft.fft(output_signal_bandstop, axis=1)
AS_input = np.abs(Spectr_input[:, :len(f)])
AS_bandpass = np.abs(Spectr_bandpass[:, :len(f)])
AS_bandstop = np.abs(Spectr_bandstop[:, :len(f)])
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)
S_dB_bandpass = 20 * np.log10(AS_bandpass + eps)
S_dB_bandstop = 20 * np.log10(AS_bandstop + eps)

plt.figure(figsize=(12, 12))
plt.subplot(3, 1, 1)
plt.semilogx(f, S_dB_input[0], color='b', label='Входной спектр')
plt.title('Амплитудный спектр входного сигнала')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()

plt.subplot(3, 1, 2)
plt.semilogx(f, S_dB_bandpass[0], color='g', label='Выходной спектр (усиление 4-10 кГц)')
plt.title('Амплитудный спектр выходного сигнала (усиление 4-10 кГц)')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()

plt.subplot(3, 1, 3)
plt.semilogx(f, S_dB_bandstop[0], color='r', label='Выходной спектр (режекторный фильтр 4-10 кГц)')
plt.title('Амплитудный спектр выходного сигнала (режекторный фильтр 4-10 кГц)')
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
D_bandpass = librosa.stft(output_signal_bandpass[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_bandstop = librosa.stft(output_signal_bandstop[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_db_input = librosa.amplitude_to_db(np.abs(D_input), ref=np.max)
D_db_bandpass = librosa.amplitude_to_db(np.abs(D_bandpass), ref=np.max)
D_db_bandstop = librosa.amplitude_to_db(np.abs(D_bandstop), ref=np.max)

plt.figure(figsize=(14, 12))
plt.subplot(3, 1, 1)
librosa.display.specshow(D_db_input, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма входного сигнала')
plt.colorbar(label='Амплитуда (дБ)')

plt.subplot(3, 1, 2)
librosa.display.specshow(D_db_bandpass, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма выходного сигнала (усиление 4-10 кГц)')
plt.colorbar(label='Амплитуда (дБ)')

plt.subplot(3, 1, 3)
librosa.display.specshow(D_db_bandstop, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма выходного сигнала (режекторный фильтр 4-10 кГц)')
plt.colorbar(label='Амплитуда (дБ)')

plt.tight_layout()
plt.show()

# Запись аудиофайлов
# sf.write('output_bandpass.wav', np.transpose(output_signal_bandpass), Fd)
sf.write('output_bandstop.wav', np.transpose(output_signal_bandstop), Fd)