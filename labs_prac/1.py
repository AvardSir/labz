import tkinter as tk
from tkinter import messagebox
from tkinter import filedialog

class IfThenApp:
    def __init__(self, root):
        self.root = root
        self.root.title("If-Then Generator")

        self.entries = []  # Массив для хранения "Если-То" пар

        self.previous_if_text = ""  # Для хранения предыдущего значения "Если"

        # Левое текстовое поле (если)
        self.if_label = tk.Label(root, text="Левая часть (Если):")
        self.if_label.grid(row=0, column=0, padx=10, pady=10)

        self.if_entry = tk.Entry(root, width=50)
        self.if_entry.grid(row=1, column=0, padx=10, pady=10)

        # Правое текстовое поле (то)
        self.then_label = tk.Label(root, text="Правая часть (То):")
        self.then_label.grid(row=0, column=1, padx=10, pady=10)

        self.then_entry = tk.Entry(root, width=50)
        self.then_entry.grid(row=1, column=1, padx=10, pady=10)

        # Кнопка "Далее"
        self.add_button = tk.Button(root, text="Далее", command=self.add_entry)
        self.add_button.grid(row=2, column=0, columnspan=2, pady=10)

        # Кнопка "Завершить и сохранить"
        self.save_button = tk.Button(root, text="Завершить и сохранить", command=self.save_entries)
        self.save_button.grid(row=3, column=0, columnspan=2, pady=10)

    def add_entry(self):
        if_text = "Если " + self.if_entry.get().strip()
        then_text = "То " + self.then_entry.get().strip()

        if if_text != "Если " and then_text != "То ":
            self.entries.append((if_text, then_text))
            self.previous_if_text = self.if_entry.get()  # Сохраняем предыдущее значение
            self.then_entry.delete(0, tk.END)  # Очищаем только правое поле
        else:
            messagebox.showwarning("Ошибка", "Пожалуйста, заполните оба поля.")

    def save_entries(self):
        if self.entries:
            self.entries.sort(key=lambda x: x[0])

            file_path = filedialog.asksaveasfilename(defaultextension=".txt", 
                                                     filetypes=[("Text files", "*.txt"), ("All files", "*.*")])

            if file_path:
                with open(file_path, "w", encoding="utf-8") as f:
                    for if_part, then_part in self.entries:
                        f.write(f"{if_part} -> {then_part}\n")

                messagebox.showinfo("Успех", "Файл успешно сохранен.")
            else:
                messagebox.showwarning("Ошибка", "Файл не был сохранен.")
        else:
            messagebox.showwarning("Ошибка", "Нет данных для сохранения.")

if __name__ == "__main__":
    root = tk.Tk()
    app = IfThenApp(root)
    root.mainloop()
fff
fkfff