import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
mu_rate = 8        # Интенсивность обслуживания (заявки в секунду на канал)
N = 3              # Количество каналов
K = 5              # Размер буфера (для системы с буфером)
time_steps = 1000  # Количество временных шагов

def simulate_system(lambda_rate, mu_rate, N, K, time_steps, buffer=True):
    """Моделирование системы с буфером или без буфера."""
    busy_channels = 0
    buffer_count = 0
    lost_requests = 0
    arrival_times = []
    busy_channels_history = []  # История занятых каналов
    
    for _ in range(time_steps):
        arrival = np.random.poisson(lambda_rate)  # Генерация заявок
        for _ in range(arrival):
            if busy_channels < N:
                busy_channels += 1
                departure_time = np.random.exponential(1 / mu_rate)
                arrival_times.append(departure_time)
            elif buffer and buffer_count < K:
                buffer_count += 1
            else:
                lost_requests += 1
        
        # Освобождение каналов
        busy_channels = max(0, busy_channels - np.random.poisson(mu_rate))
        if buffer_count > 0 and busy_channels < N:
            buffer_count -= 1
            busy_channels += 1
        
        busy_channels_history.append(busy_channels)
    
    return lost_requests, len(arrival_times), busy_channels_history

def plot_service_time_vs_lambda():
    """График времени обслуживания в зависимости от lambda_rate."""
    lambda_values = np.arange(1, 100, 1)  # Различные значения интенсивности входного потока
    avg_service_times_with_buffer = []
    avg_service_times_no_buffer = []
    
    for lambda_rate in lambda_values:
        # Моделирование системы с буфером
        _, handled_with_buffer, _ = simulate_system(lambda_rate, mu_rate, N, K, time_steps, buffer=True)
        avg_service_time_with_buffer = np.mean(np.random.exponential(1 / mu_rate, handled_with_buffer))
        avg_service_times_with_buffer.append(avg_service_time_with_buffer)
        
        # Моделирование системы без буфера
        _, handled_no_buffer, _ = simulate_system(lambda_rate, mu_rate, N, K, time_steps, buffer=False)
        avg_service_time_no_buffer = np.mean(np.random.exponential(1 / mu_rate, handled_no_buffer))
        avg_service_times_no_buffer.append(avg_service_time_no_buffer)
    
    # Построение графика
    plt.figure(figsize=(10, 6))
    plt.plot(lambda_values, avg_service_times_with_buffer, label="С буфером", marker='o')
    plt.plot(lambda_values, avg_service_times_no_buffer, label="Без буфера", marker='o')
    plt.title("Изменение времени обслуживания в зависимости от λ (Интенсивность входного потока)")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Среднее время обслуживания")
    plt.legend()
    plt.grid(True)
    plt.show()

# Вызов функции для построения графика
plot_service_time_vs_lambda()
