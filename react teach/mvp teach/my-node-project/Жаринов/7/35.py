import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

# Параметры
image_path = 'boy2.jpg'  # Путь к изображению
mask_sizes = [3, 5, 11, 13, 15]  # Размеры масок
num_iters = [5, 10, 15, 20, 25]  # Количество итераций для метода Люси-Ричардсона
mask_angle = 45  # Угол размаза в градусах, фиксированный

# Функция, создающая маску:
# size - размер маски в пикселях,
# angle - направление размазывания в градусах
def blur_mask(size, angle):
    k = np.zeros((size, size), dtype=np.float32)
    k[(size - 1) // 2, :] = np.ones(size, dtype=np.float32)
    k = cv2.warpAffine(k, 
                       cv2.getRotationMatrix2D((size / 2 - 0.5, size / 2 - 0.5), 
                                                angle, 1.0), 
                       (size, size))
    k = k / np.sum(k)  # Нормировка
    return k

# Чтение входного изображения
input_image = cv2.imread(image_path)

# Нормировка данных изображения и перевод во float
input_image = input_image.astype(np.float32) / 255.

# Создание фигуры для визуализации
fig, axes = plt.subplots(len(mask_sizes), len(num_iters), figsize=(20, 20))

# Обработка по комбинациям параметров
for i, mask_size in enumerate(mask_sizes):
    for j, num_iter in enumerate(num_iters):
        # Задаем искажающую маску в виде матрицы
        PSF_blur = blur_mask(size=mask_size, angle=mask_angle)
        
        # Восстановление изображения методом Люси-Ричардсона
        image_deblur = input_image.copy()

        # Обработка по трем цветовым каналам раздельно
        for c in range(3):
            image_deblur[:, :, c] = restoration.richardson_lucy(input_image[:, :, c], PSF_blur, num_iter=num_iter)

        # Ограничение и денормировка
        image_deblur = np.clip(image_deblur, 0., 1.)
        image_deblur = (image_deblur * 255.).astype(np.uint8)

        # Визуализация (исходное изображение, восстановленное и маска)
        ax = axes[i, j]
        ax.imshow(cv2.cvtColor(image_deblur, cv2.COLOR_BGR2RGB))
        ax.set_title(f'Size: {mask_size}, Iter: {num_iter}')
        ax.axis('off')

plt.tight_layout()
plt.show()
