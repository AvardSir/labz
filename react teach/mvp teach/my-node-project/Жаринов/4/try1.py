import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import soundfile as sf

plt.close('all')

Fd = 44100  # Частота дискретизации
T = 10      # Длительность сигнала в секундах
N = round(Fd * T)  # Общее количество выборок
t = np.linspace(0, T, N)  # Временной вектор

# Генерация белого шума
x1 = np.random.uniform(low=-1.0, high=1.0, size=(2, N))  # БШ1
x2 = np.random.uniform(low=-1.0, high=1.0, size=(2, N))  # БШ2

# Задаем граничные частоты полос двух форм фильтров
f_dn1, f_up1 = 400, 2000  # Низкочастотный звуковой диапазон
f_up2 = 2  # Очень медленные колебания
order1, order2 = 2, 2

# Создание фильтров
sos1 = signal.butter(order1, Wn=(f_dn1 / (Fd / 2), f_up1 / (Fd / 2)), btype='bandpass', output='sos')
sos2 = signal.butter(order2, Wn=(f_up2 / (Fd / 2)), btype='lowpass', output='sos')

# Применение фильтров
y1 = signal.sosfilt(sos1, x1)
y2 = signal.sosfilt(sos2, x2)

# Модуляция одного процесса другим
y = y1 * (1 + y2)  # 1+ нужно, чтобы громкость не спадала до нуля

# Нормировка
Norm = np.max(np.abs(y))
if Norm != 0:
    y = y / Norm

# Построим график спектра созданного процесса
Spectr_y = np.fft.fft(y)
AS_y = np.abs(Spectr_y)
eps = np.max(AS_y) * 1.0e-9
S_dB_y = 20 * np.log10(AS_y + eps)
f = np.arange(0, Fd / 2, Fd / N)
S_dB_y = S_dB_y[:, :len(f)]

# Построение графика амплитудного спектра
plt.figure(figsize=(6, 4))
plt.semilogx(f, S_dB_y[0, :], color='b')
plt.grid(True)
plt.minorticks_on()  # Отобразит мелкую сетку на лог. масштабе
plt.grid(True, which='major', color='#444', linewidth=1)
plt.grid(True, which='minor', color='#aaa', ls=':')

# Автомасштаб на оси ординат
Max_dB = np.ceil(np.log10(np.max(np.abs(Spectr_y)))) * 20
plt.axis([10, Fd / 2, Max_dB - 80, Max_dB])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Level (dB)')
plt.title('Amplitude Spectrum')
plt.show()

# Выводим график созданного процесса
plt.figure(figsize=(6, 3))
plt.subplot(2, 1, 1)
plt.plot(t, y[0, :])
plt.xlim([0, T])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Left Channel')

plt.subplot(2, 1, 2)
plt.plot(t, y[1, :])
plt.xlim([0, T])
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Right Channel')

plt.tight_layout()
plt.show()

# Записываем аудиофайл
sf.write('output.mp3', np.transpose(y), Fd)
