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
    f = np.arange(0, sr / 2, sr / len(S_dB_left))
    S_dB_left = S_dB_left[:len(f)]  # Выравниваем длины
    S_dB_right = S_dB_right[:len(f)]  # Выравниваем длины

    # Построение графика амплитудного спектра
    plt.figure(figsize=(10, 6))
    plt.semilogx(f, S_dB_left, label='Левый канал')  # График для левого канала
    plt.semilogx(f, S_dB_right, label='Правый канал')  # График для правого канала
    plt.text(3000, np.max(S_dB_left) - 10, '3000 Гц', color='r', fontsize=10, ha='center')  # Добавление текста на график
    plt.grid(True)
    plt.minorticks_on()  # Мелкая сетка для логарифмического масштаба
    plt.grid(True, which='major', color='#444', linewidth=1)
    plt.grid(True, which='minor', color='#aaa', ls=':')
    plt.xlim(2200, 4000)  # Ограничение по частоте
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.title('Амплитудный спектр (Левый и Правый каналы)')
    plt.legend()  # Добавление легенды

    # Установка пользовательских меток на оси X
    ticks = [2200, 2500, 3000, 3500, 4000]  # Задаем значения для меток
    plt.xticks(ticks, [str(tick) for tick in ticks])  # Устанавливаем метки на оси X

    plt.show()

# Визуализация амплитудного спектра для обоих каналов
plot_amplitude_spectrum_combined(y[0, :], y[1, :])
