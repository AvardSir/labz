import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
input_image = cv2.imread('cat4.jpg')

# В черно-белое переводим, ибо нам только края
L = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

# Визуализация исходного изображения
plt.figure()
plt.imshow(cv2.cvtColor(input_image, cv2.COLOR_BGR2RGB))
plt.title('Исходное изображение')
plt.axis('off')
plt.tight_layout()
plt.show()

# Двумерное центрированное БПФ
Spectr = np.fft.fftshift(np.fft.fft2(L))

# Компоненты нормировки
Min_S = np.min(np.abs(Spectr))
eps = Min_S if Min_S != 0 else np.max(np.abs(Spectr)) * 1e-9

# Фильтр высоких частот (ФВЧ) с прямоугольной маской
M, N = L.shape[0], L.shape[1] # размеры изображения 
# размер области НЧ в спектре: 
d_high = round(0.20*np.minimum(M, N)) 
K=4 # порядок фильтра 
deg = 2*K 
mask_high = np.zeros((M, N)) 
Cm, Cn = M/2,N/2 # координаты центра маски 
# формируем массив mask_high_b: 
for m in range(M): 
    for n in range(N): 
        d = np.sqrt((m - Cm)**2 + (n - Cn)**2) 
        mask_high[m,n] = (d/d_high)**K / np.sqrt(1+(d/d_high)**deg) 
# Применяем маску к спектру
Spectr_high_pass_filtered = Spectr * mask_high

# Вычисляем обратное двумерное БПФ
high_pass_filtered = np.fft.ifft2(np.fft.ifftshift(Spectr_high_pass_filtered))

# Проконтролируем правильность работы Фурье-фильтра
print(np.max(np.abs(np.imag(high_pass_filtered))) / np.max(np.abs(np.real(high_pass_filtered))))

# Берем модуль, ибо яркость не может быть отрицательной
high_pass_filtered = np.abs(high_pass_filtered.real)

# Нормировка на максимальный размах
edges_high_pass = cv2.normalize(high_pass_filtered, None, 0.0, 1.0, cv2.NORM_MINMAX)
edges_high_pass = 1 - edges_high_pass  # Инвертировали
threshold_value = 0.75 # порог надо подобрать! от 0. до 1. 
thr, edges_high_pass = cv2.threshold(edges_high_pass, 
threshold_value, 1.0, cv2.THRESH_BINARY) 
# Смотрим изображение на выходе
plt.figure()
plt.imshow(edges_high_pass, cmap='gray')
plt.title('Фильтр высоких частот')
plt.axis('off')
plt.tight_layout()
plt.show()

# Выведем амплитудный спектр после применения маски
Spectr_dB = 20 * np.log10(np.abs(Spectr_high_pass_filtered) + eps)

# Чуть-чуть схитрим, чтобы сохранить цветовую гамму
Spectr_dB[0, 0] = 20 * np.log10(np.max(np.abs(Spectr)))  # Это уже ни на что не влияет

plt.figure()
plt.imshow(Spectr_dB, cmap='jet')
plt.title('Амплитудный спектр после ФВЧ (дБ)')
plt.axis('off')
plt.tight_layout()
plt.show()

# Запишем с правильной нормировкой – яркости от 0 до 255
cv2.imwrite('edges_high_pass.jpg', 
            cv2.normalize((edges_high_pass * 255).astype('uint8'), 
                          None, 0, 255, cv2.NORM_MINMAX))


edges_canny = cv2.Canny(input_image, 
threshold1 = 0.5, threshold2 = 0.75) 
plt.figure()
edges_canny = 255 - edges_canny 
plt.imshow(edges_canny, cmap='gray') 
plt.title('Оператор Кэнни') 
plt.axis('off') 
plt.tight_layout() 
plt.show() 