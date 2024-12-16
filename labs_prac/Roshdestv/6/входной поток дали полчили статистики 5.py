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

# Анализ выходного потока
inter_arrival_times_output = np.diff(finish_times)
mean_inter_arrival_time_output = np.mean(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0
variance_inter_arrival_time_output = np.var(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0

# Вероятности выходного потока (PDF)
time_intervals = np.linspace(0, simulation_time, 1000)
if len(inter_arrival_times_output) > 0:
    avg_inter_arrival_time_output = np.mean(inter_arrival_times_output)
    output_probabilities = (1 / avg_inter_arrival_time_output) * np.exp(-(1 / avg_inter_arrival_time_output) * time_intervals)
else:
    output_probabilities = np.zeros_like(time_intervals)

# 1-й график: Входные заявки, Принятые заявки, Буферные заявки, Завершение обслуживания
plt.figure(figsize=(12, 6))

# Объединение графиков 1-4
plt.subplot(1, 1, 1)
plt.scatter(arrival_times, np.ones_like(arrival_times) * 1, color='red', label="Прибывшие заявки", alpha=0.6)
plt.scatter(accepted_times, np.ones_like(accepted_times) * 2, color='green', label="Принятые заявки", alpha=0.6)
buffer_times = [t for t in accepted_times if t not in arrival_times]
plt.scatter(buffer_times, np.ones_like(buffer_times) * 3, color='orange', label="Заявки из буфера", alpha=0.6)
plt.scatter(finish_times, np.ones_like(finish_times) * 4, color='blue', label="Окончание обслуживания", alpha=0.6)

# Настройки графика ададад
plt.xlabel("Время (сек)")
plt.ylabel("Событие")
plt.yticks([1, 2, 3, 4], ['Прибывшие заявки', 'Принятые заявки', 'Заявки из буфера', 'Завершение обслуживания'])
plt.xlim(0, simulation_time)
plt.grid(True)
plt.legend(title='Типы событий')
plt.title("1-4: События системы")

plt.tight_layout()
plt.show()

# 2-й график: Вероятности входного и выходного потока
# plt.figure(figsize=(12, 6))

# Вероятность входного потока
# time_intervals_input = np.linspace(0, simulation_time, 1000)
# input_probabilities = lambda_rate * np.exp(-lambda_rate * time_intervals_input)
# plt.plot(time_intervals_input, input_probabilities, 'b-', label='PDF входного потока')
# plt.xlabel("Время (сек)")
# plt.ylabel("Плотность вероятности")
# plt.legend()
# plt.title("5: PDF входного потока")
# plt.grid(True)

# # Вероятность выходного потока
# plt.plot(time_intervals, output_probabilities, 'm-', label='PDF выходного потока')
# plt.xlabel("Время (сек)")
# plt.ylabel("Плотность вероятности")
# plt.legend()
# plt.title("6: PDF выходного потока")
# plt.grid(True)

# plt.tight_layout()
# plt.show()
