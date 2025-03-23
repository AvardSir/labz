import numpy as np
import matplotlib.pyplot as plt
import librosa
from scipy import signal
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - моно
input_signal, Fd = librosa.load('audio_with_noise.wav', sr=None, mono=True)

# Получить длину данных аудиофайла
N = len(input_signal)
T = round(N / Fd)
t = np.linspace(0, T, N)

# Задаем частоту, которую нужно убрать (10 кГц)
notch_frequency = 10000  # 10 кГц

# Задаем ширину полосы заграждения (например, 100 Гц)
bandwidth = 100

# Рассчитываем граничные частоты для полосового заграждающего фильтра
lower_frequency = notch_frequency - bandwidth / 2
upper_frequency = notch_frequency + bandwidth / 2

# Порядок фильтра
order = 4

# Создаем полосовой заграждающий фильтр (режекторный фильтр)
sos = signal.butter(order, Wn=(lower_frequency / (Fd/2), upper_frequency / (Fd/2)), btype='bandstop', output='sos')

# Применяем фильтр к сигналу
output_signal = signal.sosfilt(sos, input_signal)

# Расчет амплитудно-частотной характеристики фильтра
f, H = signal.sosfreqz(sos, worN=Fd, whole=False, fs=Fd)
eps = 1e-10  # чтобы избежать lg(0) при переводе в дБ
L = 20 * np.log10(abs(H) + eps)  # перевод в дБ

# Построим график АЧХ фильтра
plt.figure(figsize=(10, 5))
plt.semilogx(f, L)
plt.title('Digital filter frequency response')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Level [dB]')
plt.xlim(10, Fd/2)  # limit x axis
plt.ylim(-80, 20)  # limit y axis
plt.margins(0, 0.1)
plt.grid(which='both', axis='both')
plt.axvline(lower_frequency, color='green', linestyle='--', label='Lower cutoff')
plt.axvline(upper_frequency, color='red', linestyle='--', label='Upper cutoff')
plt.legend()
plt.show()

# Полезно сравнить спектры до и после фильтрации
Spectr_input = np.fft.fft(input_signal)
AS_input = np.abs(Spectr_input)
eps = np.max(AS_input) * 1.0e-9
S_dB_input = 20 * np.log10(AS_input + eps)

Spectr_output_real = np.fft.fft(output_signal)
S_dB_output_real = 20 * np.log10(np.abs(Spectr_output_real) + eps)

f = np.arange(0, Fd/2, Fd/N)  # Перевести Абсциссу в Гц
S_dB_output_real = S_dB_output_real[:len(f)]
S_dB_input = S_dB_input[:len(f)]

plt.figure(figsize=(10, 6))
plt.semilogx(f, S_dB_input, color='b', label='Input spectrum')
plt.semilogx(f, S_dB_output_real, color='r', label='Output spectrum')
plt.grid(True)
plt.minorticks_on()  # отобразит мелкую сетку на лог.масштабе
plt.grid(True, which='major', color='#444', linewidth=1)
plt.grid(True, which='minor', color='#aaa', ls=':')
Max_A = np.max((np.max(np.abs(Spectr_input)), np.max(np.abs(Spectr_output_real))))
Max_dB = np.ceil(np.log10(Max_A)) * 20
plt.axis([10, Fd/2, Max_dB-120, Max_dB])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Level (dB)')
plt.title('Amplitude Spectrums of input and output audio')
plt.legend()
plt.show()

# Выводим графики исходного аудиосигнала и после фильтрации
start_t, stop_t = 0, T

# Создаем фигуру с двумя подграфиками
plt.figure(figsize=(12, 8))

# Первый подграфик: входной сигнал
plt.subplot(2, 1, 1)
plt.plot(t, input_signal, color='b')
plt.xlim([start_t, stop_t])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Input Audio Signal')
plt.grid(True)

# Второй подграфик: выходной сигнал
plt.subplot(2, 1, 2)
plt.plot(t, output_signal, color='r')
plt.xlim([start_t, stop_t])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Output Audio Signal')
plt.grid(True)

plt.tight_layout()
plt.show()

# Записываем новый аудиофайл
sf.write('output_audio_without_noise.wav', output_signal, Fd)