import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
mu_rate = 4        # Интенсивность обслуживания (заявки в секунду на канал)
N = 3              # Количество каналов
K = 200              # Размер буфера (для системы с буфером)

time_steps = 1000  # Количество временных шагов

def simulate_no_buffer(lambda_rate, mu_rate, N, time_steps):
    """Моделирование системы без буфера."""
    busy_channels = 0
    lost_requests = 0
    arrival_times = []
    
    for _ in range(time_steps):
        arrival = np.random.poisson(lambda_rate)  # Генерация заявок
        for _ in range(arrival):
            if busy_channels < N:
                busy_channels += 1
                departure_time = np.random.exponential(1 / mu_rate)
                arrival_times.append(departure_time)
            else:
                lost_requests += 1
        
        # Освобождение каналов
        busy_channels = max(0, busy_channels - np.random.poisson(mu_rate))
    
    return lost_requests, len(arrival_times)

def simulate_with_buffer(lambda_rate, mu_rate, N, K, time_steps):
    """Моделирование системы с буфером."""
    busy_channels = 0
    buffer = 0
    lost_requests = 0
    arrival_times = []
    
    for _ in range(time_steps):
        arrival = np.random.poisson(lambda_rate)  # Генерация заявок
        for _ in range(arrival):
            if busy_channels < N:
                busy_channels += 1
                departure_time = np.random.exponential(1 / mu_rate)
                arrival_times.append(departure_time)
            elif buffer < K:
                buffer += 1
            else:
                lost_requests += 1
        
        # Освобождение каналов
        busy_channels = max(0, busy_channels - np.random.poisson(mu_rate))
        if buffer > 0 and busy_channels < N:
            buffer -= 1
            busy_channels += 1
    
    return lost_requests, len(arrival_times)

def plot_lost_requests_vs_lambda():
    """График зависимости количества потерянных заявок от λ (интенсивности входного потока)."""
    lambda_values = np.arange(1, 10000, 1)  # Разные значения λ
    lost_requests_with_buffer = []
    lost_requests_no_buffer = []
    
    for lambda_rate in lambda_values:
        # Моделирование системы с буфером
        lost_with_buffer, _ = simulate_with_buffer(lambda_rate, mu_rate, N, K, time_steps)
        lost_requests_with_buffer.append(lost_with_buffer)
        
        # Моделирование системы без буфера
        lost_no_buffer, _ = simulate_no_buffer(lambda_rate, mu_rate, N, time_steps)
        lost_requests_no_buffer.append(lost_no_buffer)
    
    # Построение графика
    plt.figure(figsize=(10, 6))
    plt.plot(lambda_values, lost_requests_with_buffer, label="С буфером", marker='o')
    plt.plot(lambda_values, lost_requests_no_buffer, label="Без буфера", marker='o')
    plt.title("Зависимость количества потерянных заявок от λ (Интенсивность входного потока)")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Количество потерянных заявок")
    plt.legend()
    plt.grid(True)
    plt.show()

# Вызов функции для построения графика
plot_lost_requests_vs_lambda()
