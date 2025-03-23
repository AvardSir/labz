import numpy as np
import matplotlib.pyplot as plt
from skimage import io, color, exposure
from skimage.color import rgb2lab, lab2rgb

# Путь к изображению
image_path = 'котик.jpg'

# Считываем изображение
image = io.imread(image_path)

# Преобразуем в пространство LAB
LAB_image = rgb2lab(image)
max_value = np.max(LAB_image)
# Выделяем матрицу яркости
L = LAB_image[:, :, 0] / 100

# Отображаем оригинальное изображение
plt.imshow(image)
plt.axis('off')
plt.show()

# -----------------------------------------------------
# Применяем метод .rescale_intensity
low, high = np.min(L), np.max(L)
bottom, top = 0, 1
L_out = exposure.equalize_adapthist(L, 
kernel_size=(16, 16), 
clip_limit=0.01, 
nbins=256)
# -----------------------------------------------------

# Применяем гамма-коррекцию
L_out_gam = exposure.adjust_gamma(L_out, gamma=1)

# Заменяем матрицу яркости
LAB_image[:, :, 0] = L_out_gam * 100

# Возвращаем цвет в изображение
image_out = lab2rgb(LAB_image)

# Отображаем изображение после обработки
plt.imshow(image_out)
plt.axis('off')
plt.show()

# Рассчитываем данные гистограммы
histogram, bin_edges = np.histogram(L_out, bins=256, range=(0, 1))

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

# Сохраняем обработанное изображение в файл
image_out = (255 * image_out).astype(np.uint8)  # Приведение к типу uint8
io.imsave('output_image.jpg', image_out, quality=92)
