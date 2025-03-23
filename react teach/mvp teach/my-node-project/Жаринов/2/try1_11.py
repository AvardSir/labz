import numpy as np
import matplotlib.pyplot as plt
import librosa
import soundfile as sf

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('white noiz.mp3', sr=None, mono=False)

# Проверяем, является ли сигнал стерео или моно
if input_signal.ndim == 1:
    input_signal = np.expand_dims(input_signal, axis=0)  # Преобразуем в 2D массив

# Уменьшаем значения всех отсчетов
input_signal /= 3.0

# Получить длину данных аудиофайла
N = input_signal.shape[1]
T = N / Fd

t = np.linspace(0, T, N)

# Нормализация сигналов
input_signal = input_signal / np.max(np.abs(input_signal))

# Применяем фильтр (здесь можно вставить ваш код обработки сигнала, если нужно)

# Для примера, просто создадим выходной сигнал как копию входного
output_signal = input_signal.copy()  # Замените это на вашу обработку

# Графики временных сигналов
plt.figure(figsize=(8, 6))
plt.subplot(2, 1, 1)
plt.plot(t, input_signal[0])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Входной аудиосигнал')
start_pont=5
plt.xlim(start_pont, start_pont+0.01)  # Устанавливаем пределы по оси X от 0 до 1 секунды
plt.subplot(2, 1, 2)
plt.plot(t, output_signal[0])
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.title('Выходной аудиосигнал')
plt.xlim(start_pont, start_pont+0.01)  # Устанавливаем пределы по оси X от 0 до 1 секунды
plt.tight_layout()
plt.show()
