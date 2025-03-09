import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Параметры фильтра
order = 2  # Порядок фильтра
cutoff_frequency = 1500  # Частота среза в Герцах
Fd = 44100  # Частота дискретизации в Герцах

# Создание ФВЧ
sos = signal.butter(order, cutoff_frequency / (Fd / 2), btype='highpass', output='sos')

# Создание примера сигнала: синусоида с частотой 500 Гц и шум
t = np.linspace(0, 1, Fd, endpoint=False)  # Время от 0 до 1 секунды
input_signal = np.sin(2 * np.pi * 500 * t) + 0.5 * np.random.normal(size=t.shape)  # Синусоида + шум

# Применение фильтра
output_signal = signal.sosfilt(sos, input_signal)

# Вычисление спектров
frequencies = np.fft.rfftfreq(len(t), d=1/Fd)  # Частоты для спектра
input_spectrum = np.abs(np.fft.rfft(input_signal))  # Спектр входного сигнала
output_spectrum = np.abs(np.fft.rfft(output_signal))  # Спектр выходного сигнала

# Визуализация
plt.figure(figsize=(12, 10))

# Входной сигнал
plt.subplot(2, 2, 1)
plt.plot(t, input_signal, label='Input Signal (with noise)', color='blue')
plt.title('Input Signal (with Noise)')
plt.xlabel('Time [s]')
plt.ylabel('Amplitude')
plt.grid()
plt.legend()

# Выходной сигнал после фильтрации
plt.subplot(2, 2, 2)
plt.plot(t, output_signal, label='Output Signal (after High-Pass Filtering)', color='red')
plt.title('Output Signal (after High-Pass Filtering)')
plt.xlabel('Time [s]')
plt.ylabel('Amplitude')
plt.grid()
plt.legend()

# Спектр входного сигнала
plt.subplot(2, 2, 3)
plt.semilogy(frequencies, input_spectrum, label='Input Spectrum', color='blue')
plt.title('Input Spectrum')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Magnitude')
plt.grid()
plt.legend()

# Спектр выходного сигнала
plt.subplot(2, 2, 4)
plt.semilogy(frequencies, output_spectrum, label='Output Spectrum', color='red')
plt.title('Output Spectrum (after High-Pass Filtering)')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Magnitude')
plt.grid()
plt.legend()

plt.tight_layout()
plt.show()
