/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
    // Создаем массив из 26 элементов, каждый элемент - массив [0, -1]
    let arr = Array.from({ length: 26 }, () => [0, -1]);

    const a = 'a'.charCodeAt(0); // Получаем код символа 'a'

    // Заполняем массив
    for (let i = 0; i < s.length; i++) {
        let charCode = s[i].charCodeAt(0) - a; // Получаем индекс символа

        // Увеличиваем счетчик вхождений
        arr[charCode][0] += 1; // Увеличиваем количество вхождений
        if (arr[charCode][1] === -1) {
            arr[charCode][1] = i; // Запоминаем индекс первого вхождения
        }
    }

    // Находим первый уникальный символ
    let firstUniqueIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === 1) { // Если количество вхождений равно 1
            if (firstUniqueIndex === -1 || arr[i][1] < firstUniqueIndex) {
                firstUniqueIndфex = arr[i][1]; // Обновляем индекс первого уникального символа
            }
        }
    }

    return firstUniqueIndex; // Возвращаем индекс первого уникального символа или -1
};

// // Примеры использования
// console.log(firstUniqChar("leetcode")); // Вывод: 0 (первый уникальный символ 'l')
// console.log(firstUniqChar("loveleetcode")); // Вывод: 2 (первый уникальный символ 'v')
// console.log(firstUniqChar("aabb")); // Вывод: -1 (нет уникальных символов)
// console.log(firstUniqChar("")); // Вывод: -1 (пустая строка)
// console.log(firstUniqChar("abcabc")); // Вывод: -1 (нет уникальных символов)
// console.log(firstUniqChar("abacabad")); // Вывод: 1 (первый уникальный символ 'b')
