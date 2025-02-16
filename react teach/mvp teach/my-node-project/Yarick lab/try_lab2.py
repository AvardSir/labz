import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from scipy.signal import ShortTimeFFT
from scipy.signal.windows import gaussian
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

# Визуализация амплитудного спектра (левый канал)
Spectr_input = np.fft.fft(y[0, :])  # БПФ для левого канала
AS_input = np.abs(Spectr_input)  # Модуль спектра
eps = np.max(AS_input) * 1.0e-9  # Чтобы избежать log(0)
S_dB_input = 20 * np.log10(AS_input + eps)  # Спектр в дБ

# Набор частот для оси X
f = np.arange(0, sr / 2, sr / len(S_dB_input))
S_dB_input = S_dB_input[:len(f)]  # Выравниваем длины

# Построение графика амплитудного спектра
plt.figure(figsize=(10, 6))
plt.semilogx(f, S_dB_input)  # График в полулогарифмическом масштабе
plt.grid(True)
plt.minorticks_on()  # Мелкая сетка для логарифмического масштаба
plt.grid(True, which='major', color='#444', linewidth=1)
plt.grid(True, which='minor', color='#aaa', ls=':')
Max_dB = np.ceil(np.max(S_dB_input) / 20) * 20
plt.axis([10, sr / 2, Max_dB - 100, Max_dB])  # Ограничение осей
plt.xlabel('Частота (Гц)')
plt.ylabel('Уровень (дБ)')
plt.title('Амплитудный спектр (левый канал)')
plt.show()

# Визуализация спектрограммы (левый канал)
plt.figure(figsize=(10, 6))
D = librosa.amplitude_to_db(np.abs(librosa.stft(y[0, :])), ref=np.max)
librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.xlabel('Время (с)')
plt.ylabel('Частота (Гц)')
plt.title('Спектрограмма (левый канал)')
plt.show()