import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

def non_uniform_vertical_blur_mask(size):
    """
    Создает вертикальную маску размаза с неравномерным смазом.
    """
    k = np.zeros((size, size), dtype=np.float32)
    center_index = (size - 1) // 2
    for i in range(size):
        distance = abs(center_index - i)
        k[i, center_index] = max(0, 1 - (distance / center_index))
    k = k / np.sum(k)
    return k

# Параметры
size = 31
its = 15

# Загрузка смазанного изображения
blur_image = cv2.imread('boy.jpg')
blur_image = blur_image.astype(np.float32) / 255.

# Предполагаемая маска смаза
PSF_guess = non_uniform_vertical_blur_mask(size)

# Восстановление изображения
image_deblurred = np.zeros_like(blur_image)
for c in range(3):
    image_deblurred[:, :, c], _ = restoration.unsupervised_wiener(
        blur_image[:, :, c], PSF_guess, is_real=True
    )

# Постобработка
image_deblurred = np.clip(image_deblurred, 0., 1.)
image_deblurred = (image_deblurred * 255).astype(np.uint8)

# Визуализация
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(blur_image, cv2.COLOR_BGR2RGB))
plt.title('Смазанное изображение')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(image_deblurred, cv2.COLOR_BGR2RGB))
plt.title('Восстановленное изображение')
plt.axis('off')

plt.tight_layout()
plt.show()
