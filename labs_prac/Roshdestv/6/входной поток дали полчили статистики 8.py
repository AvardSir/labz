import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import kstest, uniform, erlang

# Параметры системы
lambda_rate = 4  # интенсивность входного потока (заявки/сек)
service_time = 0.5  # фиксированное время обслуживания (сек)
mu = 1 / service_time  # интенсивность обслуживания
simulation_time = 100  # время симуляции (сек)
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
                next_request = buffer.pop(0)
                channels[i] = channels[i] + service_time
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
        channels[free_channel_idx] = arrival_time + service_time
        accepted_times.append(arrival_time)
        finish_times.append(channels[free_channel_idx])
    elif len(buffer) < buffer_size:
        buffer.append(arrival_time)
    else:
        rejected_count += 1

# Статистика системы
inter_arrival_times_output = np.diff(finish_times)
mean_inter_arrival_time_output = np.mean(inter_arrival_times_output)
variance_inter_arrival_time_output = np.var(inter_arrival_times_output)

# Коэффициент вариации
cv_output = (np.sqrt(variance_inter_arrival_time_output) / mean_inter_arrival_time_output
             if mean_inter_arrival_time_output > 0 else 0)

# Проверка на равномерность выходного потока (пальмовское распределение)
scaled_inter_arrivals = (inter_arrival_times_output - np.min(inter_arrival_times_output)) / (
        np.max(inter_arrival_times_output) - np.min(inter_arrival_times_output))
ks_stat_uniform, p_value_uniform = kstest(scaled_inter_arrivals, 'uniform')

# Проверка на эрланговское распределение
k = int(round(1 / (cv_output**2))) if cv_output > 0 else 1
lambda_rate_output = k / mean_inter_arrival_time_output if mean_inter_arrival_time_output > 0 else 1
ks_stat_erlang, p_value_erlang = kstest(inter_arrival_times_output, 'erlang', args=(k, 0, 1 / lambda_rate_output))

# Визуализация для равномерного распределения
plt.figure(figsize=(8, 6))
plt.hist(scaled_inter_arrivals, bins=20, density=True, alpha=0.7, color='g', label='Выходной поток (нормированный)')

x = np.linspace(0, 1, 100)
plt.plot(x, uniform.pdf(x), 'r-', label='Равномерное распределение')
plt.xlabel("Нормированные межприбытия")
plt.ylabel("Плотность вероятности")
plt.legend()
plt.title("Гистограмма межприбытия (выход) и теоретическая плотность (равномерное распределение)")
plt.grid(True)
plt.show()

# Визуализация для эрланговского распределения
plt.figure(figsize=(8, 6))
plt.hist(inter_arrival_times_output, bins=20, density=True, alpha=0.7, color='b', label='Выходной поток')

x = np.linspace(0, max(inter_arrival_times_output), 100)
pdf_erlang = erlang.pdf(x, k, scale=1 / lambda_rate_output)
plt.plot(x, pdf_erlang, 'r-', label=f'Эраланг(k={k}, λ={lambda_rate_output:.2f})')
plt.xlabel("Межприбытие")
plt.ylabel("Плотность вероятности")
plt.legend()
plt.title("Гистограмма межприбытия (выход) и теоретическая плотность (эрланговское распределение)")
plt.grid(True)
plt.show()

# Вывод результатов
print(f"Коэффициент вариации (выход): {cv_output:.3f}")

# Результаты проверки на пальмовское распределение
print(f"Статистика К–С теста (равномерное): {ks_stat_uniform:.3f}")
print(f"p-value (равномерное): {p_value_uniform:.3f}")
if p_value_uniform > 0.05:
    print("Гипотеза о соответствии выходного потока пальмовому распределению НЕ отвергается.")
else:
    print("Гипотеза отвергается, выходной поток не пальмовский.")

# Результаты проверки на эрланговское распределение
print(f"Статистика К–С теста (эрланговское): {ks_stat_erlang:.3f}")
print(f"p-value (эрланговское): {p_value_erlang:.3f}")
if p_value_erlang > 0.05:
    print("Гипотеза о соответствии выходного потока эрланговскому распределению НЕ отвергается.")
else:
    print("Гипотеза отвергается, выходной поток не эрланговский.")
