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
meander_signal = 0.5 * (1 + np.sign(np.sin(2 * np.pi * frequency * t)))

# Линейное изменение громкости
volume_envelope = np.concatenate((
    np.linspace(0, 1, len(t) // 2),  # Увеличение громкости
    np.linspace(1, 0, len(t) // 2)   # Уменьшение громкости
))

# Применение огибающей к сигналу
final_signal = meander_signal * volume_envelope

# # Создание стереосигнала с небольшим смещением фазы для правого канала
right_channel = 0.5 * (1 + np.sign(np.sin(2 * np.pi * frequency * t )))

# Применение огибающей к правому каналу
final_right_channel = right_channel * volume_envelope

# Создание стереосигнала
stereo_signal = np.column_stack((final_signal, final_right_channel))

# Сохранение стереосигнала в файл
sf.write('meander_signal.mp3', stereo_signal, sample_rate)

# Визуализация сигнала
plt.figure(figsize=(12, 8))

# Левый канал
plt.subplot(2, 1, 1)  # 2 строки, 1 столбец, 1-й сабплот
plt.plot(t, final_signal,  color='blue')
plt.title('Левый канал')
plt.xlabel('Время')
plt.ylabel('Амплитуда')
plt.xlim(0.3, 0.31)
plt.ylim(-0.5, 1.5)
plt.grid()
plt.legend()

# Правый канал
plt.subplot(2, 1, 2)  # 2 строки, 1 столбец, 2-й сабплот
plt.plot(t, final_right_channel,  color='orange')
plt.title('Правый канал')
plt.xlabel('Время')
plt.ylabel('Амплитуда')
plt.xlim(0.3, 0.31)
plt.ylim(-0.5, 1.5)
plt.grid()
plt.legend()

plt.tight_layout()  # Автоматическая настройка отступов
plt.show()

print("Сигнал сохранен в файл 'meander_signal.wav'")
print("Левый канал сохранен в файл 'left_channel.wav'")
print("Правый канал сохранен в файл 'right_channel.wav'")
