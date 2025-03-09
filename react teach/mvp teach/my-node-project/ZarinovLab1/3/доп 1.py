import numpy as np
import librosa
import soundfile as sf

# Загрузка исходного аудиофайла
input_audio_path = "white noiz.mp3"  # Укажите путь к вашему аудиофайлу
audio, sr = librosa.load(input_audio_path, sr=None)  # sr=None сохраняет исходную частоту дискретизации

# Генерация синусоиды на 10 кГц, которая будет создавать "звенящую" помеху
duration = len(audio) / sr  # Длительность исходного аудиофайла в секундах
frequency = 10000  # Частота синусоиды 
t = np.linspace(0, duration, len(audio), endpoint=False)  # Временная ось

# Генерация синусоиды на 10 кГц
noise = 0.1 * np.sin(2 * np.pi * frequency * t)  # Уменьшаем амплитуду до 0.1, чтобы не перебить исходный звук

# Добавляем помеху к исходному аудио
output_audio = audio + noise

# Нормализация выходного сигнала, чтобы избежать клиппинга
output_audio = np.clip(output_audio, -1.0, 1.0)

# Сохраняем файл с помехой
output_audio_path = "audio_with_noise.wav"
sf.write(output_audio_path, output_audio, sr)
