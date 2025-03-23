import numpy as np
import matplotlib.pyplot as plt
from skimage import io, color, exposure

# Путь к изображению
image_path = 'котик.jpg'

# Считываем изображение
image = io.imread(image_path)

# Преобразуем в градации серого
gray_image = color.rgb2gray(image)

# Применяем метод .rescale_intensity
low, high = np.min(gray_image), np.max(gray_image)  # Определяем минимальные и максимальные значения
bottom, top = 0, 1  # Устанавливаем диапазон для выходных значений
gray_image_out = exposure.rescale_intensity(gray_image, in_range=(low, high), out_range=(bottom, top)).astype(np.float32)

# Отображаем изображение
plt.imshow(gray_image_out, cmap='gray')
plt.axis('off')  # Отключаем оси
plt.show()

# Рассчитываем данные гистограммы
histogram, bin_edges = np.histogram(gray_image_out, bins=256, range=(0, 1))

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
