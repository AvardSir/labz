import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

audio_file = 'bohemian_rhapsody_07. Queen - Bohemian Rhapsody.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)

start_t = 0
stop_t = y.shape[1] / sr

fig, ax = plt.subplots(nrows=1, sharex=True, figsize=(10, 4))
ax.set(xlim=[start_t, stop_t])
librosa.display.waveshow(y[0, :], sr=sr, color='b', ax=ax, label='Левый канал')
librosa.display.waveshow(y[1, :], sr=sr, color='r', ax=ax, label='Правый канал')
ax.label_outer()
ax.legend()
ax.grid()
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Волновая форма аудиосигнала Богемской Рапсодии (Левый и Правый каналы)')
plt.show()

def plot_amplitude_spectrum_combined(y_left, y_right):
    Spectr_left = np.fft.fft(y_left)
    Spectr_right = np.fft.fft(y_right)
    AS_left = np.abs(Spectr_left)
    AS_right = np.abs(Spectr_right)

    S_dB_left = librosa.amplitude_to_db(AS_left, ref=np.max)
    S_dB_right = librosa.amplitude_to_db(AS_right, ref=np.max)

    f = np.linspace(0, sr, len(S_dB_left))[:len(S_dB_left)//2]
    S_dB_left = S_dB_left[:len(f)]
    S_dB_right = S_dB_right[:len(f)]

    plt.figure(figsize=(10, 6))
    plt.plot(f, S_dB_left[:len(f)], label='Левый канал')
    plt.plot(f, S_dB_right[:len(f)], label='Правый канал')
    plt.grid(True)
    plt.xlim(0, sr / 2)
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.title('Амплитудный спектр Богемской Рапсодии (Левый и Правый каналы)')
    plt.legend()
    plt.show()

plot_amplitude_spectrum_combined(y[0, :], y[1, :])

def plot_spectrogram_combined(y_left, y_right):
    plt.figure(figsize=(10, 6))
    
    D_left = librosa.amplitude_to_db(librosa.stft(y_left), ref=np.max)
    plt.subplot(2, 1, 1)
    librosa.display.specshow(D_left, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма Богемской Рапсодии (Левый канал)')
    plt.ylim(0, sr // 2)
    
    D_right = librosa.amplitude_to_db(librosa.stft(y_right), ref=np.max)
    plt.subplot(2, 1, 2)
    librosa.display.specshow(D_right, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма Богемской Рапсодии (Правый канал)')
    plt.ylim(0, sr // 2)

    plt.tight_layout()
    plt.show()

plot_spectrogram_combined(y[0, :], y[1, :])
