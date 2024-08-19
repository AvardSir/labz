import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import tkinter as tk
from tkinter import ttk

def generate_data(a, b, N, sigma):
    x_values = np.random.uniform(1, 10, N)
    y_values = a * x_values ** (-b)
    noise = np.random.normal(0, sigma, N)
    yn_values = y_values + noise
    min_positive_value = 1e-6
    yn_values = np.maximum(yn_values, min_positive_value)
    data = np.column_stack((x_values, yn_values))
    np.savetxt("experimental_data.txt", data, header="x yn", comments='', fmt="%.6f")

def perform_mnk():
    data = np.loadtxt("experimental_data.txt", skiprows=1)
    x_values = data[:, 0]
    yn_values = data[:, 1]
    
    log_x = np.log(x_values)
    log_y = np.log(yn_values)
    
    A = np.vstack([-log_x, np.ones(len(log_x))]).T
    b_est, log_a_est = np.linalg.lstsq(A, log_y, rcond=None)[0]
    
    a_est = np.exp(log_a_est)
    
    x_fit = np.linspace(min(x_values), max(x_values), 100)
    y_fit = a_est * x_fit ** (-b_est)
    
    return x_values, yn_values, x_fit, y_fit, a_est, b_est

def perform_curve_fit():
    def model_func(x, a, b):
        return a * x ** (-b)
    
    data = np.loadtxt("experimental_data.txt", skiprows=1)
    x_values = data[:, 0]
    yn_values = data[:, 1]
    
    params, _ = curve_fit(model_func, x_values, yn_values, p0=[1, 1])
    
    a_est, b_est = params
    
    x_fit = np.linspace(min(x_values), max(x_values), 100)
    y_fit = model_func(x_fit, *params)
    
    return x_values, yn_values, x_fit, y_fit, a_est, b_est

def plot_results():
    a = float(entry_a.get())
    b = float(entry_b.get())
    N = int(entry_N.get())
    sigma = float(entry_sigma.get())
    
    generate_data(a, b, N, sigma)
    
    # Метод наименьших квадратов
    x_values_mnk, yn_values_mnk, x_fit_mnk, y_fit_mnk, a_mnk, b_mnk = perform_mnk()
    
    # Метод curve_fit
    x_values_cf, yn_values_cf, x_fit_cf, y_fit_cf, a_cf, b_cf = perform_curve_fit()
    
    # Построение графиков
    plt.figure(figsize=(12, 6))
    
    plt.subplot(1, 2, 1)
    plt.scatter(x_values_mnk, yn_values_mnk, label='Экспериментальные данные')
    plt.plot(x_fit_mnk, y_fit_mnk, color='red', label=f'МНК: y = {a_mnk:.2f} * x^(-{b_mnk:.2f})', linewidth=2)
    plt.xlabel("x")
    plt.ylabel("yn")
    plt.title("Метод наименьших квадратов")
    plt.legend()
    plt.grid(True)
    
    plt.subplot(1, 2, 2)
    plt.scatter(x_values_cf, yn_values_cf, label='Экспериментальные данные')
    plt.plot(x_fit_cf, y_fit_cf, color='red', label=f'curve_fit: y = {a_cf:.2f} * x^(-{b_cf:.2f})', linewidth=2)
    plt.xlabel("x")
    plt.ylabel("yn")
    plt.title("Метод curve_fit")
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.show()

# Создание GUI для ввода исходных данных
root = tk.Tk()
root.title("Параметры генерации данных")

frame = ttk.Frame(root, padding="10")
frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

ttk.Label(frame, text="a:").grid(row=0, column=0, sticky=tk.W)
entry_a = ttk.Entry(frame, width=10)
entry_a.grid(row=0, column=1, sticky=(tk.W, tk.E))
entry_a.insert(0, "2")

ttk.Label(frame, text="b:").grid(row=1, column=0, sticky=tk.W)
entry_b = ttk.Entry(frame, width=10)
entry_b.grid(row=1, column=1, sticky=(tk.W, tk.E))
entry_b.insert(0, "1.5")

ttk.Label(frame, text="N:").grid(row=2, column=0, sticky=tk.W)
entry_N = ttk.Entry(frame, width=10)
entry_N.grid(row=2, column=1, sticky=(tk.W, tk.E))
entry_N.insert(0, "100")

ttk.Label(frame, text="sigma:").grid(row=3, column=0, sticky=tk.W)
entry_sigma = ttk.Entry(frame, width=10)
entry_sigma.grid(row=3, column=1, sticky=(tk.W, tk.E))
entry_sigma.insert(0, "0.1")

ttk.Button(frame, text="Построить графики", command=plot_results).grid(row=4, column=0, columnspan=2)

root.mainloop()
