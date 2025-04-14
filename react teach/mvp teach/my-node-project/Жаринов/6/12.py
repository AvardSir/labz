import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
image_path = 'font.jpg'  # Укажите путь к вашему изображению
input_image = cv2.imread(image_path)

# В черно-белое переводим
gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

# Применяем оператор Кэнни с высокими порогами
threshold1 = 1000  # Первый порог
threshold2 = 222   # Второй порог
edges = cv2.Canny(gray_image, threshold1, threshold2)

# Отображаем результат
plt.figure()
plt.imshow(edges, cmap='gray')
plt.title('Оператор Кэнни с порогами 1000 и 222')
plt.axis('off')
plt.tight_layout()
plt.show()
