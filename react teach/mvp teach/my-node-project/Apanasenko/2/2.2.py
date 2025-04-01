import numpy as np
import matplotlib.pyplot as plt
from typing import List, Tuple

def distance(R: float, N: int) -> List[Tuple[float, float]]:
    angles = np.random.uniform(0, 2*np.pi, N)
    radii = np.sqrt(np.random.uniform(0, R**2, N))
    return list(zip(radii, angles))

def ITU_volume_data(f0: float, distance: float, Ptx: float, 
                   deltaF: float, Pn: float, Trb: float) -> float:
    L = 10**((20*np.log10(f0) + K*np.log10(distance) - 28 + np.random.normal(0, 1))/10)
    Prx = Ptx / L
    SNR = Prx / Pn
    C = deltaF * np.log2(SNR + 1)
    return C * Trb

def noise_power(delta_f: float, kn: float) -> float:
    return k * T * delta_f * kn

def geometric_packets(p: float, V: float) -> int:
    return (np.random.geometric(p) - 1) * V

def getP(lambd, Trb):
  return 1 / (lambd * Trb + 1)

def simulate_sequential(
    R: float, N: int, Ptx: float, f0: float, kn: float,
    deltaF: float, slot_cnt: int, Trb: float, V: float,
    lambd_values: np.ndarray
) -> List[float]:
    
    Pn = noise_power(deltaF, kn)
    subscribers = distance(R, N)
    distances = [r for r, _ in subscribers]
    buffer_sums = []
    
    for lambd in lambd_values:
        p = getP(lambd, Trb)
        buffers = np.zeros(N)
        total_buffer = 0
        
        for slot in range(1, slot_cnt):
            # Генерация новых пакетов
            new_packets = np.array([geometric_packets(p, V) for _ in range(N)])
            
            # Обновление буферов (сначала все получают пакеты)
            buffers += new_packets
            
            # Передача данных только для текущего абонента
            current_user = slot % N
            if buffers[current_user] > 0:
                V_i_k = ITU_volume_data(f0, distances[current_user], Ptx, deltaF, Pn, Trb)
                buffers[current_user] = max(buffers[current_user] - V_i_k, 0)
            
            total_buffer += np.sum(buffers)
        
        buffer_sums.append(total_buffer / (slot_cnt - 1))
    
    return buffer_sums

def simulate_optimized(
    R: float, N: int, Ptx: float, f0: float, kn: float,
    deltaF: float, slot_cnt: int, Trb: float, V: float,
    lambd_values: np.ndarray
) -> List[float]:
    Pn = noise_power(deltaF, kn)
    subscribers = distance(R, N)
    distances = [r for r, _ in subscribers]
    buffer_sums = []
    
    for lambd in lambd_values:
        p = getP(lambd, Trb)
        buffers = np.zeros(N)
        total_buffer = 0
        
        for slot in range(1, slot_cnt):
            # Генерация новых пакетов для всех абонентов
            P_i_k = [geometric_packets(p, V) for _ in range(N)]
            
            # Определяем текущего абонента по порядку
            current_user = slot % N
            
            # Если у текущего абонента пустой буфер - ищем следующего
            if buffers[current_user] == 0:
                next_user = (current_user + 1) % N
                while next_user != current_user and buffers[next_user] == 0:
                    next_user = (next_user + 1) % N
                
                # Если нашли абонента с данными - передаем
                if buffers[next_user] > 0:
                    V_i_k = ITU_volume_data(f0, distances[next_user], Ptx, deltaF, Pn, Trb)
                    buffers[next_user] -= V_i_k
            else:
                # Передаем данные текущему абоненту
                V_i_k = ITU_volume_data(f0, distances[current_user], Ptx, deltaF, Pn, Trb)
                buffers[current_user] -= V_i_k
            
            # Обновляем буферы для всех абонентов
            for i in range(N):
                buffers[i] += P_i_k[i]
                buffers[i] = max(buffers[i], 0)  # Гарантируем неотрицательность
            
            total_buffer += np.sum(buffers)
        
        buffer_sums.append(total_buffer / (slot_cnt - 1))
    
    return buffer_sums

# Константы
k = 1.38e-23  # Постоянная Больцмана
T = 273       # Температура (К)





# Параметры модели
#ITU, office area
K=29
R = 30          # Радиус зоны покрытия (м)
Ptx = 0.1       # Мощность передачи (Вт)
f0 = 1200       # Частота (МГц)
kn = 2          # Коэффициент шума
deltaF = 180 * 10**(3)  # Полоса частот (Гц)
Trb = 0.5 * 10**(-3)      # Длительность слота (с)
V = 1024*8      # Объем пакета (бит) = 1 Кбайт
slot_cnt = 1000 # Количество слотов
N = 88    # Количество абонентских станций

# Диапазон интенсивностей входного потока
lambd_values = np.arange(1, 101, 5)

# Количество абонентов для тестирования
subscriber_counts = [8, 16, 64]
plt.figure(figsize=(12, 8))

fig, axes = plt.subplots(1, 3, figsize=(18, 6), sharey=True)  # Создаем 3 подграфика
subscriber_counts = [8, 16, 64]
colors = ['b', 'g', 'r']  # Разные цвета для графиков

for i, (N, color) in enumerate(zip(subscriber_counts, colors)):
    print(f"\nМоделирование для {N} абонентов:")

    # Запуск обоих алгоритмов
    seq_results = simulate_sequential(R, N, Ptx, f0, kn, deltaF, slot_cnt, Trb, V, lambd_values)
    opt_results = simulate_optimized(R, N, Ptx, f0, kn, deltaF, slot_cnt, Trb, V, lambd_values)

    ax = axes[i]  # Текущий подграфик
    ax.plot(lambd_values, seq_results, linestyle='-', color='red', label='Последовательный')
    ax.plot(lambd_values, opt_results, linestyle='-', color='blue', label='Оптимизированный')

    ax.set_xlabel('Интенсивность входного потока (пакетов/сек)')
    if i == 0:
        ax.set_ylabel('Средний объем данных в буфере (бит)')
    ax.set_title(f'N = {N}')
    ax.grid()
    ax.legend()

plt.suptitle('Сравнение алгоритмов передачи данных при разном количестве абонентов', fontsize=14)
plt.tight_layout()
plt.show()


