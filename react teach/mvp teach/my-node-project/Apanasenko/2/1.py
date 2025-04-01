import numpy as np
import matplotlib.pyplot as plt

# Параметры модели
#ITU, office area
R = 30          # Радиус зоны покрытия (м)
Ptx = 0.1       # Мощность передачи (Вт)
f0 = 1200       # Частота (МГц)
kn = 2          # Коэффициент шума
deltaF = 180 * 10**(3)  # Полоса частот (Гц)
Trb = 0.5 * 10**(-3)      # Длительность слота (с)
V = 1024*8      # Объем пакета (бит) = 1 Кбайт
slot_cnt = 1000 # Количество слотов
N = 88    # Количество абонентских станций

def distance(N, R):
    angles = np.random.uniform(0, 2 * np.pi, N)
    r = np.sqrt(np.random.uniform(0, R**2, N))
    x = r * np.cos(angles)
    y = r * np.sin(angles)
    return x, y, r

# Генерация дистанций от БС
x, y, r = distance(N, R)

circle_points = np.linspace(0, 2 * np.pi)
x_circle = R * np.cos(circle_points)
y_circle = R * np.sin(circle_points)

# Визуализация
plt.figure(figsize=(10, 10))
plt.scatter(x, y, color='blue', label=f'Абоненты ({N})')  # Все абоненты в одном цвете

plt.plot(x_circle, y_circle)
plt.scatter(0, 0, color='green', label='Базовая станция')  # Базовая станция в центре

plt.xlabel('Координата X (км)')
plt.ylabel('Координата Y (км)')
plt.title(f'Случайное расположение {N} абонентских станций')
plt.grid(True)
plt.legend()
plt.show()
