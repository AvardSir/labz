import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf

# Загрузка файла output.mp3
audio_file = 'output.mp3'
y, sr = librosa.load(audio_file, sr=None, mono=False)  # Загрузка стерео-аудио

# Если аудио моно, преобразуем его в стерео
if len(y.shape) == 1:
    y = np.vstack((y, y))

# Нормировка сигнала
Norm = np.max(np.abs(y))
if Norm != 0:
    y = y / Norm

# Функция для визуализации амплитудного спектра
def plot_amplitude_spectrum(y_channel, channel_name):
    Spectr_input = np.fft.fft(y_channel)  # БПФ для канала
    AS_input = np.abs(Spectr_input)  # Модуль спектра
    eps = np.max(AS_input) * 1.0e-9  # Чтобы избежать log(0)
    S_dB_input = 20 * np.log10(AS_input + eps)  # Спектр в дБ

    # Набор частот для оси X
    f = np.arange(0, sr / 2, sr / len(S_dB_input))
    S_dB_input = S_dB_input[:len(f)]  # Выравниваем длины

    # Вычисление Max_dB
    Max_dB = np.ceil(np.max(S_dB_input) / 20) * 20

    # Построение графика амплитудного спектра
    plt.figure(figsize=(10, 6))
    plt.semilogx(f, S_dB_input)  # График в полулогарифмическом масштабе
    plt.axvline(x=3000, color='r', linestyle='--', label='3000 Гц')  # Добавление вертикальной линии на 3000 Гц
    plt.text(3000, Max_dB - 10, '3000 Гц', color='r', fontsize=10, ha='center')  # Добавление текста на график
    plt.grid(True)
    plt.minorticks_on()  # Мелкая сетка для логарифмического масштаба
    plt.grid(True, which='major', color='#444', linewidth=1)
    plt.grid(True, which='minor', color='#aaa', ls=':')
    plt.axis([10, sr / 2, Max_dB - 100, Max_dB])  # Ограничение осей
    plt.xlabel('Частота (Гц)')
    plt.ylabel('Уровень (дБ)')
    plt.title(f'Амплитудный спектр ({channel_name} канал)')
    plt.legend()  # Добавление легенды
    plt.show()

# Визуализация амплитудного спектра для левого и правого каналов
plot_amplitude_spectrum(y[0, :], 'Левый')
plot_amplitude_spectrum(y[1, :], 'Правый')

# Функция для визуализации спектрограммы
def plot_spectrogram(y_channel, channel_name):
    plt.figure(figsize=(10, 6))
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y_channel)), ref=np.max)
    librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.xlabel('Время (с)')
    plt.ylabel('Частота (Гц)')
    plt.title(f'Спектрограмма ({channel_name} канал)')

    # Добавление отметки на 3000 Гц на спектрограмме
    plt.axhline(y=3000, color='r', linestyle='--', label='3000 Гц')  # Добавление горизонтальной линии на 3000 Гц
    plt.text(0, 3000, '3000 Гц', color='r', fontsize=10, ha='right')  # Добавление текста на график
    plt.legend()  # Добавление легенды
    plt.show()

# Визуализация спектрограммы для левого и правого каналов
plot_spectrogram(y[0, :], 'Левый')
plot_spectrogram(y[1, :], 'Правый')
