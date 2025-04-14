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

# потери по модели Окумура-Хата в дБ
def okumura_hata_loss(d):
    a_hMS = (1.1 * np.log10(f0) - 0.7) * h_MS - (1.56 * np.log10(f0) - 0.8)
    L = 46.3 + 33.9 * np.log10(f0) - 13.82 * np.log10(h_BS) - a_hMS + (44.9 - 6.55 * np.log10(h_MS)) * np.log10(d)
    # print(f"Расстояние: {d} км, Потери: {L} дБ")  # Отладка
    return L

# Мощности шума
def noise_power():
    P_noise = k * T * delta_f * kn
    # print(f"Мощность шума: {P_noise} Вт")  # Отладка
    return P_noise

# SNR
def calculate_snr(d):
    L = okumura_hata_loss(d)
    P_rx = P_tx / (10 ** (L / 10))
    # print(f"Мощность принимаемого сигнала: {P_rx} Вт")  # Отладка
    P_noise = noise_power()
    snr = P_rx / P_noise
    # print(f"SNR: {snr}")  # Отладка
    return snr

# Функция для расчета пропускной способности
def calculate_capacity(d):
    snr = calculate_snr(d)
    capacity = delta_f * np.log2(1 + snr) / 1e6  # Переводим в Мбит/с
    # print(f"Расстояние: {d} км, Пропускная способность: {capacity} Мбит/с")  # Отладка
    return capacity


def PRD(C_array, N):
    return C_array / N

# Алгоритмы распределения ресурсов
def PRS(C_array, N):
    if np.any(C_array == 0):
        return [0] * N
    return [(np.sum(np.nan_to_num(C_array ** (-1)))) ** (-1)] * N

def PSS(C_array, N):
    if np.all(C_array == 0):
        return np.zeros(N)
    result = np.zeros(N)
    max_index = np.argmax(C_array)
    result[max_index] = C_array[max_index]
    return result

def calculate_snr(d):
    L = okumura_hata_loss(d)
    P_rx = P_tx * (10 ** (-L / 10))  # Исправлено
    P_noise = noise_power()
    snr = P_rx / P_noise
    return snr

def simulate(N, num_simulations=200):
    total_sum_D = {'PRS': [], 'PSS': [], 'PRD': []}
    avg_D = {'PRS': [], 'PSS': [], 'PRD': []}
    min_D = {'PRS': [], 'PSS': [], 'PRD': []}

    for _ in range(num_simulations):
        distances = np.sqrt(np.random.uniform(0.1, R**2, N))  # Минимальное расстояние 0.1 км
        c_array = np.array([calculate_capacity(d) for d in distances])

        # print(f"Проверка capacity (должно быть больше 0): {c_array}")  # Отладка

        # ПРС
        D_prs = PRS(c_array, N)
        total_sum_D['PRS'].append(np.sum(D_prs))
        avg_D['PRS'].append(np.mean(D_prs))
        min_D['PRS'].append(np.min(D_prs))

        # ПСС
        D_array_pss = PSS(c_array, N)
        total_sum_D['PSS'].append(np.sum(D_array_pss))
        avg_D['PSS'].append(np.mean(D_array_pss))
        min_D['PSS'].append(np.min(D_array_pss))

        # ПРД
        D_array_prd = PRD(c_array, N)
        total_sum_D['PRD'].append(np.sum(D_array_prd))
        avg_D['PRD'].append(np.mean(D_array_prd))
        min_D['PRD'].append(np.min(D_array_prd))

    # print(f"Перед возвратом: {total_sum_D}")  # Отладка

    # Усреднение результатов по всем симуляциям
    for key in total_sum_D:
        total_sum_D[key] = np.mean(total_sum_D[key])
        avg_D[key] = np.mean(avg_D[key])
        min_D[key] = np.mean(min_D[key])

    return total_sum_D, avg_D, min_D



N_values = [1, 2, 4, 8, 16, 32, 64]
total_sum_D = {'PRS': [], 'PSS': [], 'PRD': []}
avg_D_array = {'PRS': [], 'PSS': [], 'PRD': []}
min_D_array = {'PRS': [], 'PSS': [], 'PRD': []}

for N in N_values:
    total_sum_rate, avg_D, min_D = simulate(N)
    for key in total_sum_rate:
        total_sum_D[key].append(total_sum_rate[key])
        avg_D_array[key].append(avg_D[key])
        min_D_array[key].append(min_D[key])

plt.figure(figsize=(15, 10))

# График суммарной скорости
plt.subplot(3, 1, 1)
for key in total_sum_D:
    plt.plot(N_values, total_sum_D[key], label=key)
plt.xlabel('Число абонентов (N)')
plt.ylabel('Суммарная скорость (Мбит/с)')
plt.title('Суммарная скорость передачи данных')
plt.legend()
plt.grid()
plt.tight_layout(pad=2.0)

# График средней скорости
plt.subplot(3, 1, 2)
for key in avg_D_array:
    plt.plot(N_values, avg_D_array[key], label=key)
plt.xlabel('Число абонентов (N)')
plt.ylabel('Средняя скорость (Мбит/с)')
plt.title('Средняя скорость передачи данных')
plt.legend()
plt.grid()
plt.tight_layout(pad=2.0)

# График минимальной скорости
plt.subplot(3, 1, 3)
for key in min_D_array:
    plt.plot(N_values, min_D_array[key], label=key)
plt.xlabel('Число абонентов (N)')
plt.ylabel('Средняя минимальная скорость (Мбит/с)')
plt.title('Средняя минимальная скорость передачи данных')
plt.legend()
plt.grid()
plt.tight_layout(pad=2.0)

plt.show()

print("\nРезультаты моделирования:\n")
for key in total_sum_D:
    avg_total_sum = np.mean(total_sum_D[key])  # Усредняем список
    print(f"Тип: {key}")
    print(f"  - Суммарная скорость: {avg_total_sum:.2f} Мбит/с")
    print(f"  - Средняя скорость: {[round(x, 2) for x in avg_D_array[key]]}")
    print(f"  - Средняя минимальная скорость: {[round(x, 2) for x in min_D_array[key]]}\n")
