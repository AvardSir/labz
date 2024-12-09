import sys
import numpy as np
import matplotlib.pyplot as plt

def calculate_vals(k_param, lyambd, N):
    lmbd_old, nu_old, lmbd_new, nu_new = sys.float_info.max, sys.float_info.max, 0, 0
    lmbds, nus, Ns = [], [], []

    while (abs((lmbd_new - lmbd_old) / lmbd_old) > 0.001) or (abs((nu_new - nu_old) / nu_old) > 0.001):
        Ns.append(N)
        lmbd_old, nu_old = lmbd_new, nu_new
        u = np.random.gamma(k_param, 1 / lyambd, N)
        m_u = np.mean(u)  # мат. ожидание
        sigma_u = np.std(u, ddof=1)  # стандартное отклонение
        lmbd_new = 1 / m_u  # интенсивность потока
        nu_new = sigma_u / m_u  # коэффициент вариации потока
        lmbds.append(lmbd_new)
        nus.append(nu_new)
        N *= 2

    return lmbds, nus, Ns

def plot_results(mass_N, mass_l, mass_v, k, lmbda):
    lambda_t = lmbda / k 
    nu_t = 1 / np.sqrt(k) 

    plt.figure(figsize=(16, 7))

    # График интенсивности
    ax1 = plt.subplot(1, 2, 1)
    ax1.axhline(lambda_t, color='red', linestyle='--', label='Теоретическое значение')
    ax1.plot(mass_N, mass_l, label='Рассчитанное значение')
    ax1.set_title(f'Интенсивность потока при k = {k} и λ = {lmbda}')
    ax1.set_xlabel('Размер выборки')
    ax1.set_ylabel('Оценка интенсивности')
    ax1.legend()
    ax1.grid()

    # График коэффициента вариации
    ax2 = plt.subplot(1, 2, 2)
    ax2.axhline(nu_t, color='red', linestyle='--', label='Теоретическое значение')
    ax2.plot(mass_N, mass_v, label='Рассчитанное значение')
    ax2.set_title(f'Коэффициент вариации при k = {k} и λ = {lmbda}')
    ax2.set_xlabel('Размер выборки')
    ax2.set_ylabel('Коэффициент вариации')
    ax2.legend()
    ax2.grid()

    plt.tight_layout()
    plt.show()

# Задайте параметры
k = 1  # Пример значения k
l = 1  # Пример значения λ
N_start = 10000

# Выполнение расчетов и построение графиков
mass_l, mass_v, mass_N = calculate_vals(k, l, N_start)
plot_results(mass_N, mass_l, mass_v, k, l)
