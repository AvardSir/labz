import numpy as np
import matplotlib.pyplot as plt

# Параметры системы
lambda_rate = 4  # интенсивность входного потока (заявки/сек)
service_time = 0.5  # фиксированное время обслуживания (сек)
mu = 1 / service_time  # интенсивность обслуживания
simulation_time = 5  # время симуляции (сек)
num_channels = 1  # количество обслуживающих каналов
buffer_size = 2  # размер буфера

# События в системе
arrival_times = []  # времена прибытия заявок
accepted_times = []  # времена принятых заявок
finish_times = []  # времена завершения обслуживания
rejected_count = 0  # количество отклоненных заявок
buffer = []  # очередь заявок на обслуживание
channels = [0] * num_channels  # время, когда каждый канал освободится

# Генерация пуассоновского входного потока
current_time = 0
while current_time < simulation_time:
    inter_arrival_time = np.random.exponential(1 / lambda_rate)
    current_time += inter_arrival_time
    arrival_times.append(current_time)

# Моделирование обслуживания заявок
for arrival_time in arrival_times:
    # Обновляем статус каналов (освобождаем каналы, если время обслуживания завершилось)
    for i in range(num_channels):
        if channels[i] <= arrival_time:
            if buffer:
                # Если в буфере есть заявки, берем первую и начинаем её обслуживание
                next_request = buffer.pop(0)
                channels[i] = channels[i] + service_time  # Устанавливаем время окончания обслуживания
                accepted_times.append(channels[i] - service_time)
                finish_times.append(channels[i])
            else:
                channels[i] = 0

    # Проверяем, есть ли свободный канал для текущей заявки
    free_channel_idx = None
    for i in range(num_channels):
        if channels[i] <= arrival_time:
            free_channel_idx = i
            break

    if free_channel_idx is not None:
        # Заявка принимается и сразу начинается её обслуживание
        channels[free_channel_idx] = arrival_time + service_time
        accepted_times.append(arrival_time)
        finish_times.append(channels[free_channel_idx])
    elif len(buffer) < buffer_size:
        # Заявка помещается в буфер, если он не заполнен
        buffer.append(arrival_time)
    else:
        # Заявка отклоняется, если буфер заполнен
        rejected_count += 1

# Статистика системы
accepted_count = len(accepted_times)
throughput = accepted_count / simulation_time
rejection_rate = rejected_count / len(arrival_times)

# Вывод статистики
print(f"Количество обработанных заявок: {accepted_count}")
print(f"Количество отклоненных заявок: {rejected_count}")
print(f"Пропускная способность системы: {throughput:.3f} заявки/сек")
print(f"Доля отклоненных заявок: {rejection_rate:.3f}")

# Анализ выходного потока
inter_arrival_times_output = np.diff(finish_times)
mean_inter_arrival_time_output = np.mean(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0
variance_inter_arrival_time_output = np.var(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0

print(f"Среднее межприбытие заявок на выходе: {mean_inter_arrival_time_output:.3f} сек")
print(f"Дисперсия межприбытия заявок на выходе: {variance_inter_arrival_time_output:.3f}")

# Расчет вероятности для пуассоновского распределения (входной поток)
time_intervals = np.linspace(0, simulation_time, 1000)
poisson_probabilities_input = lambda_rate * np.exp(-lambda_rate * time_intervals)

# Расчет вероятности для выходного потока
if len(inter_arrival_times_output) > 0:
    avg_inter_arrival_time_output = np.mean(inter_arrival_times_output)
    poisson_probabilities_output = (1 / avg_inter_arrival_time_output) * np.exp(-(1 / avg_inter_arrival_time_output) * time_intervals)
else:
    poisson_probabilities_output = np.zeros_like(time_intervals)

# Графики
plt.figure(figsize=(12, 6))

# Первый график (входной поток)
plt.subplot(2, 2, 1)
plt.plot(arrival_times, np.ones(len(arrival_times)), 'ro', label='Входной поток (прибытие заявок)', alpha=0.6)
plt.xlabel("Время (сек)")
plt.ylabel("Событие")
plt.legend()
plt.title("Входной поток (прибытие заявок)")
plt.grid(True)

# Второй график (обслуженные заявки)
plt.subplot(2, 2, 2)
plt.plot(finish_times, np.ones(len(finish_times)), 'go', label='Поток обслуженных заявок', alpha=0.6)
plt.xlabel("Время (сек)")
plt.ylabel("Событие")
plt.legend()
plt.title("Поток обслуженных заявок")
plt.grid(True)

# Третий график (вероятность входного потока)
plt.subplot(2, 2, 3)
plt.plot(time_intervals, poisson_probabilities_input, 'b-', label='Вероятность входного потока', alpha=0.6)
plt.xlabel("Время (сек)")
plt.ylabel("Вероятность")
plt.legend()
plt.title("Вероятность входного потока")
plt.grid(True)

# Четвертый график (вероятность выходного потока)
plt.subplot(2, 2, 4)
plt.plot(time_intervals, poisson_probabilities_output, 'm-', label='Вероятность выходного потока', alpha=0.6)
plt.xlabel("Время (сек)")
plt.ylabel("Вероятность")
plt.legend()
plt.title("Вероятность выходного потока")
plt.grid(True)

# Отображение графиков
plt.tight_layout()
plt.show()
