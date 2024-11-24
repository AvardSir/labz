import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
lambda_rate = 5    # Интенсивность входного потока (заявки в секунду)
mu_rate = 8        # Интенсивность обслуживания (заявки в секунду на канал)
N = 3              # Количество каналов
K = 5              # Размер буфера (для системы с буфером)
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
                departure_time = np.random.exponential(1 / mu_rate)#  система может обслуживать 8 заявок в секунду (то есть μ = 8), то среднее время обслуживания одной заявки будет 1 / 8 = 0.125 секунды.
                # тоесть сколько труется на 1=departure_time
                arrival_times.append(departure_time)
            else:
                lost_requests += 1
        
        # Освобождение каналов
        busy_channels = max(0, busy_channels - np.random.poisson(mu_rate))#за шаг обрабатываем примерно mu_rate заявко и чтоб занятых каналов >0
    
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

# Моделирование
lost_no_buffer, handled_no_buffer = simulate_no_buffer(lambda_rate, mu_rate, N, time_steps)
lost_with_buffer, handled_with_buffer = simulate_with_buffer(lambda_rate, mu_rate, N, K, time_steps)

# Графики
time = np.arange(time_steps)
arrivals = np.random.poisson(lambda_rate, time_steps)

plt.figure(figsize=(12, 6))

# График входного потока и времени обслуживания
plt.subplot(1, 2, 1)
plt.plot(time, arrivals, label="Входной поток (λ)")
plt.axhline(mu_rate, color='r', linestyle='--', label="Обслуживание (μ)")
plt.title("Входной поток и время обслуживания")
plt.xlabel("Время")
plt.ylabel("Частота")
plt.legend()

# График входного потока и N
plt.subplot(1, 2, 2)
plt.plot(time, arrivals, label="Входной поток (λ)")
plt.axhline(N, color='g', linestyle='--', label="Каналы (N)")
plt.title("Входной поток и N")
plt.xlabel("Время")
plt.ylabel("Частота")
plt.legend()

plt.tight_layout()
plt.show()

print(f"Потери в системе без буфера: {lost_no_buffer}, Обработано: {handled_no_buffer}")
print(f"Потери в системе с буфером: {lost_with_buffer}, Обработано: {handled_with_buffer}")
