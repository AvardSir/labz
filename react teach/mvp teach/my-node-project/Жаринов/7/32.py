import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

# Параметры
image_path = 'run2.jpg'  # Путь к изображению
mask_size =11            # Размер маски
mask_angle = -120        # Угол размаза в градусах
noise_variance = 0.1   # Уровень шума

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

# Задаем искажающую маску в виде матрицы
PSF_blur = blur_mask(size=mask_size, angle=mask_angle)
print(PSF_blur)  # Посмотрим на искажающую маску

# Двумерная инверсная винеровская фильтрация
image_deblur = input_image.copy()

# Обработка по трем цветовым каналам раздельно
# ---------------------------------------------------------
image_deblur[:, :, 0] = restoration.wiener(input_image[:, :, 0], PSF_blur, noise_variance)
image_deblur[:, :, 1] = restoration.wiener(input_image[:, :, 1], PSF_blur, noise_variance)
image_deblur[:, :, 2] = restoration.wiener(input_image[:, :, 2], PSF_blur, noise_variance)
# ---------------------------------------------------------

# Ограничение и денормировка
image_deblur = np.clip(image_deblur, 0., 1.)
image_deblur = (image_deblur * 255.).astype(np.uint8)

# Визуализация исходного и восстановленного изображений и карты маски
plt.figure(figsize=(15, 5))

# Исходное изображение
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

# Восстановленное изображение
plt.subplot(1, 3, 2)
plt.imshow(cv2.cvtColor(image_deblur, cv2.COLOR_BGR2RGB))
plt.title('Восстановленное изображение')
plt.axis('off')

# Карта маски
plt.subplot(1, 3, 3)
plt.imshow(PSF_blur, cmap='gray')
plt.title('Карта маски')
plt.axis('off')

plt.tight_layout()
plt.show()
