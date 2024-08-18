import numpy as np

a = 2
b = 1.5
N = 100
sigma = 0.1

x_values = np.random.uniform(1, 10, N)

y_values = a * x_values ** (-b)
noise = np.random.normal(0, sigma, N)
yn_values = y_values + noise

data = np.column_stack((x_values, yn_values))
np.savetxt("experimental_data.txt", data, header="x yn", comments='', fmt="%.6f")
