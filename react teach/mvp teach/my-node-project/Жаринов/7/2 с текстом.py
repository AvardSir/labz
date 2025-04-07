import cv2 
import numpy as np 
import matplotlib.pyplot as plt 

# Чтение входного изображения
input_image = cv2.imread('text1.jpg') 

# Преобразование изображения в цветовое пространство LAB
LAB_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2LAB) 

# Выделение матрицы яркости
L = LAB_image[:, :, 0] / 100 

# Задаем маску в виде матрицы
c = 0.60  # Основной параметр, который нужно подобрать
PSF = np.array([
    [-c,  -c,   -c], 
    [-c, 1 + 8 * c, -c], 
    [-c,  -c,   -c]
]) 

# Фильтрация с использованием заданной маски
L_out = cv2.filter2D(L, -1, PSF) 

# Собираем изображение - яркость изменена, цвет не тронут
# Убираем отрицательные всплески, иначе будут искажения
L_max = np.max(L_out)  # Нужно, чтобы положительные всплески оставить
L_out = np.clip(L_out, a_min=0., a_max=L_max)  # "Обрезаем"

# Заменяем матрицу яркости
LAB_image[:, :, 0] = L_out * 100 

# Преобразование изображения обратно в цветовое пространство BGR
image_out = cv2.cvtColor(LAB_image, cv2.COLOR_LAB2BGR)

# Вывод измененного изображения
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.title('Исходное изображение')
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.subplot(1, 2, 2)
plt.title('Измененное изображение')
plt.imshow(cv2.cvtColor(image_out, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.show()

# Вычислим маску Фурье-фильтра по PSF: 
PSF_padded = np.zeros_like(L) # из нулей, по размеру изобр. 
PSF_padded[0:3,0:3] = PSF # вставили туда маску пр. фильтра 
W = np.fft.fftshift(np.fft.fft2(PSF_padded)) # БПФ 
W_dB = 20 * np.log10(np.abs(W)) # в дБ 
plt.figure() 
plt.imshow(W_dB, cmap='jet') 
plt.colorbar(fraction=0.031, pad=0.04) 
plt.title('Вычисление частотной маски фильтра') 
plt.axis('off') 
plt.tight_layout() 
plt.show()
