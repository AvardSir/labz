import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.restoration import richardson_lucy
from scipy.ndimage import rotate

def motion_blur_psf(length, angle):
    """Создание PSF для размытия движения под углом."""
    psf = np.zeros((length, length))
    psf[length // 2, :] = np.ones(length)
    psf = rotate(psf, angle, reshape=False)
    psf /= psf.sum()
    return psf

# Параметры
length = 31           # длина размытия
angle = 14            # угол движения
iterations = 30       # итерации Ричардсона-Люси

# Загрузка изображения
input_image = cv2.imread('boy.jpg')
input_image = input_image.astype(np.float32) / 255.

# Создание PSF и размытие
psf = motion_blur_psf(length, angle)
blurred = cv2.filter2D(input_image, -1, psf)

# Восстановление
restored = np.zeros_like(input_image)
for c in range(3):
    restored[:, :, c] = richardson_lucy(blurred[:, :, c], psf, num_iter=iterations, clip=False)

# Визуализация
plt.figure(figsize=(12, 6))
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(cv2.cvtColor(blurred, cv2.COLOR_BGR2RGB))
plt.title(f'Смазанное (угол {angle}°)')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(cv2.cvtColor(np.clip(restored, 0, 1), cv2.COLOR_BGR2RGB))
plt.title('Восстановлено (Richardson-Lucy)')
plt.axis('off')

plt.tight_layout()
plt.show()
