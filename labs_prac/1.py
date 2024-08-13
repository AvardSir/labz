import numpy as np

A = np.array([[0.3, 2.5, -2.5], [2.4, 7.5, 4.1], [-1.1, 1.2, 4.9]])
B = np.array([0.1, 7.3, 5.5])

np.savetxt('matr.txt', A)
np.savetxt('rside.txt', B)

A = np.loadtxt('matr.txt')
B = np.loadtxt('rside.txt')

solution = np.linalg.solve(A, B)

np.savetxt('sol.txt', solution)

print("Решение системы уравнений сохранено в файл sol.txt.: ", solution)