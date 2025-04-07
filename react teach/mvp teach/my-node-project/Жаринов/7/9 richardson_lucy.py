import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

def non_uniform_vertical_blur_mask(size):
    """Создает вертикальную маску размаза с неравномерным смазом."""
    k = np.zeros((size, size), dtype=np.float32)
    center_index = (size - 1) // 2
    for i in range(size):
        # Увеличиваем коэффициент для более сильного размытия
        k[i, center_index] = max(0, 1 - (abs(center_index - i) / center_index) ** 2)
    k = k / np.sum(k)  # Нормировка
    return k

# Размер маски (увеличиваем для более сильного размытия)
size = 15  # Увеличиваем размер маски размаза

# Загрузка изображения
input_image = cv2.imread('text1.jpg')
# Нормировка данных изображения и перевод во float:
input_image = input_image.astype(np.float32) / 255.

# Задаем искажающую маску в виде матрицы:
PSF_blur = non_uniform_vertical_blur_mask(size=size)
print(PSF_blur)  # Посмотрим на искажающую маску

# И размажем ею изображение:
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Двумерная инверсная винеровская фильтрация (метод Люси-Ричардсона)
noise_var = 1  # Подбор уровня шума
image_deblur = input_image.copy()
# Обработка по трем цветовым каналам раздельно:
# ---------------------------------------------------------
its = 10  # Увеличиваем количество итераций
image_deblur[:, :, 0] = restoration.richardson_lucy(blur_image[:, :, 0], PSF_blur, num_iter=its)
image_deblur[:, :, 1] = restoration.richardson_lucy(blur_image[:, :, 1], PSF_blur, num_iter=its)
image_deblur[:, :, 2] = restoration.richardson_lucy(blur_image[:, :, 2], PSF_blur, num_iter=its)
# ---------------------------------------------------------
# Ограничение и денормировка:
image_deblur = np.clip(image_deblur, 0., 1.)
image_deblur = (image_deblur * 255.).astype(np.uint8)

# Визуализация исходного, смазанного и восстановленного изображений на одном графике:
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
