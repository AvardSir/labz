import numpy as np
import matplotlib.pyplot as plt
import librosa
from scipy import signal
import soundfile as sf

plt.close('all')  # Очистка памяти

# Загрузка данных звукового файла - стерео
input_signal, Fd = librosa.load('white noiz.mp3', sr=None, mono=False)

# Получить длину данных аудиофайла
N = len(np.transpose(input_signal))
T = round(N / Fd)
t = np.linspace(0, T, N)

# ------------------------------------------------------------
# Задаем граничные частоты полосы пропускания фильтра, в Герцах
lower_frequency = 1500
upper_frequency = 2000

import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Параметры фильтра
order = 1

# Задаем граничные частоты полосы пропускания фильтра, в Герцах
lower_frequency1, upper_frequency1 = 100, 250
lower_frequency2, upper_frequency2 = 1000, 2000

# Создание полосовых фильтров
sos1 = signal.butter(order,
                      Wn=(lower_frequency1 / (Fd / 2),
                          upper_frequency1 / (Fd / 2)),
                      btype='bandpass', output='sos')

sos2 = signal.butter(order,
                      Wn=(lower_frequency2 / (Fd / 2),
                          upper_frequency2 / (Fd / 2)),
                      btype='bandpass', output='sos')

# Фильтрация сигналов
output_signal1 = signal.sosfilt(sos1, input_signal)
output_signal2 = signal.sosfilt(sos2, input_signal)

# Объединение сигналов с нужными коэффициентами
K1 = 2  # Увеличение усиления в первом диапазоне вдвое
K2 = 4  # Увеличение усиления во втором диапазоне вчетверо
output_signal = input_signal + \
                (K1 - 1) * output_signal1 + \
                (K2 - 1) * output_signal2

# ----------------------------------------------------------
# Расчет частотной характеристики по коэффициентам фильтра
f, H1 = signal.sosfreqz(sos1, worN=Fd, whole=False, fs=Fd)
f, H2 = signal.sosfreqz(sos2, worN=Fd, whole=False, fs=Fd)

# Комплексная частотная характеристика всего фильтра
H = 1 + (K1 - 1) * H1 + (K2 - 1) * H2

# Здесь 1 + потому что входной сигнал проходит на выход без изменений
eps = 1e-10  # Чтобы избежать lg(0)
L = 20 * np.log10(abs(H) + eps)  # Перевод в дБ

# Построим график АЧХ фильтра
plt.semilogx(f, L)
plt.title('Digital filter frequency response')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Level [dB]')
plt.xlim(10, Fd / 2)  # Ограничение по оси x
plt.ylim(-20, 20)  # Уменьшаем нижний лимит по очевидной причине
plt.margins(0, 0.1)
plt.grid(which='both', axis='both')
plt.show()
