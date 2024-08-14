import numpy as np

v1 = np.array([6, 2, 7, -2], dtype=float)
v2 = np.array([-4, 3, -4, 1], dtype=float)

product = v1 * v2
print("Перемноженные векторы:", product)

squared_v1 = v1 ** 2
print("v1 возведенный в квадрат:", squared_v1)

v1_power_v2 = v1 ** v2
print("v1 возведенный в степени, указанные в v2:", v1_power_v2)

division_v1_by_v2 = v1 / v2
division_v2_by_v1 = v2 / v1
print("v1 разделенный на v2:", division_v1_by_v2)
print("v2 разделенный на v1:", division_v2_by_v1)

v = np.array([7, 2, 5, 4])
add_7_5 = v + 7.5
subtract_7_5 = v - 7.5
multiply_by_2 = v * 2
divide_by_2 = v / 2

print('v :',v)
print("v + 7.5:", add_7_5)
print("v - 7.5:", subtract_7_5)
print("v * 2:", multiply_by_2)
print("v / 2:", divide_by_2)
