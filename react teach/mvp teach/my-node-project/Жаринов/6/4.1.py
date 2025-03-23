import cv2
import numpy as np
import matplotlib.pyplot as plt

# Чтение изображения
input_image = cv2.imread('kotik.jpeg')


edges_canny = cv2.Canny(input_image, threshold1=100, threshold2=240)

plt.figure()
# edges_canny = 255 - edges_canny 
plt.imshow(edges_canny, cmap='gray') 
plt.title('Оператор Кэнни') 
plt.axis('off') 
plt.tight_layout() 
plt.show() 