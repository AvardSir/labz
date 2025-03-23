import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
input_image = cv2.imread('kotik.jpeg')

# Применение оператора Кэнни
edges_canny = cv2.Canny(input_image, threshold1=100, threshold2=240)

# Визуализация изображения с краями
plt.figure()
plt.imshow(edges_canny, cmap='gray')
plt.title('Оператор Кэнни')
plt.axis('off')
plt.tight_layout()
plt.show()

# Применение двумерного БПФ к изображению краев
Spectr = np.fft.fft2(edges_canny)
Spectr_shifted = np.fft.fftshift(Spectr)  # Центрируем нулевую частоту

# Вычисление амплитудного спектра
Spectr_magnitude = np.abs(Spectr_shifted)
Spectr_dB = 20 * np.log10(Spectr_magnitude + 1e-10)  # Добавляем малое значение для избежания логарифма нуля

# Визуализация амплитудного спектра
plt.figure()
plt.imshow(Spectr_dB, cmap='jet')
plt.title('Амплитудный спектр после оператора Кэнни')
plt.axis('off')
plt.tight_layout()
plt.show()
