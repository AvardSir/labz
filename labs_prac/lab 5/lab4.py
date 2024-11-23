import numpy as np

# Матрица расстояний
distances = np.array(
    [
[np.inf,10,15,20],
[5,np.inf,35,25],
[15,30,np.inf,10],
[20,25,30,np.inf]]

)
print(10+35+10+20)
# Функция для вычисления нижней границы
def lower_bound(matrix):
    row_reduction = sum(np.min(matrix, axis=1))
    col_reduction = sum(np.min(matrix, axis=0))
    return row_reduction + col_reduction

# Функция для метода ветвей и границ
def branch_and_bound(matrix):
    n = matrix.shape[0]
    
    best_cost = float('inf')
    best_path = []

    # Массив, чтобы отслеживать посещенные города
    visited = [False] * n
    
    # Функция для рекурсивного поиска с ветвлением
    def search(path, cost):
        nonlocal best_cost, best_path
        
        # Если путь завершен, проверим его стоимость
        if len(path) == n:
            total_cost = cost + matrix[path[-1], path[0]]  # Вернуться в начальную точку
            if total_cost < best_cost:
                best_cost = total_cost
                best_path = path + [path[0]]
            return
        
        # Ищем наименьшую стоимость для следующего шага
        for i in range(n):
            if not visited[i]:  # Если город еще не был посещен
                # Помечаем город как посещенный
                visited[i] = True
                # Рекурсивно вызываем функцию поиска для следующего города
                search(path + [i], cost + matrix[path[-1], i])
                # Отмечаем город как непосещенный после возврата из рекурсии
                visited[i] = False
    
    # Начинаем поиск с города 0
    visited[0] = True
    search([0], 0)
    
    return best_path, best_cost

# Запуск алгоритма
best_path, best_cost = branch_and_bound(distances)
for i in range(len(best_path)):
    best_path[i] += 1
print("Лучший путь:", best_path)
print("Минимальная стоимость пути:", best_cost)
