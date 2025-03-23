import numpy as np

# Исходные данные
R = 1.0  # расстояние в км (1000 м)
P_tx = 320  # мощность передатчика, Вт
f0 = 1800e6  # частота, Гц (1800 МГц)
delta_f = 5e6  # ширина канала, Гц (5 МГц)
kn = 3  # коэффициент, заданный пользователем

h_BS = 50  # высота базовой станции, м
h_MS = 10  # высота мобильной станции, м

# Константы
k = 1.38e-23  # постоянная Больцмана, Дж/К
T = 290  # температура, К

N = 500  # Количество абонентских станций

def distance(N, R):
    angles = np.random.uniform(0, 2 * np.pi, N)
    r = np.sqrt(np.random.uniform(0, R**2, N))
    return r

def okumura_hata_loss(d):
    a_hMS = (1.1 * np.log10(f0) - 0.7) * h_MS - (1.56 * np.log10(f0) - 0.8)
    L = 46.3 + 33.9 * np.log10(f0) - 13.82 * np.log10(h_BS) - a_hMS + (44.9 - 6.55 * np.log10(h_MS)) * np.log10(d)+3
    return L

def noise_power():
    return k * T * delta_f * kn

def calculate_snr(d):
    L = okumura_hata_loss(d)
    P_rx = P_tx / (10 ** (L / 10))  # Перевод в линейную шкалу
    P_noise = noise_power()
    snr = P_rx / P_noise
    return snr

def calculate_capacity(d):
    snr = calculate_snr(d)
    C = delta_f * np.log2(1 + snr)
    return C

# Генерация дистанций от БС
r = distance(N, R)

# Расчет максимальных скоростей
C_values = calculate_capacity(r)

# Вывод результатов
print("Максимально достижимые скорости для абонентов:")
print(C_values)
