import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

# Загрузка файла output.mp3
audio_file = 'bohemian_rhapsody_07. Queen - Bohemian Rhapsody.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)  # Загрузка стерео-аудио

start_t = 0
stop_t = y.shape[1] / sr  # Длина аудиосигнала в секундах

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

# Функция для визуализации амплитудного спектра для обоих каналов
def plot_amplitude_spectrum_combined(y_left, y_right):
    Spectr_left = np.fft.fft(y_left)  # БПФ для левого канала
    Spectr_right = np.fft.fft(y_right)  # БПФ для правого канала
    AS_left = np.abs(Spectr_left)  # Модуль спектра левого канала
    AS_right = np.abs(Spectr_right)  # Модуль спектра правого канала

    # Преобразование амплитуд в децибелы
    S_dB_left = librosa.amplitude_to_db(AS_left, ref=np.max)
    S_dB_right = librosa.amplitude_to_db(AS_right, ref=np.max)

    # Набор частот для оси X
    f = np.linspace(0, sr, len(S_dB_left))[:len(S_dB_left)//2]  # Частоты до Nyquist
    S_dB_left = S_dB_left[:len(f)]  # Выравниваем длины
    S_dB_right = S_dB_right[:len(f)]  # Выравниваем длины

    # Построение графика амплитудного спектра
    plt.figure(figsize=(10, 6))
    plt.plot(f, S_dB_left[:len(f)], label='Левый канал')  # График для левого канала
    plt.plot(f, S_dB_right[:len(f)], label='Правый канал')  # График для правого канала
    plt.grid(True)
    plt.xlim(0, sr / 2)  # Ограничение по частоте
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.title('Амплитудный спектр  Богемской Рапсодии (Левый и Правый каналы)')
    plt.legend()  # Добавление легенды
    plt.show()

# Визуализация амплитудного спектра для обоих каналов
plot_amplitude_spectrum_combined(y[0, :], y[1, :])

# Функция для визуализации спектрограммы
def plot_spectrogram_combined(y_left, y_right):
    plt.figure(figsize=(10, 6))
    
    # Спектрограмма для левого канала
    D_left = librosa.amplitude_to_db(librosa.stft(y_left), ref=np.max)
    plt.subplot(2, 1, 1)  # Подграфик для левого канала
    librosa.display.specshow(D_left, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма Богемской Рапсодии (Левый канал)')
    plt.ylim(0, sr // 2)  # Ограничение по частоте
    # Спектрограмма для правого канала
    D_right = librosa.amplitude_to_db(librosa.stft(y_right), ref=np.max)
    plt.subplot(2, 1, 2)  # Подграфик для правого канала
    librosa.display.specshow(D_right, sr=sr, x_axis='time', y_axis='log')

    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма Богемской Рапсодии (Правый канал)')
    plt.ylim(0, sr // 2)  # Ограничение по частоте

    plt.tight_layout()  # Автоматическая настройка отступов
    plt.show()

# Визуализация спектрограммы для обоих каналов
plot_spectrogram_combined(y[0, :], y[1, :])
