import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
mu_rate = 4       # Интенсивность обслуживания (заявки в секунду на канал)
N = 4             # Количество каналов
K = 30            # Размер буфера (для системы с буфером)
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


def simulate_with_buffer(lambda_rate, mu_rate, N, K, time_steps):
    """Моделирование системы с буфером и повторными попытками обработки заявок."""
    busy_channels = []  # Список времени завершения работы каналов
    buffer = []  # Буфер: [(время_создания_заявки), ...]
    lost_requests = 0
    processed_times = []  # Время обработки каждой заявки

    for t in range(time_steps):
        # Освобождаем каналы, у которых завершилось обслуживание
        busy_channels = [end_time for end_time in busy_channels if end_time > t]

        # Генерация новых заявок
        arrivals = np.random.poisson(lambda_rate)
        for _ in range(arrivals):
            if len(buffer) < K:  # Если есть место в буфере
                buffer.append(t)
            else:
                lost_requests += 1  # Потеря заявки из-за переполнения буфера
        
        # Обработка заявок из буфера
        while buffer and len(busy_channels) < N:
            request_time = buffer.pop(0)  # Берем первую заявку из буфера
            processed_times.append(t - request_time)  # Время обработки = текущее время - время создания
            service_time = np.random.exponential(1 / mu_rate)  # Время обслуживания заявки
            busy_channels.append(t + service_time)  # Канал освободится в момент t + service_time
    
    # Среднее время обработки (если есть обработанные заявки)
    avg_processing_time = np.mean(processed_times) if processed_times else 0

    return lost_requests, avg_processing_time

def plot_lost_requests_and_avg_time_with_buffer():
    """График зависимости количества потерянных заявок и среднего времени обработки от λ для систем с и без буфера."""
    lambda_values = np.arange(1, 15, 1)  # Разные значения λ
    lost_no_buffer = []
    avg_time_no_buffer = []
    lost_with_buffer = []
    avg_time_with_buffer = []

    for lambda_rate in lambda_values:
        # Система без буфера
        lost_nb, avg_time_nb = simulate_with_retry(lambda_rate, mu_rate, N, time_steps)
        lost_no_buffer.append(lost_nb)
        avg_time_no_buffer.append(avg_time_nb)
        
        # Система с буфером
        lost_wb, avg_time_wb = simulate_with_buffer(lambda_rate, mu_rate, N, K, time_steps)
        lost_with_buffer.append(lost_wb)
        avg_time_with_buffer.append(avg_time_wb)
    
    # Построение графиков
    plt.figure(figsize=(12, 12))
    
    # График потерянных заявок
    plt.subplot(2, 1, 1)
    plt.plot(lambda_values, lost_no_buffer, label="Без буфера", marker='o')
    plt.plot(lambda_values, lost_with_buffer, label="С буфером", marker='o')
    plt.title("Зависимость потерянных заявок от λ")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Количество потерянных заявок")
    plt.grid(True)
    plt.legend()
    
    # График среднего времени обработки
    plt.subplot(2, 1, 2)
    plt.plot(lambda_values, avg_time_no_buffer, label="Без буфера", marker='o', color='orange')
    plt.plot(lambda_values, avg_time_with_buffer, label="С буфером", marker='o', color='green')
    plt.title("Зависимость среднего времени обработки от λ")
    plt.xlabel("Интенсивность входного потока λ")
    plt.ylabel("Среднее время обработки (шаги)")
    plt.grid(True)
    plt.legend()
    
    plt.tight_layout()
    plt.show()

# Построение графиков
plot_lost_requests_and_avg_time_with_buffer()
