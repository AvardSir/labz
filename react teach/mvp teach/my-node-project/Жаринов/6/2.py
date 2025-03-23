import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
input_image = cv2.imread('chess.jpg')

# Неприятная такая вещь в cv2 - не RGB, а BGR-формат
LAB_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2LAB)

# Это мы перевели в LAB
L = LAB_image[:, :, 0] / 100  # Выделяем матрицу яркости

# Визуализация исходного изображения
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')
plt.tight_layout()
plt.show()

# Двумерное преобразование Фурье и амплитудный спектр
Spectr = np.fft.fftshift(np.fft.fft2(L))
eps = np.max(np.abs(Spectr)) * 1e-9
Spectr_dB = 20 * np.log10(np.abs(Spectr) + eps)

# Визуализация амплитудного спектра
plt.imshow(Spectr_dB, cmap='jet')
plt.title('Амплитудный спектр (дБ)')
plt.axis('off')
plt.tight_layout()
plt.show()
