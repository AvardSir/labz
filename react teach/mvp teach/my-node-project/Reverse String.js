/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
// мое решение
// var reverseString = function(s) {
//     len=s.length
//     len_mid=Math.floor(len/2)
//     len--
//     for (let i = 0; i < len_mid; i++) {
//         [s[i],s[len-i]]=[s[len-i],s[i]]
//         // const element = s[i];
//         // console.log(s[i])
        
//     }
//     return s
// };

// чужое но время+- тоже хотя памяти использует больше
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    let left = 0
    let right = s.length - 1

    while(left < right){
        let temp = s[left]
        s[left] = s[right]
        s[right] = temp

        left++
        right--
    }
};