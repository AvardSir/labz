import numpy as np
import librosa
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

# Создание стереосигнала с небольшим смещением фазы для правого канала
phase_shift = np.pi / 4  # Смещение фазы для правого канала
right_channel = 0.5 * (1 + np.sign(np.sin(2 * np.pi * frequency * t + phase_shift)))

# Применение огибающей к правому каналу
final_right_channel = right_channel * volume_envelope

# Добавление прозрачности правому каналу
transparency_factor = 0.5  # Коэффициент прозрачности
final_right_channel *= transparency_factor

# Создание стереосигнала
stereo_signal = np.column_stack((final_signal, final_right_channel))

# Сохранение сигнала в файл
sf.write('meander_signal.wav', stereo_signal, sample_rate)

# Визуализация сигнала
plt.figure(figsize=(12, 6))
plt.plot(t, final_signal, label='Левый канал', color='blue')
plt.plot(t, final_right_channel, label='Правый канал (с прозрачностью)', color='orange')
plt.title('Сигнал типа "меандр" с изменяющейся громкостью')
plt.xlabel('Время (с)')
plt.ylabel('Амплитуда')
plt.xlim(0, duration)
plt.ylim(-0.5, 1.5)
plt.grid()
plt.legend()
plt.show()

print("Сигнал сохранен в файл 'meander_signal.wav'")
