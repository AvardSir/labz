import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Размеры сетки
GRID_SIZE = 50

def create_grid(size):
    """Создает случайную начальную сетку."""
    return np.random.choice([0, 1], size=(size, size))

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

# Запуск автомата
initial_grid = create_grid(GRID_SIZE)
animate(initial_grid)
