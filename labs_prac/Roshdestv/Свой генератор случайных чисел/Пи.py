

class get3:
    def __init__(self, seed):
        self.x = 3**30
        self.seed = (seed + self.x**(1/2))

    def random(self, a, b):
        # Генерация нового значения
        self.seed = (self.seed + self.seed**(1/2))
        # Нормализация в [a, b]
        normalized = (self.seed % (b - a))   # остаток от деления на (b-a)
        return a + normalized  # Сдвиг в диапазон [a, b)


ge = get3(30)
print([ge.random(0, 10) for _ in range(1000)])

def estimate_pi(n):
    inside_circle = 0  # Количество точек в круге

    for _ in range(n):
        # Генерация случайных координат x и y
        x, y = ge.random(0, 1), ge.random(0, 1)

        # Проверяем, находится ли точка внутри круга
        if x**2 + y**2 <= 1:
            inside_circle += 1

    # Оценка числа π
    pi_estimate = 4 * inside_circle / n
    return pi_estimate

# Количество точек для метода Монте-Карло
n_points = 100000
pi_approx = estimate_pi(n_points)

print(f"Приближённое значение числа π: {pi_approx}")
