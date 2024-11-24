import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Размеры сетки
GRID_SIZE = 20

def create_glider(grid):
    """Создает глайдер в центре сетки."""
    glider = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1]
    ]
    x_offset = grid.shape[0] // 2 - 1
    y_offset = grid.shape[1] // 2 - 1
    for i in range(3):
        for j in range(3):
            grid[x_offset + i, y_offset + j] = glider[i][j]
    return grid

def update_grid(grid):
    """Обновляет сетку на основе правил игры."""
    new_grid = grid.copy()
    for i in range(grid.shape[0]):
        for j in range(grid.shape[1]):
            # Считаем количество живых соседей
            total = (
                grid[i, (j-1) % grid.shape[1]] + grid[i, (j+1) % grid.shape[1]] +
                grid[(i-1) % grid.shape[0], j] + grid[(i+1) % grid.shape[0], j] +
                grid[(i-1) % grid.shape[0], (j-1) % grid.shape[1]] +
                grid[(i-1) % grid.shape[0], (j+1) % grid.shape[1]] +
                grid[(i+1) % grid.shape[0], (j-1) % grid.shape[1]] +
                grid[(i+1) % grid.shape[0], (j+1) % grid.shape[1]]
            )
            # Применяем правила игры
            if grid[i, j] == 1:
                if total < 2 or total > 3:
                    new_grid[i, j] = 0  # Клетка умирает
            else:
                if total == 3:
                    new_grid[i, j] = 1  # Клетка оживает
    return new_grid

def animate(grid, frames=100, interval=200):
    """Анимация клеточного автомата."""
    fig, ax = plt.subplots()
    img = ax.imshow(grid, cmap="binary")

    def update(frame):
        nonlocal grid
        grid = update_grid(grid)
        img.set_data(grid)
        return img,

    ani = animation.FuncAnimation(fig, update, frames=frames, interval=interval, blit=True)
    plt.show()

# Создаем пустую сетку и добавляем глайдер
initial_grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)
initial_grid = create_glider(initial_grid)

# Анимация
animate(initial_grid)
