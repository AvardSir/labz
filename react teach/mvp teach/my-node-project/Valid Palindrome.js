/**
 * @param {string} s
 * @return {boolean}
 */
// мое решение
// var isPalindrome = function(s) {
//     console.log(s)
//     s=s.toLowerCase()
//     s=s.match(/[a-z0-9]/g);
//     if (!s){return true}
//     console.log(s)
//     // s = s.match(/[a-zA-Z]/g);
//     let len=s.length
//     const mid_len=Math.floor(len/2)
//     len--
//     for (let i = 0; i < mid_len; i++) {
//         if (s[i]!=s[len-i]){
//             console.log(s[i], '   ',s[len-i])
//             return false
//         }
//         // const element = s[i];
        
//     }
//     return true

// };


// чужое лол чуть хуже по времени
// var isPalindrome = function(s) {
//     s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
//     let left = 0;
//     let right = s.length - 1;

//     while (left < right) {
//         if (s[left] !== s[right]) {
//             return false;
//         }
//         left++;
//         right--;
//     }

//     return true;    
// };