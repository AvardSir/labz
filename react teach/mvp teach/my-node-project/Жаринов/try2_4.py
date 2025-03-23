import numpy as np
import librosa
import matplotlib.pyplot as plt

# Считывание MP3 файла
file_path = "meander_signal.mp3"
data, samplerate = librosa.load(file_path, sr=None)

# Создание массива времени в секундах
time = np.arange(len(data)) / samplerate

# Визуализация сигнала
plt.figure(figsize=(12, 6))

# Сигнал
plt.subplot(3, 1, 1)
plt.plot(time, data)
plt.title("Сигнал")
plt.xlabel("Время (с)")
plt.ylabel("Амплитуда")

# Спектр амплитуд
frequencies = np.fft.rfftfreq(len(data), d=1/samplerate)
spectrum = np.abs(np.fft.rfft(data))

# Преобразование амплитуд в децибелы
spectrum_db = 20 * np.log10(spectrum + 1e-10)  # Добавляем маленькое значение для избежания логарифма нуля

# Отсечение амплитуд ниже -100 дБ
spectrum_db[spectrum_db < -100] = -100

plt.subplot(3, 1, 2)
plt.plot(frequencies, spectrum_db)
plt.title("Спектр амплитуд (логарифмическая шкала, отсеченные < -100 дБ)")
plt.xlabel("Частота (Гц)")
plt.ylabel("Амплитуда (дБ)")

# Спектрограмма
plt.subplot(3, 1, 3)
Pxx, freqs, bins, im = plt.specgram(data, NFFT=1024, Fs=samplerate, noverlap=512, cmap='plasma')

# Преобразование интенсивности в децибелы
# Pxx_db = 10 * np.log10(Pxx + 1e-10)  # Добавляем маленькое значение для избежания логарифма нуля
Pxx_db[Pxx_db < -10] = np.nan  # Отсечение значений ниже -100 дБ

# Отображение спектрограммы с отсечением
plt.subplot(3, 1, 3)
plt.imshow(Pxx_db, aspect='auto', origin='lower', extent=[bins[0], bins[-1], freqs[0], freqs[-1]], cmap='plasma', vmin=-100, vmax=0)
plt.title("Спектрограмма (отсеченные < -100 дБ)")
plt.xlabel("Время (с)")
plt.ylabel("Частота (Гц)")

# Добавление цветовой шкалы
cbar = plt.colorbar()
cbar.set_label('Интенсивность (дБ)')

plt.tight_layout()
plt.show()
