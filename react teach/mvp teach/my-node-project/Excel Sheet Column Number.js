/**
 * @param {string} columnTitle
 * @return {number}
 */

// мое решение
// var titleToNumber = function(columnTitle) {
//     const alphabetDictionary = {};

// // Заполняем словарь
//     for (let i = 0; i < 26; i++) {
//         const letter = String.fromCharCode(65 + i); // 65 — это код символа 'A'
//         alphabetDictionary[letter] = i + 1; // Позиция в алфавите начинается с 1
//     }
//     let res=0
//     let j=0
//     for (let i = columnTitle.length-1;  i> -1; i--) {

//         res+=(26**j)*alphabetDictionary[columnTitle[i]]
//         const element = columnTitle[i];
//         j++
//     }
//     return res
// };

// чужое решение
// var titleToNumber = function(columnTitle) {
    
//     let count = 0;
//     const A=- "A".charCodeAt(0) +1
//     for(let i=0; i < columnTitle.length; i++){
//         let currentVal = columnTitle.charCodeAt(i)+A ;
//         count = count * 26 + currentVal
//     }
//     return count;
// };

// улучшил чужое тем что вычислил коснтанту и запомнил её const A=- "A".charCodeAt(0) +1

var titleToNumber = function(columnTitle) {
    
    let count = 0;
    const A=- "A".charCodeAt(0) +1
    for(let i=0; i < columnTitle.length; i++){
        let currentVal = columnTitle.charCodeAt(i)+A ;
        count = count * 26 + currentVal
    }
    return count;
};