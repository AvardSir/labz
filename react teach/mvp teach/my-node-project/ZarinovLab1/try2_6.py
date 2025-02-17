import numpy as np
import librosa
import matplotlib.pyplot as plt

# Считывание MP3 файла
file_path = "meander_signal.mp3"
data, samplerate = librosa.load(file_path, sr=None)

# Нормализация сигнала (максимальная амплитуда = 1, соответствует 0 дБ)
data = data / np.max(np.abs(data))

# Создание массива времени в секундах
time = np.arange(len(data)) / samplerate

# Частотная область: Спектр амплитуд (логарифмическая шкала)
frequencies = np.fft.rfftfreq(len(data), d=1 / samplerate)
spectrum = np.abs(np.fft.rfft(data))
spectrum_db = 20 * np.log10(spectrum / np.max(spectrum) + 1e-10)  # Нормализация + перевод в дБ

# Спектрограмма: С использованием STFT (Short Time Fourier Transform)
D = librosa.stft(data)
D_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

# Визуализация
plt.figure(figsize=(14, 12))

# Временная область: Сигнал
plt.subplot(3, 1, 1)
plt.plot(time, data, color='blue', lw=0.8)
plt.title("Сигнал", fontsize=14)
plt.xlabel("Время (с)", fontsize=12)
plt.ylabel("Амплитуда", fontsize=12)
plt.grid(alpha=0.5)

# Частотная область: Спектр амплитуд (логарифмическая шкала)
plt.subplot(3, 1, 2)
plt.plot(frequencies, spectrum_db, color='green', lw=0.8)
plt.title("Спектр амплитуд (логарифмическая шкала)", fontsize=14)
plt.xlabel("Частота (Гц)", fontsize=12)
plt.ylabel("Амплитуда (дБ)", fontsize=12)
plt.grid(alpha=0.5)

# Спектрограмма (отображение с использованием STFT)
plt.subplot(3, 1, 3)
librosa.display.specshow(D_db, x_axis='time', y_axis='log', sr=samplerate, cmap='plasma')
plt.title("Спектрограмма сигнала", fontsize=14)
plt.xlabel("Время (с)", fontsize=12)
plt.ylabel("Частота (Гц)", fontsize=12)

# Добавление цветовой шкалы
cbar = plt.colorbar()
cbar.set_label('Амплитуда (дБ)', fontsize=12)

# Отображение графиков
plt.tight_layout()
plt.show()
