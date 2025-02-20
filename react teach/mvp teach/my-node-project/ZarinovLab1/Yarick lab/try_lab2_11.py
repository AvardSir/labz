import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

# Загрузка файла output.mp3
audio_file = 'output.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)  # Загрузка стерео-аудио

# Нормировка сигнала
Norm = np.max(np.abs(y))
if Norm != 0:
    y = y / Norm

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
    f = np.linspace(0, sr / 2, len(S_dB_left) // 2)  # Частоты от 0 до Nyquist
    S_dB_left = S_dB_left[:len(f)]  # Выравниваем длины
    S_dB_right = S_dB_right[:len(f)]  # Выравниваем длины

    # Построение графика амплитудного спектра
    plt.figure(figsize=(12, 6))
    plt.semilogx(f, S_dB_left[:len(f)], label='Левый канал', color='blue')  # График для левого канала
    plt.semilogx(f, S_dB_right[:len(f)], label='Правый канал', color='orange')  # График для правого канала
    plt.title('Амплитудный спектр (Левый и Правый каналы)', fontsize=16)
    plt.xlabel('Частота (Гц)', fontsize=14)
    plt.ylabel('Уровень (дБ)', fontsize=14)
    plt.xlim(20, sr / 2)  # Ограничение по частоте (от 20 Гц до Nyquist)
    plt.ylim(-100, 0)  # Ограничение по уровню (например, от -100 дБ до 0 дБ)
    plt.grid(True, which='both', linestyle='--', linewidth=0.5)
    plt.legend(fontsize=12)
    plt.tight_layout()  # Автоматическая настройка отступов
    plt.show()

# Визуализация амплитудного спектра для обоих каналов
plot_amplitude_spectrum_combined(y[0, :], y[1, :])
