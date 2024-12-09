
import numpy as np

def compute_sum(x):
    k_values = np.arange(1, 21)
    sum_result = np.sum(np.exp(k_values) / x**k_values)
    return sum_result
