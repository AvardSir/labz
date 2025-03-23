import numpy as np
import matplotlib.pyplot as plt

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

def distance(N, R, sqrt_method=False):
    angles = np.random.uniform(0, 2 * np.pi, N)
    if sqrt_method:
        r = np.sqrt(np.random.uniform(0, R**2, N))
    else:
        r = np.random.uniform(0, R, N)
    x = r * np.cos(angles)
    y = r * np.sin(angles)
    return x, y, r

# Генерация дистанций от БС
x1, y1, r1 = distance(N, R, sqrt_method=False)
x2, y2, r2 = distance(N, R, sqrt_method=True)

# Гистограмма распределения расстояний (обычное распределение)
plt.figure(figsize=(10, 5))
plt.hist(r1, bins=30, color='gray', edgecolor='black', density=True, alpha=0.7, label='Гистограмма (обычное)')

# Эмпирическая функция распределения
sorted_r1 = np.sort(r1)
empirical_cdf1 = np.arange(1, N + 1) / N
plt.plot(sorted_r1, empirical_cdf1, color='blue', label='Эмпирическая ФР (обычное)')

plt.xlabel('Расстояние от БС (км)')
plt.ylabel('Плотность вероятности / ЭФР')
plt.title('Гистограмма и эмпирическая функция распределения расстояний (обычное)')
plt.legend()
plt.grid(True)
plt.show()

# Гистограмма распределения расстояний (sqrt распределение)
plt.figure(figsize=(10, 5))
plt.hist(r2, bins=30, color='gray', edgecolor='black', density=True, alpha=0.7, label='Гистограмма (sqrt)')

# Эмпирическая функция распределения
sorted_r2 = np.sort(r2)
empirical_cdf2 = np.arange(1, N + 1) / N
plt.plot(sorted_r2, empirical_cdf2, color='blue', label='Эмпирическая ФР (sqrt)')

plt.xlabel('Расстояние от БС (км)')
plt.ylabel('Плотность вероятности / ЭФР')
plt.title('Гистограмма и эмпирическая функция распределения расстояний (sqrt)')
plt.legend()
plt.grid(True)
plt.show()