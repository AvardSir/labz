import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt

# Параметры сигнала
frequency = 400  # Частота сигнала в Гц
duration = 4     # Длительность сигнала в секундах
sample_rate = 44100  # Частота дискретизации в Гц

# Генерация временной оси
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# Генерация сигнала типа "меандр"
meander_signal = np.sign(np.sin(2 * np.pi * frequency * t ))

# Линейное изменение громкости
volume_envelope = np.concatenate((
    np.linspace(0, 1, len(t) // 2),  # Увеличение громкости
    np.linspace(1, 0, len(t) // 2)   # Уменьшение громкости
))

# Применение огибающей к сигналу
left_channel = meander_signal * volume_envelope

# # Создание стереосигнала с небольшим смещением фазы для правого канала
right_channel = np.sign(np.sin(2 * np.pi * frequency * t ))

# Применение огибающей к правому каналу
right_channel = right_channel * volume_envelope

# Создание стереосигнала
stereo_signal = np.column_stack((left_channel, right_channel))

# Сохранение стереосигнала в файл
sf.write('meander_signal.mp3', stereo_signal, sample_rate)

# Визуализация сигнала
plt.figure(figsize=(12, 8))

# delta=0.6
start=0
stop=0.3

# Левый канал
plt.subplot(2, 1, 1)  # 2 строки, 1 столбец, 1-й сабплот
plt.plot(t, left_channel,  color='blue')
plt.title('Левый канал')
plt.xlabel('Время')
plt.ylabel('Амплитуда')
plt.xlim(start, stop)
plt.ylim(-1.5, 1.5)
plt.grid()
plt.legend()

# Правый канал
plt.subplot(2, 1, 2)  # 2 строки, 1 столбец, 2-й сабплот
plt.plot(t, right_channel,  color='orange')
plt.title('Правый канал')
plt.xlabel('Время')
plt.ylabel('Амплитуда')
plt.xlim(start, stop)
plt.ylim(-1.5, 1.5)
plt.grid()
plt.legend()

plt.tight_layout()  # Автоматическая настройка отступов
plt.show()

print("Сигнал сохранен в файл 'meander_signal.wav'")