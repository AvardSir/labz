import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

def non_uniform_vertical_blur_mask(size):
    """Создает вертикальную маску размаза с неравномерным смазом."""
    k = np.zeros((size, size), dtype=np.float32)
    center_index = (size - 1) // 2
    for i in range(size):
        k[i, center_index] = max(0, 1 - abs(center_index - i) / center_index)
    k = k / np.sum(k)  # Нормировка
    return k

def perturb_psf(psf, strength):
    """Вносит небольшие случайные искажения в PSF (до 10% отклонения)."""
    noise = np.random.uniform(-strength, strength, psf.shape)
    psf_perturbed = psf + psf * noise  # Множим шум на psf для пропорциональности
    psf_perturbed = np.clip(psf_perturbed, 0, None)  # Убираем возможные отрицательные значения
    psf_perturbed /= np.sum(psf_perturbed)  # Повторная нормировка
    return psf_perturbed

# Размер маски
size = 9

# Загрузка изображения
input_image = cv2.imread('text1.jpg')
input_image = input_image.astype(np.float32) / 255.

# Исходная маска PSF
PSF_blur = non_uniform_vertical_blur_mask(size)
print("Исходная PSF:")
print(PSF_blur)

# Смазываем изображение с исходной маской
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Восстановление с искажённой на 10% маской
PSF_deblur = perturb_psf(PSF_blur, strength=0)
print("Искажённая PSF для восстановления:")
print(PSF_deblur)

# Восстановление по трём каналам
its = 6
image_deblur = input_image.copy()
for c in range(3):
    image_deblur[:, :, c] = restoration.richardson_lucy(blur_image[:, :, c], PSF_deblur, num_iter=its)

# Ограничения и денормировка
image_deblur = np.clip(image_deblur, 0., 1.)
image_deblur = (image_deblur * 255.).astype(np.uint8)

# Визуализация
plt.figure(figsize=(18, 6))
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(cv2.cvtColor(blur_image, cv2.COLOR_BGR2RGB))
plt.title('Смазанное изображение')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(cv2.cvtColor(image_deblur, cv2.COLOR_BGR2RGB))
plt.title('Восстановленное (искажённая PSF)')
plt.axis('off')

plt.tight_layout()
plt.show()
