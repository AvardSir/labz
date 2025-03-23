import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt

# Считывание MP3 файла
file_path = "white noiz.mp3"
data, samplerate = librosa.load(file_path, sr=None, mono=False)

# Преобразование в моно тк  левый и правый канал одинаковы
data = np.mean(data, axis=0)

# Временная область
time = np.arange(len(data)) / samplerate

# Частотный анализ
frequencies = np.fft.rfftfreq(len(data), d=1 / samplerate)
spectrum = np.abs(np.fft.rfft(data))
spectrum_db = 20 * np.log10(spectrum / np.max(spectrum) + 1e-10)

# STFT спектрограмма 
n_fft = 2048  # значения для БПФ. Чем выше тем лучше качество
hop_length = n_fft // 2  # Больше hop_length — меньше окон, быстрее вычисления
D = librosa.stft(data, n_fft=n_fft, hop_length=hop_length, window='hann')
D_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

# Визуализация
plt.figure(figsize=(14, 12))

# 1. Временная область
plt.subplot(3, 1, 1)
plt.plot(time, data, color='blue', lw=0.8)
plt.title("Временная область (Сигнал)", fontsize=14, pad=15)  # Увеличенный отступ
plt.xlabel("Время (с)", fontsize=12, labelpad=10)  # Отступ подписи
plt.ylabel("Амплитуда", fontsize=12, labelpad=10)  # Отступ подписи
plt.grid(alpha=0.5)

# 2. Спектр амплитуд
plt.subplot(3, 1, 2)
plt.semilogx(frequencies, spectrum_db, color='green', lw=0.8)

plt.title("Спектр амплитуд", fontsize=14, pad=15)  # Увеличенный отступ
plt.xlabel("Частота (Гц)", fontsize=12, labelpad=10)  # Отступ подписи
plt.ylabel("Амплитуда (дБ)", fontsize=12, labelpad=10)  # Отступ подписи
plt.legend()
plt.grid(alpha=0.5)

# 3. Спектрограмма
plt.subplot(3, 1, 3)
img = librosa.display.specshow(D_db, x_axis='time', y_axis='log', sr=samplerate,
                               hop_length=hop_length, cmap='magma', vmin=-80, vmax=0)
# plt.axhline(y=400, color='red', linestyle='--', label="400 Гц")  # Линия на 400 Гц
plt.title("Спектрограмма", fontsize=14, pad=15)  # Увеличенный отступ
plt.xlabel("Время (с)", fontsize=12, labelpad=10)  # Отступ подписи
plt.ylabel("Частота (Гц)", fontsize=12, labelpad=10)  # Отступ подписи
plt.legend()

# Добавление цветовой шкалы
cbar = plt.colorbar(img, format="%+2.0f dB")
cbar.set_label('Амплитуда (дБ)', fontsize=12, labelpad=10)  # Отступ подписи

# Увеличиваем расстояние между графиками
plt.subplots_adjust(hspace=0.5)

# Отображение графиков
plt.show()
