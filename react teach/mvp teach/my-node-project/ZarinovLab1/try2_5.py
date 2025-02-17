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

# Спектрограмма
Pxx, freqs, bins, im = plt.specgram(data, NFFT=4096, Fs=samplerate, noverlap=2048, cmap='plasma')

# Преобразование мощности в амплитуду и далее в дБ
Pxx_amplitude_db = 10 * np.log10(Pxx + 1e-10)  # Перевод мощности в дБ
Pxx_amplitude_db -= np.max(Pxx_amplitude_db)  # Нормализация относительно максимума

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
plt.title("Спектр амплитуд ", fontsize=14)
plt.xlabel("Частота (Гц)", fontsize=12)
plt.ylabel("Амплитуда (дБ)", fontsize=12)
plt.grid(alpha=0.5)

# Спектрограмма
plt.subplot(3, 1, 3)
plt.imshow(
    Pxx_amplitude_db,
    aspect='auto',
    origin='lower',
    extent=[bins[0], bins[-1], freqs[0], freqs[-1]],
    cmap='plasma',
    vmin=-100,  # Отображение до -100 дБ
    vmax=0      # Максимум равен 0 дБ
)
plt.title("Спектрограмма сигнала ", fontsize=14)
plt.xlabel("Время (с)", fontsize=12)
plt.ylabel("Частота (Гц)", fontsize=12)

# Добавление цветовой шкалы
cbar = plt.colorbar()
cbar.set_label('Амплитуда (дБ)', fontsize=12)

# Отображение графиков
plt.tight_layout()
plt.show()
