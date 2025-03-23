import numpy as np
import matplotlib.pyplot as plt
from skimage import io, color

# Путь к изображению
image_path = 'котик.jpg'

# Считываем изображение
image = io.imread(image_path)

# Преобразуем в градации серого
gray_image = color.rgb2gray(image)

# Отображаем изображение
plt.imshow(gray_image, cmap='gray')
plt.axis('off')  # Отключаем оси
plt.show()

# Рассчитываем данные гистограммы
histogram, bin_edges = np.histogram(gray_image, bins=256, range=(0, 1))

# Выводим график гистограммы
fig, ax = plt.subplots(figsize=(5, 4))
plt.ticklabel_format(axis='y', style='sci', scilimits=(4, 4))
ax.set_xlim(0, 1)
ax.grid(True)
ax.set_title("Grayscale Histogram")
ax.set_xlabel("Grayscale Value")
ax.set_ylabel("Pixel Count")
ax.bar(bin_edges[0:-1], histogram, width=1/128)
plt.show()
