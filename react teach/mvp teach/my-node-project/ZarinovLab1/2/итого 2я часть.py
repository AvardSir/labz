import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('Речь-Б.Ельцина-＂Я-ухожу＂-31.12.1999-полная-версия.mp3', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if input_signal.ndim == 1:
    input_signal = np.expand_dims(input_signal, axis=0)  # Преобразуем в 2D массив

# Уменьшаем значения всех отсчетов
input_signal /= 3.0

# Получить длину данных аудиофайла
N = input_signal.shape[1]
T = N / Fd

t = np.linspace(0, T, N)

# Вычисляем спектр входного сигнала
Spectr_input = np.fft.fft(input_signal, axis=1)

# Преобразуем в дБ
AS_input = np.abs(Spectr_input)
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)

# Задаем граничные частоты диапазона усиления, в Герцах
lower_frequency = 4000
upper_frequency = 10000

# Переводим Герцы в индексы массива
n_dn = round(N * lower_frequency / Fd)
n_up = round(N * upper_frequency / Fd)

# Создаем массив коэффициентов усиления
W = np.ones_like(Spectr_input)
W[:, n_dn:n_up + 1] = 3.0  # первая половина
W[:, N - n_up:N - n_dn + 1] = 3.0  # 'зеркальная' половина

# Применяем фильтр
Spectr_output = Spectr_input * W

# Обратное БПФ
output_signal = np.real(np.fft.ifft(Spectr_output, axis=1))

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
Spectr_output_real = np.fft.fft(output_signal, axis=1)
S_dB_output_real = 20 * np.log10(np.abs(Spectr_output_real[:, :len(f)]) + eps)
S_dB_input = S_dB_input[:, :len(f)]

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
sf.write('elzin_output.wav', np.transpose(output_signal), Fd)
