import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import rotate

def angled_blur_mask(size, angle_degrees=14, noise_strength=0.03):
    """
    Создает маску размытия под углом с небольшим нормальным шумом.
    """
    k = np.zeros((size, size), dtype=np.float32)
    center = size // 2
    for i in range(size):
        k[i, center] = max(0, 1 - abs(center - i) / center)

    k /= np.sum(k)

    # Поворот маски
    k_rotated = rotate(k, angle_degrees, reshape=False, order=1)

    # Добавление нормального шума
    noise = np.random.normal(0, noise_strength, k_rotated.shape)
    k_noisy = k_rotated + noise
    k_noisy = np.clip(k_noisy, 0, None)
    k_noisy /= np.sum(k_noisy)

    return k_noisy

# Параметры
size = 31
angle = 14
noise_strength = 0.03
iterations = 30  # для Ричардсона-Люси

# Загрузка размытого изображения
blur_image = cv2.imread('boy.jpg')
blur_image = blur_image.astype(np.float32) / 255.

# Генерация PSF
psf = angled_blur_mask(size, angle_degrees=angle, noise_strength=noise_strength)

# Восстановление изображения
image_deblurred = np.zeros_like(blur_image)
for c in range(3):
    image_deblurred[:, :, c] = restoration.richardson_lucy(
    blur_image[:, :, c], psf, num_iter=iterations, clip=False
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
plt.title('Восстановление (Richardson-Lucy)')
plt.axis('off')

plt.tight_layout()
plt.show()
