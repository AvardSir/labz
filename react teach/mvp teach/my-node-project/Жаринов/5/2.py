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

# Применяем гамма-коррекцию
L_out_gam = exposure.adjust_gamma(L, gamma=1)

# Применяем логарифмическую коррекцию
G = 2 
F = True  
L_out_log = exposure.adjust_log(L_out_gam, gain=G, inv=F)

# Заменяем матрицу яркости
LAB_image[:, :, 0] = L_out_log * 100

# Возвращаем цвет в изображение
image_out = lab2rgb(LAB_image)

# Отображаем изображение после обработки
plt.imshow(image_out)
plt.axis('off')
plt.show()

# Рассчитываем данные гистограммы
histogram, bin_edges = np.histogram(L_out_log, bins=256, range=(0, 1))

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
