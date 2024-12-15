import numpy as np

# Параметры симуляции
lambda_rate = 0.5  # Интенсивность событий
simulation_time = 10  # Время симуляции
arrival_times = []  # Список для хранения времен прибытия

current_time = 0
while current_time < simulation_time:
    inter_arrival_time = np.random.exponential(1 / lambda_rate)
    current_time += inter_arrival_time
    arrival_times.append(current_time)

print(arrival_times)
