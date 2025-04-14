import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from numpy._typing import NDArray
from numpy import intp

# Параметры по варианту
R = 1.5                       # Радиус действия БС (км.)
P_tx = 20                   # Мощность излучения БС (Вт)
f_0 = 900                   # Частота излучения БС (МГц)
k_n = 3                     # Коэффициент теплового шума приёмника
N_rb = 25                   # Количество ресурсных блоков
slots = 10**2               # Количество слотов
h_bs = 100                   # Высота БС (м.)
h_rx = 5                    # Высота точки приёма (м.)
S = 0                       # Параметр, зависящий от типа среды (0/3)

# Константы
N = 2                         # Количество АБ
delta_f = 180 * 10**(3)       # Полоса пропуская канала связи БС (Гц)
T = 300                       # Абсолютная температура (К)
k = 1.38 * 10 ** (-23)        # Постоянная Больцмана (Дж/К)
tau = 5 * 10**(-4)            # Длительность одного слота (с.)
y = 1                         # Период расчета средней скорости (с.)
y_slot = int(np.ceil(y/tau))  # Количество слотов для расчета средней скорости
beta = 1/y_slot               # Параметр для сглаживания средней скорости

def create_abons(N: int, R: int, circle: bool = False):
    """Функция размещения абонентов внутри окружности с радиусом R

    Parameters
    ----------
    N : int
        Количество абонентов для генерации
    R : int
        Радиус охвата базовой станции, внутри которого необходимо
        разместить абонентов
    circle : bool, optional
        Для вывода на график окружности и абонентов, by default False

    Returns
    -------
    Если circle задействован:
        X: list
            Массив расположения абонентов по оси Х
        Y: list
            Массив расположения абонентов по оси Y
        X_R: list
            Массив точек окружности по оси X
        Y_R: list
            Массив точек окружности по оси Y
    Если circle не задействован:
        distance: list
            Массив расстояний от АБ до БС
    """
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

x, y, x_r, y_r = create_abons(1024, 1, True)

plt.figure(figsize=(6, 6))
plt.scatter(x, y, label="Абоненты", s=3)
plt.scatter(0, 0, label="БС")
plt.plot(x_r, y_r, label="Граница", color="r")
plt.legend()
plt.show()

def generate_subs(distance: list, slots_amount: int, tau: float) -> pd.DataFrame:
    """Функция генерации возможных скоростей для
    каждого абонента в каждом временном слоте

    Parameters
    ----------
    distance : list
        Массив созданных расстояний АБ
    slots_amount : int
        Количество слотов внутри сигнала передачи
    tau : float
        Время одного слота

    Returns
    -------
    pd.DataFrame
        Датафрейм возможных пропускных способностей каналов каждого пользователя
    """
    # Подсчитываем величину a(h_rx)
    alpha_h_rx = (1.1 * np.log10(f_0) - 0.7) * h_rx - (1.56 * np.log10(f_0) - 0.8)

    # Потери мощности сигнала (lg(L))
    lg_l = (
        46.3
        + 33.9 * np.log10(f_0)
        - 13.82 * np.log10(h_bs)
        - alpha_h_rx
        + (44.9 - 6.55 * np.log10(h_rx)) * np.log10(distance)
        + S
    ) / 10

    # Потери мощности сигнала (L)
    L = 10 ** (lg_l)

    # Случайное затухание сигнала
    L = L + np.random.normal(loc=0, scale=1, size=len(L))

    # Принятая мощность сигнала (P_rx) (Вт)
    P_rx = P_tx / L

    # Мощность теплового шума (P_n) (Вт)
    P_n = delta_f * T * k * k_n

    # Соотношение сигнал/шум (SNR)
    SNR = P_rx / P_n

    # Максимальная пропускная способность канала (кбит/с)
    C = (delta_f * np.log2(1 + SNR)) / 8192

    # Создаём и заполняем датафрейм
    subs = pd.DataFrame(columns=range(slots_amount))
    for sub_i, C_i in enumerate(C):
        subs.loc[f"sub_{sub_i}"] = C_i * tau
    return subs

distances = create_abons(N, R)
subs = generate_subs(distances, N_rb, tau)
print(subs)

def generate_P(lambda_, subs) -> pd.DataFrame:
    """Функция генерации P_i - входного потока заявок
    на каждом слоте каждому абоненту

    Parameters
    ----------
    lambda_ : _type_
        Интенсивность пуассоновского распределения входных заявок
    subs : _type_
        Созданный датафрейм с возможными скоростями АБ

    Returns
    -------
    pd.DataFrame
        Датафрейм, показывающий количество заявок, пришедших пользователям по слотам
    """
    packs = pd.DataFrame(
        columns=subs.columns,
        data=[
            np.random.poisson(lambda_, len(subs.columns))
            for _ in range(len(subs.index))
        ]
    )
    return packs

def priority_EB(subs_R_mean: list) -> NDArray[intp]:
    """Функция, возвращающая список приоритета пользователей
    по алгоритму ``Equal Blind``, выравнивающий скорость загрузки

    Parameters
    ----------
    subs_R_mean : list
        Массив средних скоростей пользователей

    Returns
    -------
    NDArray[intp]
        Рассчитанные приоритеты пользователей
    """
    # Расчет приоритетов и возвращение максимального
    subs_priority = [1 / R_i if R_i > 0 else 1 for R_i in subs_R_mean]

    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_priority)

    return subs_priority_ids

def priority_MT(subs_chanel_capacity: list)-> NDArray[intp]:
    """Функция, возвращающая список приоритета пользователей
    по алгоритму ``Maximum Throughput``, отдающему все АБ с максимальной
    пропускной способностью

    Parameters
    ----------
    subs_chanel_capacity : list
        Массив возможных пропускных способностей АБ

    Returns
    -------
    NDArray[intp]
        Рассчитанные приоритеты пользователей
    """
    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_chanel_capacity)

    return subs_priority_ids

def priority_PF(subs_chanel_capacity: list, subs_R_mean: list)-> NDArray[intp]:
    """Функция, возвращающая список приоритета пользователей
    по алгоритму ``Proportional Fair``, выравнивающего ресурсы между АБ

    Parameters
    ----------
    subs_chanel_capacity : list
        Массив возможных пропускных способностей АБ
    subs_R_mean : list
        Массив средних скоростей пользователей

    Returns
    -------
    NDArray[intp]
        Рассчитанные приоритеты пользователей
    """
    # Расчет приоритетов и возвращение максимального
    subs_priority = [C_i / (R_i if R_i > 0 else 1) for C_i, R_i in zip(subs_chanel_capacity, subs_R_mean)]

    # Получаем список отсортированных индексов АБ по приоритету
    subs_priority_ids = np.argsort(subs_priority)

    return subs_priority_ids

def calc_priority(alg: str, R_mean: list, chanel_capacity: list)-> NDArray[intp]:
    """Функция выбора алгоритма расчета приоритета АБ. Выбор метода осуществляется
    при помощи переменной ``alg``, которая может принимать значения:
    * ``EB`` - расчет приоритета будет производится по методу Equal Blind;
    * ``MT`` - расчет приоритета будет производится по методу Maximal Throughput;
    * ``PF``- расчет приоритета будет производится по методу Proportional Fair.

    Parameters
    ----------
    alg : str
        Тип алгоритма, по которому рассчитывается приоритет АБ
    R_mean : list
        Массив средних скоростей пользователей
    chanel_capacity : list
        Массив возможных пропускных способностей АБ

    Returns
    -------
    NDArray[intp]
        Рассчитанные приоритеты пользователей
    """
    match alg:
        case "EB":
            return priority_EB(R_mean)
        case "MT":
            return priority_MT(chanel_capacity)
        case "PF":
            return priority_PF(chanel_capacity, R_mean)
    raise ValueError(f"Для значения {alg = } не существует алгоритма работы")

def calc_R_mean(slot_id: int, sub_id: int, resources: list, subs: pd.DataFrame) -> float:
    """Функция, рассчитывающая среднюю скорость загрузки данных i-ого АБ
    по первому алгоритму

    Parameters
    ----------
    slot_id : int
        Номер слота, для которого рассчитывается среднее значение
    sub_id : int
        Номер пользователя, для которого рассчитывается среднее значение
    resources : list
        Массив ресурсов, которые были использованы в предыдущих слотах
    subs : pd.DataFrame
        Созданный датафрейм с возможными скоростями АБ

    Returns
    -------
    float
        Рассчитанная средняя скорость загрузки данных
    """
    # Объём данных, который передан абоненту sub_id
    packs_sum = 0
    result = .0

    # Цикл по слотам:
    for slot_i in range(max(0, slot_id - 1 - y_slot), slot_id):

        # Кол-во ресурсных блоков в слоте slot_id, которые принадлежат АБ с индексом sub_id
        resource_blocks = 0

        # Цикл по ресурсным блокам
        for res_sub_i in resources[slot_i]:
            # Проверка принадлежности ресурсного блока в слоте АБ sub_idx
            if res_sub_i == sub_id:
                resource_blocks += 1

        # Находим объём данных, который передан абоненту sub_idx в ресурсных блоках в слоте slot_idx
        packs_sum += subs.iloc[slot_i, sub_id] * resource_blocks
        result = packs_sum / y_slot
    return result

def calc_smooth_R_mean(slot_id: int, sub_id: int, resources: list, subs: pd.DataFrame, R_mean_list: list) -> float:
    """Функция, рассчитывающая среднюю скорость загрузки данных i-ого АБ
    методом сглаживающего фильтра

    Parameters
    ----------
    slot_id : int
        Номер слота, для которого рассчитывается среднее значение
    sub_id : int
        Номер пользователя, для которого рассчитывается среднее значение
    resources : list
        Массив ресурсов, которые были использованы в предыдущих слотах
    subs : pd.DataFrame
        Созданный датафрейм с возможными скоростями АБ
    R_mean_list : list
        Средние скорости АБ, рассчитанные до этого

    Returns
    -------
    float
        Рассчитанная средняя скорость загрузки данных
    """
    # Расчет результата
    result = (1-beta) * R_mean_list[sub_id] + beta * (np.sum([subs.iloc[sub_id, slot_id] for res_id in resources[-1] if res_id == sub_id]) / tau)
    return result


def calc_D_mean(subs: pd.DataFrame, lambda_: float, algorithm: str) -> float:
    """Функция, рассчитывающая среднее суммарное значение объема буфера
    в зависимости от:
    * количества пользователей;
    * интенсивности прихода заявок;
    * типа алгоритма распределения ресурсов.

    Parameters
    ----------
    subs : pd.DataFrame
        Созданный датафрейм с возможными скоростями АБ
    lambda_ : float
        Интенсивность пуассоновского распределения входных заявок
    algorithm : str
        Тип алгоритма, по которому происходит приоритизация АБ в системе

    Returns
    -------
    float
        Рассчитанное среднее суммарное значение объема буфера
    """
    # Генерация входящего потока пакетов
    P = generate_P(lambda_, subs)

    # Отправляем в буфер первый слот
    buffer = [P[0].to_list()]

    # Массив ресурсных блоков слотов
    resources = [[]]

    # Список средних скоростей (в начале 0.0 у всех)
    R_mean_list = [[calc_R_mean(0, sub_id, resources, subs) for sub_id in range(len(subs.index))]]

    # Цикл по слотам
    for slot_id in range(1, len(P.columns)):
        # Рассчитываем среднюю скорость только для EB и PF
        if algorithm in ["EB", "PF"]:
            # R_mean_list.append(
            # [calc_R_mean(slot_id, sub_id, resources, subs) for sub_id in range(len(subs.index))]
            # )
            R_mean_list.append(
                [calc_smooth_R_mean(slot_id, sub_id, resources, subs, R_mean_list[-1]) for sub_id in
                 range(len(subs.index))]
            )

        # Ищем пользователей с заполненным буфером
        subs_with_buffer = [i for i in range(len(subs.index)) if buffer[-1][i] != 0]

        # Расчет нового буфера для текущего слота
        buffer.append(buffer[-1].copy())

        # Если есть АБ с заполненным буфером
        if subs_with_buffer:
            # Выбираем параметры АБ из списка
            R_buffered_subs = []
            C_buffered_subs = []
            for i in subs_with_buffer:
                R_buffered_subs.append(R_mean_list[-1][i])
                C_buffered_subs.append(subs.iloc[i, slot_id])

            # Создаём список приоритета АБ
            priority_list = calc_priority(algorithm, R_buffered_subs, C_buffered_subs)
            subs_priority = [sub for _, sub in sorted(zip(priority_list, subs_with_buffer))]

            # Сколько ресурсов нужно каждому АБ
            slots_res_block = [int(np.ceil(buffer[-1][sub_id] / subs.iloc[sub_id, slot_id])) for sub_id in
                               subs_priority]
            if np.sum(slots_res_block) > N_rb:
                cut_off = np.sum(slots_res_block) - N_rb
                slots_res_block[-1] -= cut_off
                while slots_res_block[-1] <= 0:
                    cut_off = slots_res_block.pop()
                    slots_res_block[-1] += cut_off

            resources.append([id for id, count in zip(subs_priority, slots_res_block) for _ in range(count)])
            # Удаляем АБ, без ресурсов в слоте
            if len(slots_res_block) != len(subs_priority):
                difference = len(slots_res_block) - len(subs_priority)
                subs_priority = subs_priority[:difference]

            # Обработка АБ с выделенными ресурсами (уменьшаем буфер АБ)
            for id, sub_id in enumerate(subs_priority):
                buffer[-1][sub_id] = max(0, buffer[-1][sub_id] - subs.iloc[sub_id, slot_id] * slots_res_block[id])
        # Если нет АБ с заполненным буфером
        else:
            resources.append([])

        # Добавляем новые пакеты
        buffer[-1] = [buff + pack for buff, pack in zip(buffer[-1], P[slot_id])]

    # Расчет среднего суммарного объема буфера по слотам
    return np.mean([sum(slot_buff) for slot_buff in buffer])


def plot_dependencies(l_start: int, l_stop: int, subs_count: int) -> None:
    """Функция создания графика зависимости среднего суммарного объема данных
    от интенсивности распределения входного потока заявок.

    Parameters
    ----------
    l_start : int >= 0
        Минимальное значение интенсивности входного потока заявок
    l_stop : int >= l_start
        Максимальное значение интенсивности входного потока заявок
    subs_count : int
        Количество абонентов в зоне действия базовой станции
    """
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
for i, N in enumerate([2, 4, 8, 16]):
    plt.subplot(2, 2, i+1)
    plot_dependencies(0, 10, N)
    plt.title(f'Параметры: {N} абонентов, {slots} слотов')
    plt.legend()
    plt.grid()
    if i+1 in [1, 3]:
        plt.ylabel(r'Средний объем буфера $D_i[k]$ (Кбайт)')
    if i+1 in [3, 4]:
        plt.xlabel(r'Интенсивность входного потока $\lambda$ (пакетов/сек)')



