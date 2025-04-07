import cv2
import numpy as np
import matplotlib.pyplot as plt

# Функция, создающая смаз:
# size - размер размаза в пикселях,
# angle - направление смаза, в градусах
def blur_mask(size, angle):
    k = np.zeros((size, size), dtype=np.float32)
    k[(size - 1) // 2, :] = np.ones(size, dtype=np.float32)
    
    k = cv2.warpAffine(
        k,
        cv2.getRotationMatrix2D((size / 2 - 0.5, size / 2 - 0.5), angle, 1.0),
        (size, size)
    )
    
    k = k / np.sum(k)  # Нормировка, сумма значений должна быть равна 1
    return k

# Чтение входного изображения
input_image = cv2.imread('car.jpg')

# Задаем искажающую маску в виде матрицы:
PSF_blur = blur_mask(size=6, angle=30)
print(PSF_blur)  # Посмотрим на искажающую маску

# Размазываем изображение, используя пространственную фильтрацию:
blur_image = cv2.filter2D(input_image, -1, PSF_blur)

# Визуализация
plt.figure(figsize=(12, 6))

# Исходное изображение
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

# Искажающая маска
plt.subplot(1, 3, 2)
plt.imshow(PSF_blur, cmap='gray')
plt.title('Искажающая маска')
plt.axis('off')

# Размазанное изображение
plt.subplot(1, 3, 3)
plt.imshow(cv2.cvtColor(blur_image, cv2.COLOR_BGR2RGB))
plt.title('Размазанное изображение')
plt.axis('off')

plt.tight_layout()
plt.show()
