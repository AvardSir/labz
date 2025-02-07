/**
 * @param {string} s
 * @return {string}
 */

// мое РАБОЧЕЕ РЕЧЕНИЕ
// var longestPalindrome = function(s) {
//     if (s.length==1){return s}
//     function polindro(s) {
//             // let s2=''
//             // let i=0
//             // let j=s.length-1
//             // while (j>-1) {
                
//             //     s2+=s1[j]
//             //     j--
//             // }
//             len=s.length-1
//             for (let i = 0; i < Math.floor(s.length/2); i++) {
//                 if (s[i]!=s[len-i]){
                    
//                     return false}
                
//             }
//             return true
//         }
        
//         let substr=''
//         const len_=s.length
//         for (let delta = s.length; delta >1; delta--) {
//             // const element = array[delta];
//             for (let i = 0; i < len_-delta+1; i++) {
//                 substr=s.substring(i,i+delta)
//                 // console.log(substr)
//                 if (polindro(substr)){
                    
//                     return substr
//                 }
//             }
            
            
//         }
//         return s[0]
//         // return ans
//     }



// чужое 
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if (!s) {
        return "";
    }

    function expandAroundCenter(s, left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    let start = 0;
    let end = 0;

    for (let i = 0; i < s.length; i++) {
        const odd = expandAroundCenter(s, i, i);
        const even = expandAroundCenter(s, i, i + 1);
        const max_len = Math.max(odd, even);

        if (max_len > end - start) {
            start = i - Math.floor((max_len - 1) / 2);
            end = i + Math.floor(max_len / 2);
        }
    }

    return s.substring(start, end + 1);    
};

let s='abb'
s=longestPalindrome(s)
let a=3