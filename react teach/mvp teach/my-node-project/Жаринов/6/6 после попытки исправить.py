import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
input_image = cv2.imread('text3.jpg')

# В черно-белое переводим, ибо нам только края
L = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

# Двумерное центрированное БПФ
Spectr = np.fft.fftshift(np.fft.fft2(L))

# Компоненты нормировки
Min_S = np.min(np.abs(Spectr))
eps = Min_S if Min_S != 0 else np.max(np.abs(Spectr)) * 1e-9

# Фильтр высоких частот (ФВЧ) с прямоугольной маской
M, N = L.shape[0], L.shape[1]  # Размеры изображения
size = 0.5
d_high = round(size * np.minimum(M, N))  # Размер области НЧ в спектре

# Определяем граничные индексы, исходя из требований симметрии
if M % 2 == 0:
    m_dn, m_up = M // 2 - d_high, M // 2 + d_high
else:
    m_dn, m_up = M // 2 - d_high, M // 2 + d_high + 1

if N % 2 == 0:
    n_dn, n_up = N // 2 - d_high, N // 2 + d_high
else:
    n_dn, n_up = N // 2 - d_high, N // 2 + d_high + 1

# Частотная маска пространственного фильтра
mask_high = np.ones_like(L)
mask_high[m_dn:m_up, n_dn:n_up] = 0  # Занулили область у центра

# Применяем маску к спектру
Spectr_high_pass_filtered = Spectr * mask_high

# Вычисляем обратное двумерное БПФ
high_pass_filtered = np.fft.ifft2(np.fft.ifftshift(Spectr_high_pass_filtered))

# Берем модуль, ибо яркость не может быть отрицательной
high_pass_filtered = np.abs(high_pass_filtered.real)

# Нормировка на максимальный размах
edges_high_pass = cv2.normalize(high_pass_filtered, None, 0.0, 1.0, cv2.NORM_MINMAX)
edges_high_pass = 1 - edges_high_pass  # Инвертировали

# Выведем амплитудный спектр после применения маски
Spectr_dB = 20 * np.log10(np.abs(Spectr_high_pass_filtered) + eps)

# Чуть-чуть схитрим, чтобы сохранить цветовую гамму
Spectr_dB[0, 0] = 20 * np.log10(np.max(np.abs(Spectr)))  # Это уже ни на что не влияет

# Объединяем графики в один
plt.figure(figsize=(15, 5))

# Исходное изображение
plt.subplot(1, 3, 1)
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')

# Фильтр высоких частот
plt.subplot(1, 3, 2)
plt.imshow(edges_high_pass, cmap='gray')
plt.title('Фильтр высоких частот')
plt.axis('off')

# Амплитудный спектр
plt.subplot(1, 3, 3)
plt.imshow(Spectr_dB, cmap='jet')
plt.title('Амплитудный спектр после ФВЧ (дБ)')
plt.axis('off')

plt.tight_layout()
plt.show()

# Запишем с правильной нормировкой – яркости от 0 до 255
cv2.imwrite('edges_high_pass.jpg', 
            cv2.normalize((edges_high_pass * 255).astype('uint8'), 
                          None, 0, 255, cv2.NORM_MINMAX))
