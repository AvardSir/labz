import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звуковых файлов
signal_with_noise, Fd_with_noise = librosa.load('audio_with_noise.wav', sr=None, mono=False)
signal_without_noise, Fd_without_noise = librosa.load('audio_without_noise.wav', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if signal_with_noise.ndim == 1:
    signal_with_noise = np.expand_dims(signal_with_noise, axis=0)  # Преобразуем в 2D массив
if signal_without_noise.ndim == 1:
    signal_without_noise = np.expand_dims(signal_without_noise, axis=0)  # Преобразуем в 2D массив

# Нормализация сигналов
signal_with_noise = signal_with_noise / np.max(np.abs(signal_with_noise))
signal_without_noise = signal_without_noise / np.max(np.abs(signal_without_noise))

# Получить длину данных аудиофайлов
N_with_noise = signal_with_noise.shape[1]
N_without_noise = signal_without_noise.shape[1]
T_with_noise = N_with_noise / Fd_with_noise
T_without_noise = N_without_noise / Fd_without_noise

t_with_noise = np.linspace(0, T_with_noise, N_with_noise)
t_without_noise = np.linspace(0, T_without_noise, N_without_noise)

# Графики временных сигналов
plt.figure(figsize=(10, 8))
plt.subplot(2, 1, 1)
plt.plot(t_with_noise, signal_with_noise[0], color='b')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Аудиосигнал с шумом')
plt.xlim(0, min(1, T_with_noise))  # Устанавливаем пределы по оси X
plt.subplot(2, 1, 2)
plt.plot(t_without_noise, signal_without_noise[0], color='r')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Аудиосигнал без шума')
plt.xlim(0, min(1, T_without_noise))  # Устанавливаем пределы по оси X
plt.tight_layout()
plt.show()

# Спектральный анализ
f_with_noise = np.linspace(0, Fd_with_noise / 2, N_with_noise // 2)
f_without_noise = np.linspace(0, Fd_without_noise / 2, N_without_noise // 2)

Spectr_with_noise = np.fft.fft(signal_with_noise, axis=1)
Spectr_without_noise = np.fft.fft(signal_without_noise, axis=1)

S_dB_with_noise = 20 * np.log10(np.abs(Spectr_with_noise) + 1e-9)
S_dB_without_noise = 20 * np.log10(np.abs(Spectr_without_noise) + 1e-9)

plt.figure(figsize=(10, 6))
plt.subplot(2, 1, 1)
plt.semilogx(f_with_noise, S_dB_with_noise[0, :len(f_with_noise)], color='b', label='Спектр с шумом')
plt.title('Амплитудный спектр аудиосигнала с шумом')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()
plt.subplot(2, 1, 2)
plt.semilogx(f_without_noise, S_dB_without_noise[0, :len(f_without_noise)], color='r', label='Спектр без шума')
plt.title('Амплитудный спектр аудиосигнала без шума')
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()

# Спектрограммы
n_fft = 2048
hop_length = n_fft // 2
D_with_noise = librosa.stft(signal_with_noise[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_without_noise = librosa.stft(signal_without_noise[0], n_fft=n_fft, hop_length=hop_length, window='hann')
D_db_with_noise = librosa.amplitude_to_db(np.abs(D_with_noise), ref
    = np.max)
D_db_without_noise = librosa.amplitude_to_db(np.abs(D_without_noise), ref=np.max)

plt.figure(figsize=(14, 8))
plt.subplot(2, 1, 1)
librosa.display.specshow(D_db_with_noise, x_axis='time', y_axis='log', sr=Fd_with_noise, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма аудиосигнала с шумом')
plt.colorbar(label='Амплитуда (дБ)')
plt.subplot(2, 1, 2)
librosa.display.specshow(D_db_without_noise, x_axis='time', y_axis='log', sr=Fd_without_noise, hop_length=hop_length, cmap='magma')
plt.title('Спектрограмма аудиосигнала без шума')
plt.colorbar(label='Амплитуда (дБ)')
plt.tight_layout()
plt.show()
