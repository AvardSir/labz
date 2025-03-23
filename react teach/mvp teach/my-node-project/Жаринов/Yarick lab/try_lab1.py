import numpy as np
import librosa.display
import soundfile as sf
import matplotlib.pyplot as plt

Fd = 44100
T = 3
N = round(T * Fd)

def harm_waves(frequencies, amplitudes):
    model_signal = np.zeros((2, N))
    for f, A in zip(frequencies, amplitudes):
        t = np.arange(N) / Fd
        carrier_signal = A*np.sin(2 * np.pi * 3000 * t)
        modulation_left = A * np.sin(2 * np.pi * f * t)
        modulation_right = A * np.cos(2 * np.pi * f * t)
        signal_left = carrier_signal * modulation_left
        signal_right = carrier_signal * modulation_right
        model_signal[0, :] += signal_left
        model_signal[1, :] += signal_right
    return model_signal

frequencies = [1]
amplitudes = [1]

model_signal = harm_waves(frequencies, amplitudes)

Norm = np.max(np.abs(model_signal))
if Norm != 0:
    model_signal = model_signal / Norm

start_t, stop_t = 0, 3
fig, ax = plt.subplots(nrows=1, sharex=True, figsize=(10, 4))
ax.set(xlim=[start_t, stop_t])
librosa.display.waveshow(model_signal[0, :], sr=Fd, color='b', ax=ax, label='Левый канал (синусоидальная модуляция)')
librosa.display.waveshow(model_signal[1, :], sr=Fd, color='r', ax=ax, label='Правый канал (косинусоидальная модуляция)')
ax.label_outer()
ax.legend()
ax.grid()
plt.xlabel('Время')
plt.ylabel('Амплитуда')
plt.title('Аудиосигнал с амплитудной модуляцией')
plt.show()

sf.write('output.mp3', np.transpose(model_signal), Fd)