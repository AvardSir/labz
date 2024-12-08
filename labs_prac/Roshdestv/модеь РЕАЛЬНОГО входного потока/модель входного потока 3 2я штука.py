import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
lambda_rate = 5  # интенсивность потока (событий в единицу времени)
num_events = 100  # количество событий для моделирования

# Генерация времени наступления событий
interarrival_times = np.random.exponential(scale=1/lambda_rate, size=num_events)
event_times = np.cumsum(interarrival_times)

# Вычисление математического ожидания
mean_interarrival_time = np.mean(interarrival_times)
print(f"Математическое ожидание межсобытийного времени: {mean_interarrival_time:.2f}")

# Построение графика времени наступления событий
plt.figure(figsize=(10, 6))
plt.step(event_times, range(1, num_events + 1), where='post', label='Время наступления событий')
plt.ylabel('Номер события')
plt.xlabel('Время наступления события')
plt.title('Модель пуассоновского потока')
plt.grid()
plt.legend()
plt.show()
аоаоаоа