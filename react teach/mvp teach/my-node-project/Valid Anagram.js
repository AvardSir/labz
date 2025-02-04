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


var isAnagram = function(s, t) {
    if (s.length !== t.length) {
        return false;
    }

    const counter = new Map();

    for (let char of s) {
        counter.set(char, (counter.get(char) || 0) + 1);
    }

    for (let char of t) {
        if (!counter.has(char) || counter.get(char) === 0) {
            return false;
        }
        counter.set(char, counter.get(char) - 1);
    }

    return true;    
};