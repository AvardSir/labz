import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from numpy._typing import NDArray
from numpy import intp

# Параметры по варианту
R = 2                       # Радиус действия БС (км.)
P_tx = 320                   # Мощность излучения БС (Вт)
f_0 = 1800                   # Частота излучения БС (МГц)
k_n = 3                     # Коэффициент теплового шума приёмника
N_rb = 75                   # Количество ресурсных блоков

slots = 100               # Количество слотов
h_bs = 50                   # Высота БС (м.)
h_rx = 10                    # Высота точки приёма (м.)
S = 3                       # Параметр, зависящий от типа среды (0/3)

# Константы
N = 2                         # Количество АБ
delta_f = 180 * 10**(3)       # Полоса пропуская канала связи БС (Гц)
T = 300                       # Абсолютная температура (К)
k = 1.38 * 10 ** (-23)        # Постоянная Больцмана (Дж/К)
tau = 5 * 10**(-4)            # Длительность одного слота (с.)
y = 1                         # Период расчета средней скорости (с.)
y_slot = int(np.ceil(y/tau))  # Количество слотов для расчета средней скорости
beta = 1/y_slot               # Параметр для сглаживания средней скорости

def okumura_hata_loss(d):
    a_hMS = (1.1 * np.log10(f_0) - 0.7) * h_rx - (1.56 * np.log10(f_0) - 0.8)
    L = 46.3 + 33.9 * np.log10(f_0) - 13.82 * np.log10(h_bs) - a_hMS + (44.9 - 6.55 * np.log10(h_rx)) * np.log10(d) + S
    return L

def noise_power():
    P_noise = k * T * delta_f * k_n
    return P_noise

def calculate_snr(d):
    L = okumura_hata_loss(d)
    P_rx = P_tx / (10 ** (L / 10))
    P_noise = noise_power()
    snr = P_rx / P_noise
    return snr

def calculate_capacity(d):
    snr = calculate_snr(d)
    return delta_f * np.log2(1 + snr) / 8 / 1024  # Сразу в Кбайт/с

def create_abons(N: int, R: int, circle: bool = False):
    
    # Лямбда-функция создания расстояния от АБ до БС (по прямой)
    create_distance = lambda N: np.sqrt(np.random.uniform(0, R**2, N))
    distance = create_distance(N)
    if circle:
        create_angle = lambda N: np.random.uniform(0, 2 * np.pi, N)
        angle = create_angle(N)
        theta = np.linspace(0, 2 * np.pi, 100)
        # Для абонентов
        x, y = distance * np.cos(angle), distance * np.sin(angle)

        # Для окружности
        x_r, y_r = R * np.cos(theta), R * np.sin(theta)
        return x, y, x_r, y_r
    return distance

def generate_subs(distance: list, slots_amount: int, tau: float) -> pd.DataFrame:
    C = [calculate_capacity(d) * tau for d in distance]  # Уже в Кбайт/с * tau
    return pd.DataFrame([C]*slots_amount).T  # Транспонированная матрица


def generate_P(lambda_, subs) -> pd.DataFrame:
    
    packs = pd.DataFrame(
        columns=subs.columns,
        data=[
            np.random.poisson(lambda_, len(subs.columns))
            for _ in range(len(subs.index))
        ]
    )
    return packs

def priority_EB(subs_R_mean: list) -> NDArray[intp]:
    
    # Расчет приоритетов и возвращение максимального
    subs_priority = [1 / R_i if R_i > 0 else 1 for R_i in subs_R_mean]

    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_priority)

    return subs_priority_ids

def priority_MT(subs_chanel_capacity: list)-> NDArray[intp]:
   
    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_chanel_capacity)

    return subs_priority_ids

def priority_PF(subs_chanel_capacity: list, subs_R_mean: list)-> NDArray[intp]:
    
    # Расчет приоритетов и возвращение максимального
    subs_priority = [C_i / (R_i if R_i > 0 else 1) for C_i, R_i in zip(subs_chanel_capacity, subs_R_mean)]

    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_priority)

    return subs_priority_ids

def calc_priority(alg: str, R_mean: list, chanel_capacity: list)-> NDArray[intp]:
   
    match alg:
        case "EB":
            return priority_EB(R_mean)
        case "MT":
            return priority_MT(chanel_capacity)
        case "PF":
            return priority_PF(chanel_capacity, R_mean)
    raise ValueError(f"Для значения {alg = } не существует алгоритма работы")

def calc_R_mean(slot_id: int, 
                sub_id: int, 
                resources: list, 
                subs: pd.DataFrame) -> float:
    """
    Расчет средней скорости передачи данных для абонента за период y_slot
    
    Параметры:
        slot_id: текущий слот (индекс временного слота)
        sub_id: ID абонента
        resources: список распределений ресурсных блоков по слотам
        subs: DataFrame с пропускными способностями
        
    Возвращает:
        Среднюю скорость передачи (в Кбайт/с) за период y_slot
    """
    total_data = 0.0  # Суммарный объем переданных данных
    
    # Определяем диапазон слотов для анализа (последние y_slot слотов)
    start_slot = max(0, slot_id - y_slot)
    
    for slot_i in range(start_slot, slot_id):
        # Подсчет RB, выделенных абоненту в этом слоте
        rb_count = sum(1 for res_id in resources[slot_i] if res_id == sub_id)
        
        # Объем данных = пропускная способность * количество RB
        slot_data = subs.iloc[sub_id, slot_i] * rb_count
        total_data += slot_data
    
    # Средняя скорость = общий объем / временное окно
    return total_data / min(y_slot, slot_id - start_slot)  # Защита от деления на 0

def calc_smooth_R_mean(slot_id: int, sub_id: int, resources: list, subs: pd.DataFrame, R_mean_list: list) -> float:
   
    try:
        # Получаем текущее значение средней скорости
        current_mean = float(R_mean_list[-1][sub_id])
        
        # Считаем переданные данные в текущем слоте
        transmitted_data = sum(
            float(subs.iloc[sub_id, slot_id]) 
            for res_id in resources[-1] 
            if res_id == sub_id
        ) / float(tau)
        
        # Применяем формулу экспоненциального сглаживания
        return (1.0 - beta) * current_mean + beta * transmitted_data
    except (IndexError, TypeError) as e:
        print(f"Ошибка в calc_smooth_R_mean: {e}")
        return 0.0


def calc_D_mean(subs: pd.DataFrame, lambda_: float, algorithm: str, use_smooth: bool = True) -> float:
    
    # Генерация входящего трафика
    P = generate_P(lambda_, subs)
    
    # Инициализация структур данных
    buffer = [P[0].to_list()]  # Начальное состояние буфера
    resources = [[]]           # Распределение ресурсов по слотам
    R_mean_list = [[0.0]*len(subs.index)]  # Начальные средние скорости
    
    for slot_id in range(1, len(P.columns)):
        # Обновление средних скоростей для EB и PF
        if algorithm in ["EB", "PF"]:
            if use_smooth:
                # Сглаженный расчет
                R_mean_list.append([
                    calc_smooth_R_mean(
                        slot_id=slot_id,
                        sub_id=sub_id,
                        resources=resources,
                        subs=subs,
                        R_mean_list=R_mean_list
                    )
                    for sub_id in range(len(subs.index))
                ])
            else:
                # Точный расчет по истории
                R_mean_list.append([
                    calc_R_mean(
                        slot_id=slot_id,
                        sub_id=sub_id,
                        resources=resources,
                        subs=subs
                    )
                    for sub_id in range(len(subs.index))
                ])
        else:
            # Для MT средние скорости не обновляются
            R_mean_list.append(R_mean_list[-1].copy())
        
        # Обработка буфера
        buffer.append(buffer[-1].copy())
        subs_with_buffer = [i for i in range(len(subs.index)) if buffer[-1][i] > 0]
        
        if subs_with_buffer:
            # Подготовка данных для планировщика
            R_buffered = [R_mean_list[-1][i] for i in subs_with_buffer]
            C_buffered = [subs.iloc[i, slot_id] for i in subs_with_buffer]
            
            # Определение приоритетов
            priority_list = calc_priority(algorithm, R_buffered, C_buffered)
            subs_priority = [sub for _, sub in sorted(zip(priority_list, subs_with_buffer))]
            
            # Распределение ресурсных блоков
            slots_needed = [
                int(np.ceil(buffer[-1][sub_id] / max(1e-6, subs.iloc[sub_id, slot_id])))
                for sub_id in subs_priority
            ]
            
            # Корректировка при нехватке ресурсов
            total_needed = sum(slots_needed)
            if total_needed > N_rb:
                excess = total_needed - N_rb
                slots_needed[-1] -= excess
                while slots_needed[-1] <= 0 and len(slots_needed) > 1:
                    excess = slots_needed.pop()
                    slots_needed[-1] += excess
            
            # Формирование распределения ресурсов
            resource_allocation = [
                sub_id 
                for sub_id, count in zip(subs_priority, slots_needed) 
                for _ in range(count)
            ]
            resources.append(resource_allocation)
            
            # Обновление буфера
            for i, sub_id in enumerate(subs_priority):
                if i < len(slots_needed):
                    transmitted = subs.iloc[sub_id, slot_id] * slots_needed[i]
                    buffer[-1][sub_id] = max(0, buffer[-1][sub_id] - transmitted)
        else:
            resources.append([])
        
        # Добавление новых пакетов
        buffer[-1] = [buff + new for buff, new in zip(buffer[-1], P[slot_id])]
    
    return np.mean([sum(slot) for slot in buffer])


def plot_dependencies(l_start: int, l_stop: int, subs_count: int) -> None:
    
    # Генерация: параметра лямбда, расположений и возможных скоростей
    lambdas = np.linspace(l_start, l_stop, 11)
    distances = create_abons(subs_count, R)
    subs = generate_subs(distances, slots, tau)

    # Цикл по алгоритмам
    for alg in ["EB", "MT", "PF"]:
        D_score = []
        for l in lambdas:
            D_score.append(calc_D_mean(subs, l, alg))
            # print(f'{alg = }, {l = :.2f}, {D_score[-1] = :.3f}')

        # Добавляем линию на график
        plt.plot(lambdas, D_score, marker='.', label=f'{alg}, {subs_count}')

plt.figure(figsize=(10, 10))
for i, N in enumerate([ 4, 8, 16,64]):
    plt.subplot(2, 2, i+1)
    plot_dependencies(0, 10, N)
    plt.title(f'Параметры: {N} абонентов, {slots} слотов')
    plt.legend()
    plt.grid()
    if i+1 in [1, 3]:
        plt.ylabel(r'Средний объем буфера $D_i[k]$ (Кбайт)')
    if i+1 in [3, 4]:
        plt.xlabel(r'Интенсивность входного потока $\lambda$ (пакетов/сек)')

plt.show()