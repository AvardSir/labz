import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

# Загрузка файла output.mp3
audio_file = 'output.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)  # Загрузка стерео-аудио

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
    f = np.arange(0, sr / 2, sr / len(S_dB_left))
    S_dB_left = S_dB_left[:len(f)]  # Выравниваем длины
    S_dB_right = S_dB_right[:len(f)]  # Выравниваем длины

    # Построение графика амплитудного спектра
    plt.figure(figsize=(10, 6))
    plt.plot(f, S_dB_left, label='Левый канал')  # График для левого канала
    plt.plot(f, S_dB_right, label='Правый канал')  # График для правого канала
    # plt.text(3000, np.max(S_dB_left) - 10, '3000 Гц', color='r', fontsize=10, ha='center')  # Добавление текста на график
    plt.grid(True)
    plt.xlim(2300, 3700)  # Ограничение по частоте
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.title('Амплитудный спектр (Левый и Правый каналы)')
    plt.legend()  # Добавление легенды

    # Установка меток по оси X каждые 500 Гц
    # xticks = np.arange(2300, 4001, 500)  # Создаем массив меток от 2200 до 4000 с шагом 500
    # plt.xticks(xticks)  # Устанавливаем метки на оси X

    plt.show()



# Визуализация амплитудного спектра для обоих каналов
plot_amplitude_spectrum_combined(y[0, :], y[1, :])


# Функция для визуализации спектрограммы
# Функция для визуализации спектрограммы для обоих каналов
def plot_spectrogram_combined(y_left, y_right):
    plt.figure(figsize=(10, 6))
    
    # Спектрограмма для левого канала
    D_left = librosa.amplitude_to_db((librosa.stft(y_left)), ref=np.max)
    plt.subplot(2, 1, 1)  # Подграфик для левого канала
    librosa.display.specshow(D_left, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма (Левый канал)')
    plt.ylim(2100, 4000)  # Ограничение по частоте
    plt.text(0, 3000, '3000 Гц', color='r', fontsize=10, ha='right')  # Добавление текста на график

    # Спектрограмма для правого канала
    D_right = librosa.amplitude_to_db((librosa.stft(y_right)), ref=np.max)
    plt.subplot(2, 1, 2)  # Подграфик для правого канала
    librosa.display.specshow(D_right, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Спектрограмма (Правый канал)')
    plt.ylim(2100, 4000)  # Ограничение по частоте
    plt.text(0, 3000, '3000 Гц', color='r', fontsize=10, ha='right')  # Добавление текста на график

    plt.tight_layout()  # Автоматическая настройка отступов
    plt.show()

# Виз
plot_spectrogram_combined(y[0, :], y[1, :])


