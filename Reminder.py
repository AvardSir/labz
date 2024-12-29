import tkinter as tk
import random

def close_window():
    root.destroy()

def create_circle(canvas, x, y, size, color):
    """Создает круг на холсте."""
    return canvas.create_oval(
        x - size, y - size, x + size, y + size, fill=color, outline=color
    )

def create_line(canvas, x1, y1, x2, y2, color):
    """Создает линию на холсте."""
    return canvas.create_line(x1, y1, x2, y2, fill=color, width=2)

def animate_circles(canvas, circles, max_size):
    """Плавная анимация растущих кругов."""
    for circle in circles:
        current_size = canvas.coords(circle)
        x_center = (current_size[0] + current_size[2]) / 2
        y_center = (current_size[1] + current_size[3]) / 2
        size = (current_size[2] - current_size[0]) / 2 + 1.5

        if size > max_size:  # Удаляем круги, которые слишком большие
            canvas.delete(circle)
            circles.remove(circle)
        else:
            canvas.coords(circle, x_center - size, y_center - size, x_center + size, y_center + size)

    if len(circles) < 10:  # Максимум 10 кругов
        if random.random() < 0.3:  # Вероятность 30% для появления нового круга
            canvas_width = canvas.winfo_width()
            canvas_height = canvas.winfo_height()
            
            # Убедимся, что размеры канваса достаточно большие
            if canvas_width > 50 and canvas_height > 50:
                x = random.randint(50, canvas_width - 50)
                y = random.randint(50, canvas_height - 50)
            else:
                x = random.randint(0, canvas_width)
                y = random.randint(0, canvas_height)

            color = random.choice(["#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2"])
            circles.append(create_circle(canvas, x, y, 5, color))  # Новый круг с маленьким размером


def animate_lines(canvas, lines):
    """Анимация движущихся линий."""
    for line in lines:
        coords = canvas.coords(line)
        # Двигаем линию вправо
        canvas.coords(line, coords[0] + 2, coords[1], coords[2] + 2, coords[3])

        if coords[0] > canvas.winfo_width():  # Удаляем линию, если она вышла за экран
            canvas.delete(line)
            lines.remove(line)

    if len(lines) < 100:  # Максимум 5 линий
        if random.random() < 0.3:  # Вероятность 30% для появления новой линии
            # Убедимся, что диапазоны корректны
            canvas_height = canvas.winfo_height()
            y1 = random.randint(50, max(canvas_height - 50, 50))  # Проверка на корректность диапазона
            y2 = random.randint(50, max(canvas_height - 50, 50))
            if y1 != y2:  # Убедимся, что линии не создаются с одинаковыми координатами
                color = random.choice(["#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2"])
                lines.append(create_line(canvas, 0, y1, 50, y2, color))  # Новая линия


def animate_particles(canvas, particles):
    """Анимация падающих частиц."""
    for particle in particles:
        current_size = canvas.coords(particle)
        x = (current_size[0] + current_size[2]) / 2
        y = current_size[3] + 1  # Падает вниз

        if y > canvas.winfo_height():  # Удаляем частицы, если они ушли за пределы
            canvas.delete(particle)
            particles.remove(particle)
        else:
            canvas.coords(particle, x - 2, y - 2, x + 2, y + 2)

    if len(particles) < 30:  # Максимум 30 частиц
        if random.random() < 0.1:  # Вероятность 10% для появления новой частицы
            x = random.randint(50, canvas.winfo_width() - 50)
            y = 0
            color = random.choice(["#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2"])
            particles.append(create_circle(canvas, x, y, 2, color))  # Новая частица

def choose_animation():
    """Выбирает случайную анимацию."""
    return random.choice([animate_circles, animate_lines, animate_particles])

# Создаем окно
root = tk.Tk()
root.title("Напоминание")

# Устанавливаем размер и положение окна
window_width = 500  # Увеличиваем размер окна
window_height = 400
root.geometry(f"{window_width}x{window_height}+500+300")
root.resizable(False, False)

# Создаем холст
canvas = tk.Canvas(root, width=window_width, height=window_height, bg="black")
canvas.pack(fill="both", expand=True)

# Добавляем текст с чекбоксами
label1 = tk.Label(root, text="Поставь таймер на 1ну минуту", font=("Arial", 10), fg="white", bg="black")
label1.place(relx=0.35, rely=0.1, anchor="n")
check1 = tk.Checkbutton(root, bg="black", fg="white", selectcolor="gray")
check1.place(relx=0.65, rely=0.1, anchor="n")

label2 = tk.Label(root, text="выбери маленькую задачу из списка", font=("Arial", 10), fg="white", bg="black")
label2.place(relx=0.35, rely=0.2, anchor="n")
check2 = tk.Checkbutton(root, bg="black", fg="white", selectcolor="gray")
check2.place(relx=0.65, rely=0.2, anchor="n")

label3 = tk.Label(root, text="начни", font=("Arial", 10), fg="white", bg="black")
label3.place(relx=0.35, rely=0.3, anchor="n")
check3 = tk.Checkbutton(root, bg="black", fg="white", selectcolor="gray")
check3.place(relx=0.65, rely=0.3, anchor="n")

# Кнопка для закрытия
button = tk.Button(root, text="ОК", command=close_window, font=("Arial", 12), bg="white", fg="black")
button.place(relx=0.5, rely=0.8, anchor="center")

# Запуск анимаций
circles = []
lines = []
particles = []

# Выбираем случайную анимацию
selected_animation = choose_animation()

# Функция для обновления выбранной анимации
def update_animations():
    if selected_animation == animate_circles:
        selected_animation(canvas, circles, max_size=50)  # Добавляем max_size для анимации кругов
    elif selected_animation == animate_lines:
        selected_animation(canvas, lines)
    elif selected_animation == animate_particles:
        selected_animation(canvas, particles)
    
    canvas.after(20, update_animations)  # Обновление анимаций каждые 20 миллисекунд


update_animations()

# Запуск приложения
root.mainloop()
