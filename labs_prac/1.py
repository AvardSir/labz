import numpy as np

A = np.array([[0.3, 2.5, -2.5], [2.4, 7.5, 4.1], [-1.1, 1.2, 4.9]])
B = np.array([0.1, 7.3, 5.5])

solution = np.linalg.solve(A, B)

print("Решение системы уравнений:", solution)
