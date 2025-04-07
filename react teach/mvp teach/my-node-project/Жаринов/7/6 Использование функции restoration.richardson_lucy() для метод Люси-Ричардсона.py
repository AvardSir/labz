import cv2
from skimage import restoration
import numpy as np
import matplotlib.pyplot as plt

# Функция, создающая смаз:
# size - размер размаза в пикселях,
# angle - направление смаза, в градусах
def blur_mask(size, angle):
    k = np.zeros((size, size), dtype=np.float32)
    k[(size - 1) // 2, :] = np.ones(size, dtype=np.float32)
    k = cv2.warpAffine(k,
                       cv2.getRotationMatrix2D((size / 2 - 0.5, size / 2 - 0.5), angle, 1.0),
                       (size, size))
    k = k / np.sum(k)  # Нормировка
    return k

input_image = cv2.imread('belkf.png')
# Нормировка данных изображения и перевод во float:
input_image = input_image.astype(np.float32) / 255.
# Задаем искажающую маску в виде матрицы:
PSF_blur = blur_mask(size=9, angle=35)
print(PSF_blur)  # Посмотрим на искажающую маску
# И размажем ею изображение:
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Двумерная инверсная винеровская фильтрация
noise_var = 0.01  # Подбор уровня шума
image_deblur = input_image.copy()
# Обработка по трем цветовым каналам раздельно:
# ---------------------------------------------------------
its = 6 # количество итераций 
image_deblur[:,:,0] = restoration.richardson_lucy(blur_image[:,:,0], 
PSF_blur, num_iter=its) 
image_deblur[:,:,1] = restoration.richardson_lucy(blur_image[:,:,1], 
PSF_blur, num_iter=its) 
image_deblur[:,:,2] = restoration.richardson_lucy(blur_image[:,:,2], 
PSF_blur, num_iter=its) 
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
