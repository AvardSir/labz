import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.restoration import richardson_lucy
from scipy.ndimage import rotate

def motion_blur_psf(length, angle):
    """Создаёт PSF для имитации движения под углом."""
    psf = np.zeros((length, length))
    psf[length // 2, :] = 1
    psf = rotate(psf, angle, reshape=False)
    psf /= psf.sum()
    return psf

# Параметры
length = 9          # длина движения
angle = 0          # угол движения (например, 0 градусов)
iterations = 10     # количество итераций

# Загрузка изображения
input_image = cv2.imread('boy.jpg')
input_image = input_image.astype(np.float32) / 255.

# PSF
psf = motion_blur_psf(length, angle)

# Восстановление изображения (без размытия)
restored = np.zeros_like(input_image)
for c in range(3):
    restored[:, :, c] = richardson_lucy(input_image[:, :, c], psf, num_iter=iterations, clip=False)

# Визуализация
plt.figure(figsize=(10, 5))

# Исходное изображение
plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(np.clip(input_image, 0, 1), cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

# Восстановленное изображение
plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(np.clip(restored, 0, 1), cv2.COLOR_BGR2RGB))
plt.title('Восстановлено (угол 0°)')
plt.axis('off')

plt.tight_layout()
plt.show()
