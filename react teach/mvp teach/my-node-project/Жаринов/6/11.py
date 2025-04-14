import cv2
import numpy as np
import matplotlib.pyplot as plt

# Изменяемые параметры
image_path = 'font.jpg'  # Путь к изображению
threshold1 = 500           # Первый порог для оператора Кэнни
threshold2 = 555         # Второй порог для оператора Кэнни

# Чтение изображения
input_image = cv2.imread(image_path)

# В черно-белое переводим, ибо нам только края
gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

# Применяем фильтр Кэнни
edges_canny = cv2.Canny(gray_image, threshold1=threshold1, threshold2=threshold2)

# Инвертируем цвета: черные края на белом фоне
edges_canny_inverted = cv2.bitwise_not(edges_canny)

# Смотрим результат фильтра Кэнни на белом фоне
plt.figure()
plt.imshow(edges_canny_inverted, cmap='gray')
plt.title('Оператор Кэнни ')
plt.axis('off')
plt.tight_layout()
plt.show()

# Запишем результат фильтра Кэнни с инвертированными цветами
cv2.imwrite('edges_canny_inverted.jpg', edges_canny_inverted)

print("Изображение с инвертированными цветами сохранено как 'edges_canny_inverted.jpg'")

# Применяем быстрое преобразование Фурье
f = np.fft.fft2(edges_canny)
fshift = np.fft.fftshift(f)  # Сдвигаем нулевую частоту в центр

# Вычисляем амплитудный спектр в децибелах
eps = 1e-10  # Маленькое значение для избежания логарифма нуля
Spectr_dB = 20 * np.log10(np.abs(fshift) + eps)

# Чуть-чуть схитрим, чтобы сохранить цветовую гамму
Spectr_dB[0, 0] = 20 * np.log10(np.max(np.abs(fshift)))  # Это уже ни на что не влияет

# Отображаем амплитудный спектр с цветовой картой jet
plt.figure()
plt.imshow(Spectr_dB, cmap='jet')
plt.title('Амплитудный спектр (дБ)')
plt.axis('off')
plt.tight_layout()
plt.show()
