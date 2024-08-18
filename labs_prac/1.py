import numpy as np
import matplotlib.pyplot as plt

def is_inside_area(x, y):
    return (-x**3 - y**3 < 2) and (-x + y**2 < 2)

x = np.linspace(-2, 2, 400)
y = np.linspace(-2, 2, 400)
X, Y = np.meshgrid(x, y)

Z1 = -X**3 - Y**3 < 2
Z2 = -X + Y**2 < 2
Z = Z1 & Z2

plt.figure(figsize=(8, 8))
plt.contourf(X, Y, Z, levels=[0, 1], colors=['lightblue'], alpha=0.6)
plt.contour(X, Y, Z1, levels=[0], colors='blue', linestyles='dashed', label='-x^3 - y^3 = 2')
plt.contour(X, Y, Z2, levels=[0], colors='red', linestyles='dotted', label='-x + y^2 = 2')

plt.xlim(-2, 2)
plt.ylim(-2, 2)
plt.xlabel('x')
plt.ylabel('y')
plt.title('Графики функций и область их пересечения')
plt.legend(['-x^3 - y^3 = 2', '-x + y^2 = 2'])
plt.grid(True)
plt.show()

N = 100000
P = 0

for _ in range(N):
    x_rand = np.random.uniform(-2, 2)
    y_rand = np.random.uniform(-2, 2)
    
    if is_inside_area(x_rand, y_rand):
        P += 1

rectangle_area = 4 * 4

area_estimate = (P / N) * rectangle_area

print(f"Оцененная площадь области: {area_estimate:.4f}")
