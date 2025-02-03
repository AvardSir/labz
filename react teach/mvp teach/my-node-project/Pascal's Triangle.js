/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    // Проверка на положительное целое число
    
    let base_case = [1];
    let copy_base_case = [1];
    let answer = [];

    answer.push(base_case);
    for (let i = 1; i < numRows; i++) { // Изменено на numRows
        copy_base_case.push(0);
        copy_base_case.unshift(0);
        let temp = [];
        for (let j = 0; j < copy_base_case.length - 1; j++) {
            temp.push(copy_base_case[j] + copy_base_case[j + 1]);
        }
        answer.push(temp);
        copy_base_case = JSON.parse(JSON.stringify(temp));

        // copy_base_case = temp;
    }
    return answer;
};

// Пример использования
const numRows = 5;
const result = generate(numRows);
console.log(`Паскаль треугольник с ${numRows} строками:`);
console.log(result);
