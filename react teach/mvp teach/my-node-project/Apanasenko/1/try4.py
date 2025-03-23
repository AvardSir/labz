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

def okumura_hata_loss(d):
    a_hMS = (1.1 * np.log10(f0) - 0.7) * h_MS - (1.56 * np.log10(f0) - 0.8)
    return 46.3 + 33.9 * np.log10(f0) - 13.82 * np.log10(h_BS) - a_hMS + (44.9 - 6.55 * np.log10(h_MS)) * np.log10(d)+3

def noise_power():
    return k * T * delta_f * kn

def calculate_snr(d):
    P_rx = P_tx / (10 ** (okumura_hata_loss(d) / 10))
    return P_rx / noise_power()

def calculate_capacity(d):
    return delta_f * np.log2(1 + calculate_snr(d))

def PRS(C_array, N):
    return [(np.sum(C_array ** (-1))) ** (-1)] * N

def PSS(C_array, N):
    result = np.zeros(N)
    result[np.argmax(C_array)] = np.max(C_array)
    return result

def PRD(C_array, N):
    return C_array / N

def simulate(N):
    distances = np.sqrt(np.random.uniform(0, R**2, N))
    c_array = np.array([calculate_capacity(d) for d in distances])
    return PRS(c_array, N), PSS(c_array, N), PRD(c_array, N)

N = 10  # Количество абонентов
PRS_result, PSS_result, PRD_result = simulate(N)
print("PRS:", PRS_result)
print("PSS:", PSS_result)
print("PRD:", PRD_result)