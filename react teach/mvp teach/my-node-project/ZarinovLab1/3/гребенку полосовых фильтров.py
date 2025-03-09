import numpy as np
from scipy import signal
from matplotlib import pyplot as plt

def butter_bandpass(lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    sos = signal.butter(order, [low, high], btype='band', output='sos')
    return sos

# Параметры
Fd = 44100
center_freqs = np.array([20 * 2 ** (n * 1 / 3.) for n in range(0, 30)])
lower_freqs = 2. ** (-1 / 6.) * center_freqs
Ak = np.ones_like(center_freqs)  # Ровная частотная характеристика

# Зададим частотную характеристику
Ak = [
    1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.2, 0.1, 0.2, 0.5,
    0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0, 2.0, 2.0,
    2.0, 1.5, 1.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
]

k = 0
plt.figure(figsize=(6, 3))
plt.xlim(10, Fd / 2)
w, H = signal.freqz(0, worN=Fd)

for lf in lower_freqs:
    sos = butter_bandpass(lf, lf * 2 ** (1 / 3.), fs=Fd, order=1)
    w, Hk = signal.sosfreqz(sos, worN=Fd)
    H += Ak[k] * Hk * np.sqrt(0.5)
    k += 1
    plt.semilogx((Fd * 0.5 / np.pi) * w, abs(Hk), label=None)

plt.title('Frequency Response of Bandpass Filters')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Magnitude')
plt.grid(which='both', axis='both')
plt.show()

plt.figure(figsize=(6, 3))
plt.xlim(10, Fd / 2)
plt.semilogx((Fd * 0.5 / np.pi) * w, abs(H), label=None)
plt.title('Combined Frequency Response')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Magnitude')
plt.grid(which='both', axis='both')
plt.show()
