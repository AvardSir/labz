import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf
from scipy import signal

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - моно
input_signal, Fd = librosa.load('audio_with_noise.wav', sr=None, mono=True)

# Получить длину данных аудиофайла
N = len(input_signal)
T = N / Fd

t = np.linspace(0, T, N)

# Параметры режекторного фильтра
order = 4  # Порядок фильтра
notch_frequency = 10000  # Частота, которую нужно убрать (10 кГц)
bandwidth = 100  # Ширина полосы заграждения

# Граничные частоты для режекторного фильтра
lower_frequency = notch_frequency - bandwidth / 2
upper_frequency = notch_frequency + bandwidth / 2

# Создание режекторного фильтра
sos_bandstop = signal.butter(order, [lower_frequency / (Fd / 2), upper_frequency / (Fd / 2)], btype='bandstop', output='sos')

# Применение режекторного фильтра
output_signal_bandstop = signal.sosfilt(sos_bandstop, input_signal)

# Нормализация сигналов
input_signal = input_signal / np.max(np.abs(input_signal))
output_signal_bandstop = output_signal_bandstop / np.max(np.abs(output_signal_bandstop))

# Графики временных сигналов
plt.figure(figsize=(12, 6))
plt.subplot(2, 1, 1)
plt.plot(t, input_signal, color='b')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(t, output_signal_bandstop, color='r')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал (режекторный фильтр 10 кГц)')
plt.grid(True)

plt.tight_layout()
plt.show()

# Спектральный анализ
f = np.linspace(0, Fd / 2, N // 2)
Spectr_input = np.fft.fft(input_signal)
Spectr_bandstop = np.fft.fft(output_signal_bandstop)
AS_input = np.abs(Spectr_input[:len(f)])
AS_bandstop = np.abs(Spectr_bandstop[:len(f)])
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)
S_dB_bandstop = 20 * np.log10(AS_bandstop + eps)

plt.figure(figsize=(12, 8))
plt.subplot(2, 1, 1)
plt.semilogx(f, S_dB_input, color='b', label='Входной спектр')
plt.title('Амплитудный спектр входного сигнала')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()

plt.subplot(2, 1, 2)
plt.semilogx(f, S_dB_bandstop, color='r', label='Выходной спектр (режекторный фильтр 10 кГц)')
plt.title('Амплитудный спектр выходного сигнала (режекторный фильтр 10 кГц)')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()

plt.tight_layout()
plt.show()

# Спектрограммы
n_fft = 2048
hop_length = n_fft // 2
D_input = librosa.stft(input_signal, n_fft=n_fft, hop_length=hop_length, window='hann')
D_bandstop = librosa.stft(output_signal_bandstop, n_fft=n_fft, hop_length=hop_length, window='hann')
D_db_input = librosa.amplitude_to_db(np.abs(D_input), ref=np.max)
D_db_bandstop = librosa.amplitude_to_db(np.abs(D_bandstop), ref=np.max)

plt.figure(figsize=(14, 8))
plt.subplot(2, 1, 1)
librosa.display.specshow(D_db_input, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма входного сигнала')
plt.colorbar(label='Амплитуда (дБ)')

plt.subplot(2, 1, 2)
librosa.display.specshow(D_db_bandstop, x_axis='time', y_axis='log', sr=Fd, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма выходного сигнала (режекторный фильтр 10 кГц)')
plt.colorbar(label='Амплитуда (дБ)')

plt.tight_layout()
plt.show()

# Запись аудиофайла
sf.write('output_bandstop.wav', output_signal_bandstop, Fd)

