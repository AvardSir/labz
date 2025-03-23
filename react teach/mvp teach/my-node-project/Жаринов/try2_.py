import numpy as np
import librosa
import matplotlib.pyplot as plt

# Считывание MP3 файла
file_path = "meander_signal.mp3"
data, samplerate = librosa.load(file_path, sr=None)

# Визуализация сигнала
plt.figure(figsize=(12, 6))

# Сигнал
plt.subplot(3, 1, 1)
plt.plot(data)
plt.title("Сигнал")
plt.xlabel("Время (сэмплы)")
plt.ylabel("Амплитуда")

# Спектр амплитуд
frequencies = np.fft.rfftfreq(len(data), d=1/samplerate)
spectrum = np.abs(np.fft.rfft(data))

plt.subplot(3, 1, 2)
plt.plot(frequencies, spectrum)
plt.title("Спектр амплитуд")
plt.xlabel("Частота (Гц)")
plt.ylabel("Амплитуда")

# Спектрограмма
plt.subplot(3, 1, 3)
plt.specgram(data, NFFT=1024, Fs=samplerate, noverlap=512, cmap='plasma')
plt.title("Спектрограмма")
plt.xlabel("Время (с)")
plt.ylabel("Частота (Гц)")

plt.tight_layout()
plt.show()
