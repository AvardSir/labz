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



def perturb_psf(psf, strength):
    noise = np.random.randn(*psf.shape) * strength  # нормальное распределение
    psf_perturbed = psf + noise
    psf_perturbed = np.clip(psf_perturbed, 0, None)
    if np.sum(psf_perturbed) > 0:
        psf_perturbed /= np.sum(psf_perturbed)
    return psf_perturbed


# Параметры
size = 15
its = 10  # количество итераций
strength_noiz=0.5
# Загрузка изображения
input_image = cv2.imread('text1.jpg')
input_image = input_image.astype(np.float32) / 255.

# Исходная маска размытия
PSF_blur = non_uniform_vertical_blur_mask(size)
print("Исходная PSF:")
print(PSF_blur)

# Смазываем изображение
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Вариант 1: Восстановление с оригинальной маской
image_deblur_perfect = np.copy(input_image)
for c in range(3):
    image_deblur_perfect[:, :, c] = restoration.richardson_lucy(blur_image[:, :, c], PSF_blur, num_iter=its)

# Вариант 2: Восстановление с искажённой маской
PSF_deblur_perturbed = perturb_psf(PSF_blur, strength_noiz)
print("Искажённая PSF:")
print(PSF_deblur_perturbed)

image_deblur_perturbed = np.copy(input_image)
for c in range(3):
    image_deblur_perturbed[:, :, c] = restoration.richardson_lucy(blur_image[:, :, c], PSF_deblur_perturbed, num_iter=its)

# Постобработка
image_deblur_perfect = np.clip(image_deblur_perfect, 0., 1.)
image_deblur_perfect = (image_deblur_perfect * 255.).astype(np.uint8)

image_deblur_perturbed = np.clip(image_deblur_perturbed, 0., 1.)
image_deblur_perturbed = (image_deblur_perturbed * 255.).astype(np.uint8)
# Визуализация
plt.figure(figsize=(12, 10))  # 2 строки, 2 колонки

plt.subplot(2, 2, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

plt.subplot(2, 2, 2)
plt.imshow(cv2.cvtColor(blur_image, cv2.COLOR_BGR2RGB))
plt.title('Смазанное изображение')
plt.axis('off')

plt.subplot(2, 2, 3)
plt.imshow(cv2.cvtColor(image_deblur_perfect, cv2.COLOR_BGR2RGB))
plt.title('Восстановлено (точная PSF)')
plt.axis('off')

plt.subplot(2, 2, 4)
plt.imshow(cv2.cvtColor(image_deblur_perturbed, cv2.COLOR_BGR2RGB))
plt.title('Восстановлено (искажённая PSF)')
plt.axis('off')

plt.tight_layout()
plt.show()
