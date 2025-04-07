import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

# Параметры
image_path = 'boy2.jpg'  # Путь к изображению
mask_sizes = [7, 9, 11, 13, 15]  # Размеры масок
noise_variances = [0.005, 0.1, 0.15, 0.2, 0.25]  # Уровни шума
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
fig, axes = plt.subplots(len(mask_sizes), len(noise_variances), figsize=(20, 20))

# Обработка по комбинациям параметров
for i, mask_size in enumerate(mask_sizes):
    for j, noise_variance in enumerate(noise_variances):
        # Задаем искажающую маску в виде матрицы
        PSF_blur = blur_mask(size=mask_size, angle=mask_angle)
        
        # Двумерная инверсная винеровская фильтрация
        image_deblur = input_image.copy()

        # Обработка по трем цветовым каналам раздельно
        image_deblur[:, :, 0] = restoration.wiener(input_image[:, :, 0], PSF_blur, noise_variance)
        image_deblur[:, :, 1] = restoration.wiener(input_image[:, :, 1], PSF_blur, noise_variance)
        image_deblur[:, :, 2] = restoration.wiener(input_image[:, :, 2], PSF_blur, noise_variance)
        
        # Ограничение и денормировка
        image_deblur = np.clip(image_deblur, 0., 1.)
        image_deblur = (image_deblur * 255.).astype(np.uint8)

        # Визуализация (исходное изображение, восстановленное и маска)
        ax = axes[i, j]
        ax.imshow(cv2.cvtColor(image_deblur, cv2.COLOR_BGR2RGB))
        ax.set_title(f'Size: {mask_size}, Noise: {noise_variance}')
        ax.axis('off')

plt.tight_layout()
plt.show()
