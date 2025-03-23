import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display

# Загрузка файла output.mp3
audio_file = 'output.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)

# Нормировка сигнала
Norm = np.max(np.abs(y))
if Norm != 0:
    y = y / Norm

# Визуализация общего вида записи сигнала
def plot_signal(y, sr):
    plt.figure(figsize=(12, 4))
    time = np.linspace(0, y.shape[1] / sr, num=y.shape[1])
    plt.plot(time, y[0], label='Левый канал')
    plt.plot(time, y[1], label='Правый канал')
    plt.title('Общий вид записи сигнала')
    plt.xlabel('Время (с)')
    plt.ylabel('Амплитуда')
    plt.legend()
    plt.grid()
    plt.show()

# Визуализация короткого фрагмента сигнала
def plot_signal_fragment(y, sr, start_time=0, duration=1):
    start_sample = int(start_time * sr)
    end_sample = int((start_time + duration) * sr)
    plt.figure(figsize=(12, 4))
    time = np.linspace(start_time, start_time + duration, num=end_sample - start_sample)
    plt.plot(time, y[0][start_sample:end_sample], label='Левый канал')
    plt.plot(time, y[1][start_sample:end_sample], label='Правый канал')
    plt.title('Короткий фрагмент сигнала')
    plt.xlabel('Время (с)')
    plt.ylabel('Амплитуда')
    plt.legend()
    plt.grid()
    plt.show()

# Визуализация амплитудного спектра
def plot_amplitude_spectrum(y_left, y_right, sr):
    Spectr_left = np.fft.fft(y_left)
    Spectr_right = np.fft.fft(y_right)
    AS_left = np.abs(Spectr_left)
    AS_right = np.abs(Spectr_right)

    S_dB_left = librosa.amplitude_to_db(AS_left, ref=np.max)
    S_dB_right = librosa.amplitude_to_db(AS_right, ref=np.max)

    f = np.arange(0, sr / 2, sr / len(S_dB_left))
    S_dB_left = S_dB_left[:len(f)]
    S_dB_right = S_dB_right[:len(f)]

    plt.figure(figsize=(10, 6))
    plt.semilogx(f, S_dB_left, label='Левый канал')
    plt.semilogx(f, S_dB_right, label='Правый канал')
    plt.title('Амплитудный спектр (Левый и Правый каналы)')
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.legend()
    plt.grid()
    plt.xlim(20, sr / 2)
    plt.show()

# Визуализация спектрограммы
def plot_spectrogram(y_left, y_right, sr):
    plt.figure(figsize=(10, 6))
    
    D_left = librosa.amplitude_to_db(np.abs(librosa.stft(y_left)), ref=np.max)
    plt.subplot(2, 1, 1)
    librosa.display.specshow(D_left, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма (Левый канал)')
    plt.ylim(20, 8000)

    D_right = librosa.amplitude_to_db(np.abs(librosa.stft(y_right)), ref=np.max)
    plt.subplot(2, 1, 2)
    librosa.display.specshow(D_right, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма (Правый канал)')
    plt.ylim(20, 8000)

    plt.tight_layout()
    plt.show()

# Визуализация
plot_signal(y, sr)
plot_signal_fragment(y, sr, start_time=0, duration=1)  # Фрагмент 1 секунда
plot_amplitude_spectrum(y[0], y[1], sr)
plot_spectrogram(y[0], y[1], sr)

   
