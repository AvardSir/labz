import numpy as np
import matplotlib.pyplot as plt

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
accepted_count = len(accepted_times)
throughput = accepted_count / simulation_time
rejection_rate = rejected_count / len(arrival_times)
utilization = sum([channel - arrival_time for channel in channels if channel > 0]) / (num_channels * simulation_time)

# Статистика входного потока
inter_arrival_times_input = np.diff(arrival_times)
mean_inter_arrival_time_input = np.mean(inter_arrival_times_input) if len(inter_arrival_times_input) > 0 else 0
variance_inter_arrival_time_input = np.var(inter_arrival_times_input) if len(inter_arrival_times_input) > 0 else 0

# Статистика выходного потока
inter_arrival_times_output = np.diff(finish_times)
mean_inter_arrival_time_output = np.mean(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0
variance_inter_arrival_time_output = np.var(inter_arrival_times_output) if len(inter_arrival_times_output) > 0 else 0

# Вывод статистики
print(f"Количество обработанных заявок: {accepted_count}")
print(f"Количество отклоненных заявок: {rejected_count}")
print(f"Пропускная способность системы: {throughput:.3f} заявки/сек")
print(f"Доля отклоненных заявок: {rejection_rate:.3f}")
print(f"Коэффициент загрузки системы: {utilization:.3f}")

print(f"Среднее межприбытие заявок (вход): {mean_inter_arrival_time_input:.3f} сек")
print(f"Дисперсия межприбытия заявок (вход): {variance_inter_arrival_time_input:.3f}")
print(f"Среднее межприбытие заявок (выход): {mean_inter_arrival_time_output:.3f} сек")
print(f"Дисперсия межприбытия заявок (выход): {variance_inter_arrival_time_output:.3f}")

# Графики
plt.figure(figsize=(12, 8))

# Первый график: Входной поток
plt.subplot(2, 2, 1)
plt.plot(arrival_times, np.arange(1, len(arrival_times) + 1), 'bo-', label='Входной поток')
plt.xlabel("Время (сек)")
plt.ylabel("Номер заявки")
plt.legend()
plt.title("Входной поток (кумулятивный)")
plt.grid(True)

# Второй график: Обслуженные заявки
plt.subplot(2, 2, 2)
plt.plot(finish_times, np.arange(1, len(finish_times) + 1), 'go-', label='Обслуженные заявки')
plt.xlabel("Время (сек)")
plt.ylabel("Номер заявки")
plt.legend()
plt.title("Обслуженные заявки (кумулятивный)")
plt.grid(True)

# Третий график: Гистограмма межприбытия (входной поток)
plt.subplot(2, 2, 3)
plt.hist(inter_arrival_times_input, bins=20, alpha=0.7, color='b', label='Входной поток')
plt.xlabel("Межприбытие (сек)")
plt.ylabel("Частота")
plt.legend()
plt.title("Гистограмма межприбытия (вход)")
plt.grid(True)

# Четвертый график: Гистограмма межприбытия (выходной поток)
plt.subplot(2, 2, 4)
plt.hist(inter_arrival_times_output, bins=20, alpha=0.7, color='g', label='Выходной поток')
plt.xlabel("Межприбытие (сек)")
plt.ylabel("Частота")
plt.legend()
plt.title("Гистограмма межприбытия (выход)")
plt.grid(True)

# Отображение графиков
plt.tight_layout()
plt.show()


from scipy.stats import erlang, kstest

# Вычисление коэффициента вариации для входного и выходного потока
cv_input = np.sqrt(variance_inter_arrival_time_input) / mean_inter_arrival_time_input if mean_inter_arrival_time_input > 0 else 0
cv_output = np.sqrt(variance_inter_arrival_time_output) / mean_inter_arrival_time_output if mean_inter_arrival_time_output > 0 else 0

# Гипотетические параметры эраланговского распределения для выходного потока
k = int(round(1 / (cv_output**2))) if cv_output > 0 else 1
lambda_rate_output = k / mean_inter_arrival_time_output if mean_inter_arrival_time_output > 0 else 1

# Статистический тест К–С для соответствия выходного потока эраланговскому распределению
d_stat, p_value = kstest(inter_arrival_times_output, 'erlang', args=(k, 0, 1 / lambda_rate_output))

# Вывод результатов
print(f"Коэффициент вариации (вход): {cv_input:.3f}")
print(f"Коэффициент вариации (выход): {cv_output:.3f}")
print(f"Гипотетический параметр k для выходного потока: {k}")
print(f"Интенсивность (выходной поток): {lambda_rate_output:.3f}")
print(f"Статистика К–С теста: {d_stat:.3f}")
print(f"p-value: {p_value:.3f}")
if p_value > 0.05:
    print("Гипотеза о соответствии выходного потока эраланговскому распределению НЕ отвергается.")
else:
    print("Гипотеза отвергается, выходной поток не эраланговский.")

# Гистограмма с наложением эраланговского распределения
plt.figure(figsize=(8, 6))
plt.hist(inter_arrival_times_output, bins=20, density=True, alpha=0.7, color='g', label='Выходной поток')

# Теоретическая плотность эраланговского распределения
x = np.linspace(0, max(inter_arrival_times_output), 100)
pdf_erlang = erlang.pdf(x, k, scale=1 / lambda_rate_output)
plt.plot(x, pdf_erlang, 'r-', label=f"Эраланг(k={k}, λ={lambda_rate_output:.2f})")

plt.xlabel("Межприбытие (сек)")
plt.ylabel("Плотность вероятности")
plt.legend()
plt.title("Гистограмма межприбытия (выход) и теоретическая плотность")
plt.grid(True)
plt.show()
