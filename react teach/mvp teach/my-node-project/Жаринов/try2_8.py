import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
import os

# Создание каталога для выходных файлов
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Считывание MP3 файла
file_path = "meander_signal.mp3"
data, samplerate = librosa.load(file_path, sr=None, mono=False)

# Преобразование в моно (если стерео)
if data.ndim > 1:
    data = np.mean(data, axis=0)

# Нормализация сигнала
data = data / np.max(np.abs(data))

# Временная область
time = np.arange(len(data)) / samplerate

# Частотный анализ
frequencies = np.fft.rfftfreq(len(data), d=1 / samplerate)
spectrum = np.abs(np.fft.rfft(data))
spectrum_db = 20 * np.log10(spectrum / np.max(spectrum) + 1e-10)

# STFT спектрограмма
n_fft = 4096
hop_length = n_fft // 4
D = librosa.stft(data, n_fft=n_fft, hop_length=hop_length, window='hann')
D_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)


# Визуализация
plt.figure(figsize=(14, 12))

# 1. Временная область
plt.subplot(3, 1, 1)
plt.plot(time, data, color='blue', lw=0.8)
plt.title("Временная область (Сигнал)", fontsize=14)
plt.xlabel("Время", fontsize=12)
plt.ylabel("Амплитуда", fontsize=12)
plt.grid(alpha=0.5)

# 2. Спектр амплитуд
plt.subplot(3, 1, 2)
plt.semilogx(frequencies, spectrum_db, color='green', lw=0.8)
plt.axvline(x=400, color='red', linestyle='--', label="400 Гц")  # Линия на 400 Гц
# plt.text(420, np.max(spectrum_db) - 5, "400 Гц", color="red", fontsize=12)
plt.title("Спектр амплитуд", fontsize=14)
plt.xlabel("Частота (Гц)", fontsize=12)
plt.ylabel("Амплитуда (дБ)", fontsize=12)
plt.legend()
plt.grid(alpha=0.5)

# 3. Спектрограмма
plt.subplot(3, 1, 3)
img = librosa.display.specshow(D_db, x_axis='time', y_axis='log', sr=samplerate,
                               hop_length=hop_length, cmap='magma', vmin=-80, vmax=0)
plt.axhline(y=400, color='red', linestyle='--', label="400 Гц")  # Линия на 400 Гц
# plt.text(0.1, 420, "400 Гц", color="red", fontsize=12)
plt.title("Спектрограмма", fontsize=14)
plt.xlabel("Время (с)", fontsize=12)
plt.ylabel("Частота (Гц)", fontsize=12)
plt.legend()

# Добавление цветовой шкалы
cbar = plt.colorbar(img, format="%+2.0f dB")
cbar.set_label('Амплитуда (дБ)', fontsize=12)

# Сохранение графика спектрограммы как изображения


# Отображение графиков
plt.show()
