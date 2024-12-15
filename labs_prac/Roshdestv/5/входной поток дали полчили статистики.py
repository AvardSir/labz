import numpy as np
import matplotlib.pyplot as plt

# Параметры системы
lambda_rate = 1.5  # интенсивность входного потока (заявки/сек)
service_time = 0.5  # фиксированное время обслуживания (сек)
mu = 1 / service_time  # интенсивность обслуживания
simulation_time = 1000  # время симуляции (сек)

# Проверка стабильности системы
rho = lambda_rate / mu
if rho >= 1:
    print("Система нестабильна! Коэффициент загрузки rho >= 1.")
    exit()

# События в системе
arrival_times = []  # времена прибытия заявок
start_service_times = []  # времена начала обслуживания
finish_service_times = []  # времена завершения обслуживания

# Генерация пуассоновского входного потока
while current_time < simulation_time:
    inter_arrival_time = np.random.exponential(1 / lambda_rate)
    current_time += inter_arrival_time
    arrival_times.append(current_time)

# Моделирование обслуживания заявок
for i, arrival_time in enumerate(arrival_times):
    if i == 0:
        start_service_time = arrival_time
    else:
        start_service_time = max(arrival_time, finish_service_times[-1])
    
    finish_service_time = start_service_time + service_time

    start_service_times.append(start_service_time)
    finish_service_times.append(finish_service_time)

# Статистика системы
waiting_times = [start - arrival for start, arrival in zip(start_service_times, arrival_times)]
system_times = [finish - arrival for finish, arrival in zip(finish_service_times, arrival_times)]

average_waiting_time = np.mean(waiting_times)
average_system_time = np.mean(system_times)
throughput = len(finish_service_times) / simulation_time

# Вывод результатов
print(f"Среднее время ожидания в очереди: {average_waiting_time:.3f} сек")
print(f"Среднее время пребывания в системе: {average_system_time:.3f} сек")
print(f"Пропускная способность системы: {throughput:.3f} заявки/сек")

# График времен обработки заявок
plt.figure(figsize=(10, 6))
plt.plot(arrival_times, label="Прибытие заявок")
plt.plot(start_service_times, label="Начало обслуживания")
plt.plot(finish_service_times, label="Завершение обслуживания")
plt.xlabel("Индекс заявки")
plt.ylabel("Время (сек)")
plt.legend()
plt.title("Моделирование СМО M/D/1 с фиксированным временем обслуживания")
plt.grid()
plt.show()
