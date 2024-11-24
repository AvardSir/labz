import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Размеры сетки
GRID_SIZE = 100  # Количество клеток в строке
STEPS = 10000      # Количество шагов (строк)

def rule30(left, center, right):
    """Применяет правило 30."""
    return left ^ (center | right)

def update_rule30(grid):
    """Обновляет сетку по правилу 30."""
    new_row = np.zeros_like(grid[0])
    for i in range(1, len(grid[0]) - 1):
        left = grid[-1, i - 1]
        center = grid[-1, i]
        right = grid[-1, i + 1]
        new_row[i] = rule30(left, center, right)
    return np.vstack([grid, new_row])

def initialize_grid(size, steps):
    """Создает начальную сетку с одной активной клеткой посередине."""
    grid = np.zeros((1, size), dtype=int) # из нулей рамезром size а 1 это что одномерный а не двумерный там
    grid[0, size // 2] = 1  # Активируем центральную клетку
    return grid

def animate_rule30(grid, steps):
    """Анимация клеточного автомата по правилу 30."""
    fig, ax = plt.subplots(figsize=(8, 8))
    img = ax.imshow(grid, cmap="binary", interpolation="nearest", aspect="auto")
    ax.axis('off')

    def update(frame):
        nonlocal grid
        grid = update_rule30(grid)
        img.set_data(grid[-steps:])  # Показываем последние STEPS строк
        return img,

    ani = animation.FuncAnimation(fig, update, frames=steps, interval=100, blit=True)
    plt.show()

# Создаем начальную сетку
initial_grid = initialize_grid(GRID_SIZE, STEPS)

# Запускаем анимацию
animate_rule30(initial_grid, STEPS)
