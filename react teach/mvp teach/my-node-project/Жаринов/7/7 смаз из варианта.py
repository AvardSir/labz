import numpy as np
import matplotlib.pyplot as plt

def non_uniform_vertical_blur_mask(size):
    """Создает вертикальную маску размаза с неравномерным смазом."""
    k = np.zeros((size, size), dtype=np.float32)
    center_index = (size - 1) // 2
    for i in range(size):
        # Вычисляем значение для каждого элемента в центре
        k[i, center_index] = max(0, 1 - abs(center_index - i) / center_index)
    k = k / np.sum(k)  # Нормировка
    return k

# Размер маски
size = 9

# Создание маски
psf_non_uniform = non_uniform_vertical_blur_mask(size)

# Визуализация маски
plt.figure(figsize=(6, 6))
plt.imshow(psf_non_uniform, cmap='gray')
plt.title('Неравномерный вертикальный смаз')
plt.axis('off')
plt.show()
