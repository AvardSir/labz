import numpy as np
import matplotlib.pyplot as plt

# Исходные данные
R = 1.0  # расстояние в км (1000 м)
P_tx = 320  # мощность передатчика, Вт
f0 = 1800e6  # частота, Гц (1800 МГц)
delta_f = 5e6  # ширина канала, Гц (5 МГц)
kn = 3  # коэффициент, заданный пользователем

h_BS = 50  # высота базовой станции, м
h_MS = 10  # высота мобильной станции, м

# Константы
k = 1.38e-23  # постоянная Больцмана, Дж/К
T = 290  # температура, К

N = 500  # Количество абонентских станций

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
plt.scatter(x, y, color='black', label=f'Абоненты ({N})')
plt.plot(x_circle, y_circle, color='blue')
plt.scatter(0, 0, color='red', label='Базовая станция')  # Базовая станция в центре

plt.xlabel('Координата X (км)')
plt.ylabel('Координата Y (км)')
plt.title(f'Случайное расположение {N} абонентских станций')
plt.grid(True)
plt.legend()
plt.show()



# Исходные данные
R = 1.0  # расстояние в км (1000 м)
P_tx = 320  # мощность передатчика, Вт
f0 = 1800e6  # частота, Гц (1800 МГц)
delta_f = 5e6  # ширина канала, Гц (5 МГц)
kn = 3  # коэффициент, заданный пользователем

h_BS = 50  # высота базовой станции, м
h_MS = 10  # высота мобильной станции, м

# Константы
k = 1.38e-23  # постоянная Больцмана, Дж/К
T = 290  # температура, К

N = 500  # Количество абонентских станций

def distance(N, R):
    angles = np.random.uniform(0, 2 * np.pi, N)
    r = (np.random.uniform(0, R, N))
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
plt.scatter(x, y, color='black', label=f'Абоненты ({N})')
plt.plot(x_circle, y_circle, color='blue')
plt.scatter(0, 0, color='red', label='Базовая станция')  # Базовая станция в центре

plt.xlabel('Координата X (км)')
plt.ylabel('Координата Y (км)')
plt.title(f'Случайное расположение {N} абонентских станций')
plt.grid(True)
plt.legend()
plt.show()
