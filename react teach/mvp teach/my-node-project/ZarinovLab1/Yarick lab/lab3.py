import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt
from scipy.signal import chirp
Fd = 44100 # частота дискретизации
T = 3 # длительность аудио в сек.
N = round(T*Fd)
t = np.linspace(0, T, N)
# за Т секунд частота возрастет с 300 до 3000 Гц:
model_chirp = chirp(t, f0=300, f1=3000, t1=T, method='linear')
# сформируем стереосигнал:
model_signal = np.vstack((model_chirp, model_chirp))
Norm = np.max(np.abs(model_signal))
if Norm != 0:
    model_signal = model_signal / np.max(np.abs(model_signal))
# Строим график сигнала (левый канал стерео)
start_t, stop_t = 0, 0.2
plt.figure(figsize=(10, 4))
plt.xlim([start_t, stop_t])
plt.plot(t, model_signal[0, :], color='b',
 label=r'left channel')
plt.plot(t, model_signal[1, :], color='r',
 label=r'right channel')
plt.xlabel('Time')
plt.ylabel('Amplitude')
plt.title('Audio Signal')
plt.legend()
plt.show()
sf.write('D:/output.mp3', np.transpose(model_signal), Fd)