import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
lambda_rate = 5  # интенсивность потока (событий в единицу времени)
num_events = 100  # количество событий для моделирования
time_limit = 1  # время, до которого моделируем события
num_measurements = 10  # количество замеров

# Создание фигуры для графика
plt.figure(figsize=(12, 6))

# Генерация и отображение замеров
for i in range(num_measurements):
    # Генерация времени наступления событий
    interarrival_times = np.random.exponential(scale=1/lambda_rate, size=num_events)
    event_times = np.cumsum(interarrival_times)

    # Фильтрация событий, которые произошли до заданного времени
    event_times = event_times[event_times <= time_limit]

    # Построение графика событий по времени
    plt.scatter(event_times, np.ones_like(event_times) * (i + 1), marker='o', label=f'Замер {i + 1}')

# Настройка графика
plt.xlabel('Время')
plt.ylabel('Замер')
plt.title('События пуассоновского потока для 10 замеров и lamda 5')
plt.yticks(range(1, num_measurements + 1))
plt.xlim(0, time_limit)
plt.grid()
plt.legend(loc='upper right', bbox_to_anchor=(1.15, 1), title='Замеры')

# Показ графика
plt.tight_layout()
plt.show()
