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

# Применение логарифмической шкалы
spectrum_log = np.log10(spectrum + 1e-10)  # Добавляем маленькое значение для избежания логарифма нуля

plt.subplot(3, 1, 2)
plt.plot(frequencies, spectrum_log)
plt.title("Спектр амплитуд (логарифмическая шкала)")
plt.xlabel("Частота (Гц)")
plt.ylabel("Логарифмическая амплитуда")

# Спектрограмма
plt.subplot(3, 1, 3)
Pxx, freqs, bins, im = plt.specgram(data, NFFT=1024, Fs=samplerate, noverlap=512, cmap='plasma')
plt.title("Спектрограмма")
plt.xlabel("Время (с)")
plt.ylabel("Частота (Гц)")

# Добавление цветовой шкалы
cbar = plt.colorbar(im)
cbar.set_label('Интенсивность (дБ)')

plt.tight_layout()
plt.show()
