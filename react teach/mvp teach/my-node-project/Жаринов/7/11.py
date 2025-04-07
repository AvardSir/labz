import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

def non_uniform_vertical_blur_mask(size, variation):
    """Создает вертикальную маску размаза с неравномерным смазом, отличающуюся на заданный процент."""
    k = np.zeros((size, size), dtype=np.float32)
    center_index = (size - 1) // 2
    for i in range(size):
        k[i, center_index] = max(0, 1 - (abs(center_index - i) / center_index) ** 2)
    
    k = k * (1 + variation)  # Увеличиваем значения на 10%
    k = k / np.sum(k)  # Нормировка
    return k

def create_deblur_mask(original_mask, variation):
    """Создает маску для восстановления, отличающуюся на заданный процент от оригинальной маски."""
    deblur_mask = original_mask * (1 - variation)  # Уменьшаем значения на 10%
    deblur_mask = deblur_mask / np.sum(deblur_mask)  # Нормировка
    return deblur_mask

# Размер маски
size = 15

# Загрузка изображения
input_image = cv2.imread('text1.jpg')
input_image = input_image.astype(np.float32) / 255.

# Создание маски размытия
PSF_blur = non_uniform_vertical_blur_mask(size=size, variation=0.0)
print("Маска размытия:\n", PSF_blur)

# Размытие изображения
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Создание маски восстановления
PSF_deblur = create_deblur_mask(PSF_blur, variation=0)
print("Маска восстановления:\n", PSF_deblur)

# Двумерная инверсная винеровская фильтрация
noise_var = 0.001
image_deblur = input_image.copy()

# Обработка по трем цветовым каналам раздельно
its = 10
image_deblur[:, :, 0] = restoration.richardson_lucy(blur_image[:, :, 0], PSF_deblur, num_iter=its)
image_deblur[:, :, 1] = restoration.richardson_lucy(blur_image[:, :, 1], PSF_deblur, num_iter=its)
image_deblur[:, :, 2] = restoration.richardson_lucy(blur_image[:, :, 2], PSF_deblur, num_iter=its)

# Ограничение и денормировка
image_deblur = np.clip(image_deblur, 0., 1.)
image_deblur = (image_deblur * 255.).astype(np.uint8)

# Визуализация
plt.figure(figsize=(18, 6))

# Исходное изображение
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

# Смазанное изображение
plt.subplot(1, 3, 2)
plt.imshow(cv2.cvtColor(blur_image, cv2.COLOR_BGR2RGB))
plt.title('Смазанное изображение')
plt.axis('off')

# Восстановленное изображение
plt.subplot(1, 3, 3)
plt.imshow(cv2.cvtColor(image_deblur, cv2.COLOR_BGR2RGB))
plt.title('Восстановленное изображение')
plt.axis('off')

plt.tight_layout()
plt.show()
