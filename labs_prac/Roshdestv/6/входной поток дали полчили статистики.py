import numpy as np
import matplotlib.pyplot as plt

# Параметры системы
lambda_rate = 1.5  # интенсивность входного потока (заявки/сек)
service_time = 0.5  # фиксированное время обслуживания (сек)
mu = 1 / service_time  # интенсивность обслуживания
simulation_time = 10  # время симуляции (сек)

# События в системе
arrival_times = []  # времена прибытия заявок
accepted_times = []  # времена принятых заявок
finish_times = []  # времена завершения обслуживания
rejected_count = 0  # количество отклоненных заявок

# Генерация пуассоновского входного потока
current_time = 0
while current_time < simulation_time:
    inter_arrival_time = np.random.exponential(1 / lambda_rate)
    current_time += inter_arrival_time
    arrival_times.append(current_time)

# Моделирование обслуживания заявок
last_finish_time = 0
for arrival_time in arrival_times:
    if arrival_time >= last_finish_time:
        # Заявка принимается
        accepted_times.append(arrival_time)
        finish_time = arrival_time + service_time
        finish_times.append(finish_time)
        last_finish_time = finish_time
    else:
        # Заявка отклоняется
        rejected_count += 1

# Статистика системы
accepted_count = len(accepted_times)
throughput = accepted_count / simulation_time
rejection_rate = rejected_count / len(arrival_times)

# Вывод результатов
print(f"Количество обработанных заявок: {accepted_count}")
print(f"Количество отклоненных заявок: {rejected_count}")
print(f"Пропускная способность системы: {throughput:.3f} заявки/сек")
print(f"Доля отклоненных заявок: {rejection_rate:.3f}")

# Анализ выходного потока
inter_arrival_times_output = np.diff(accepted_times)
mean_inter_arrival_time_output = np.mean(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0
variance_inter_arrival_time_output = np.var(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0

print(f"Среднее межприбытие заявок на выходе: {mean_inter_arrival_time_output:.3f} сек")
print(f"Дисперсия межприбытия заявок на выходе: {variance_inter_arrival_time_output:.3f}")

# График входного и принятого потоков
plt.figure(figsize=(10, 6))
plt.scatter(arrival_times, [1] * len(arrival_times), color='red', label="Пропущенные заявки", alpha=0.6)
plt.scatter(accepted_times, [1] * len(accepted_times), color='green', label="Принятые заявки", alpha=0.6)
plt.scatter(finish_times, [1] * len(finish_times), color='blue', label="Окончание обслуживания", alpha=0.6)
plt.xlabel("Время (сек)")
plt.ylabel("Событие")
plt.legend()
plt.title("Моделирование СМО M/D/1 с отказами")
plt.grid()
plt.show()
