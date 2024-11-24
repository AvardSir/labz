import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
mu_rate = 4       # Интенсивность обслуживания (заявки в секунду на канал)
N = 4             # Количество каналов
K = 200            # Размер буфера (для системы с буфером)
time_steps = 1000  # Количество временных шагов

def simulate_with_retry(lambda_rate, mu_rate, N, time_steps):
    """Моделирование системы с повторными попытками обработки заявок."""
    busy_channels = []  # Список времени завершения работы каналов
    pending_requests = []  # Очередь: [(время_создания_заявки), ...]
    lost_requests = 0
    processed_times = []  # Время обработки каждой заявки

    for t in range(time_steps):
        # Освобождаем каналы, у которых завершилось обслуживание
        busy_channels = [end_time for end_time in busy_channels if end_time > t]

        # Генерация новых заявок
        arrivals = np.random.poisson(lambda_rate)
        pending_requests.extend([t] * arrivals)  # Сохраняем время создания заявки
        
        # Пытаемся обработать заявки из очереди
        while pending_requests and len(busy_channels) < N:
            request_time = pending_requests.pop(0)  # Убираем из очереди первую заявку
            processed_times.append(t - request_time)  # Время обработки = текущее время - время создания
            service_time = np.random.exponential(1 / mu_rate)  # Генерируем время обслуживания
            busy_channels.append(t + service_time)  # Канал освободится в момент t + service_time
    
    # Заявки, которые не были обработаны за все временные шаги, считаются потерянными
    lost_requests += len(pending_requests)
    
    # Среднее время обработки (если есть обработанные заявки)
    avg_processing_time = np.mean(processed_times) if processed_times else 0

    return lost_requests, avg_processing_time



def plot_lost_requests_and_avg_time():
    """График зависимости количества потерянных заявок и среднего времени обработки от λ."""
    lambda_values = np.arange(1, 15, 1)  # Разные значения λ
    lost_requests = []
    avg_processing_times = []

    for lambda_rate in lambda_values:
        lost, avg_time = simulate_with_retry(lambda_rate, mu_rate, N, time_steps)
        lost_requests.append(lost)
        avg_processing_times.append(avg_time)
    
    # Построение графиков
    plt.figure(figsize=(12, 6))
    
    # Потерянные заявки
    plt.subplot(1, 2, 1)
    plt.plot(lambda_values, lost_requests, label="Потерянные заявки", marker='o')
    plt.title("Зависимость потерянных заявок от λ")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Количество потерянных заявок")
    plt.grid(True)
    plt.legend()
    
    # Среднее время обработки
    plt.subplot(1, 2, 2)
    plt.plot(lambda_values, avg_processing_times, label="Среднее время обработки", marker='o', color='orange')
    plt.title("Зависимость среднего времени обработки от λ")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Среднее время обработки (шаги)")
    plt.grid(True)
    plt.legend()
    
    plt.tight_layout()
    plt.show()

# Построение графиков
plot_lost_requests_and_avg_time()
