/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
// мое решение бьт 7 процентов
// var isAnagram = function(s, t) {
//     if (s.length!=t.length) {
//         return false
//     }
//     s= s.split('').sort()
//     t= t.split('').sort()
//     for (let i = 0; i < s.length; i++) {
//         if (s[i]!=t[i]){
//             return false
//         }
//         // const element = array[i];
        
//     }
//     return true 
// };

// чужое решение через словарь Map()

// var isAnagram = function(s, t) {
//     if (s.length !== t.length) {
//         return false;
//     }

//     const counter = new Map();

//     for (let char of s) {
//         counter.set(char, (counter.get(char) || 0) + 1);
//     }

//     for (let char of t) {
//         if (!counter.has(char) || counter.get(char) === 0) {
//             return false;
//         }
//         counter.set(char, counter.get(char) - 1);
//     }

//     return true;    
// };

var isAnagram = function(s, t) {
    if (s.length !== t.length) {
        return false;
    }

    const count = Array(26).fill(0);
// вот тут обяснение обсидиан 
    for (let char of s) {
        count[char.charCodeAt(0) - 'a'.charCodeAt(0)] += 1;
    }
// выше короч. мы берем мы под индексом для буквы индексом 0 это а делаем +1 для z будет индекс 26
// короч как словарь но круче тк индексы+не use dict

// ниже проверка, если у iй буквы 0 значит нету в первой строке return false
    for (let char of t) {
        if (count[char.charCodeAt(0) - 'a'.charCodeAt(0)] === 0) {
            return false;
        }
        count[char.charCodeAt(0) - 'a'.charCodeAt(0)] -= 1;
    }

    return true;    
};