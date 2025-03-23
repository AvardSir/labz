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

# Функция для вычисления амплитудного спектра
def compute_amplitude_spectrum(y_channel):
    Spectr_input = np.fft.fft(y_channel)  # БПФ для канала
    AS_input = np.abs(Spectr_input)  # Модуль спектра
    f = np.arange(0, sr / 2, sr / len(AS_input))  # Набор частот
    AS_input = AS_input[:len(f)]  # Выравниваем длины
    return f, AS_input


# Функция для вычисления спектрограммы
def compute_spectrogram(y_channel, ax):
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y_channel)), ref=np.max)
    img = librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log', ax=ax)
    return img

# Создание фигуры с subplots
fig, axs = plt.subplots(2, 2, figsize=(15, 12))

# Левый канал: амплитудный спектр
f_left, S_dB_left = compute_amplitude_spectrum(y[0, :])
Max_dB_left = np.ceil(np.max(S_dB_left) / 20) * 20
axs[0, 0].semilogx(f_left, S_dB_left, label='Левый канал')
# axs[0, 0].axvline(x=3000, color='r', linestyle='--', label='3000 Гц')
axs[0, 0].text(3000, Max_dB_left - 10, '3000 Гц', color='r', fontsize=10, ha='center')
axs[0, 0].grid(True)
axs[0, 0].minorticks_on()
axs[0, 0].grid(True, which='major', color='#444', linewidth=1)
axs[0, 0].grid(True, which='minor', color='#aaa', ls=':')
axs[0, 0].set_xlim([10, sr / 2])
axs[0, 0].set_ylim([0, np.max(S_dB_left)])  # Для левого канала

axs[0, 0].set_xlabel('Частота (Гц)')
axs[0, 0].set_ylabel('Уровень (дБ)')
axs[0, 0].set_title('Амплитудный спектр (Левый канал)')
axs[0, 0].legend()

# Левый канал: спектрограмма
img_left = compute_spectrogram(y[0, :], axs[0, 1])
# axs[0, 1].axhline(y=3000, color='r', linestyle='--', label='3000 Гц')
axs[0, 1].text(0, 3000, '3000 Гц', color='r', fontsize=10, ha='right')
axs[0, 1].set_xlabel('Время (с)')
axs[0, 1].set_ylabel('Частота (Гц)')
axs[0, 1].set_title('Спектрограмма (Левый канал)')
axs[0, 1].legend()

# Правый канал: амплитудный спектр
f_right, S_dB_right = compute_amplitude_spectrum(y[1, :])
Max_dB_right = np.ceil(np.max(S_dB_right) / 20) * 20
axs[1, 0].semilogx(f_right, S_dB_right, label='Правый канал')
# axs[1, 0].axvline(x=3000, color='r', linestyle='--', label='3000 Гц')
axs[1, 0].text(3000, Max_dB_right - 10, '3000 Гц', color='r', fontsize=10, ha='center')
axs[1, 0].grid(True)
axs[1, 0].minorticks_on()
axs[1, 0].grid(True, which='major', color='#444', linewidth=1)
axs[1, 0].grid(True, which='minor', color='#aaa', ls=':')
axs[1, 0].set_xlim([10, sr / 2])
axs[1, 0].set_ylim([0, np.max(S_dB_right)])  # Для правого канала

axs[1, 0].set_xlabel('Частота (Гц)')
axs[1, 0].set_ylabel('Уровень (дБ)')
axs[1, 0].set_title('Амплитудный спектр (Правый канал)')
axs[1, 0].legend()

# Правый канал: спектрограмма
img_right = compute_spectrogram(y[1, :], axs[1, 1])
# axs[1, 1].axhline(y=3000, color='r', linestyle='--', label='3000 Гц')
axs[1, 1].text(0, 3000, '3000 Гц', color='r', fontsize=10, ha='right')
axs[1, 1].set_xlabel('Время (с)')
axs[1, 1].set_ylabel('Частота (Гц)')
axs[1, 1].set_title('Спектрограмма (Правый канал)')
axs[1, 1].legend()

# Добавление цветовой шкалы для спектрограмм
fig.colorbar(img_left, ax=axs[0, 1], format='%+2.0f dB')
fig.colorbar(img_right, ax=axs[1, 1], format='%+2.0f dB')

# Улучшение компоновки
plt.tight_layout()
plt.show()

