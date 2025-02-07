/**
 * @param {number} n
 * @return {boolean}
 */
// мое решенеие

// var isHappy = function(n) {
    

//     let sum=0
//     let prev=-1
//     set_n=new Set();
//     while (true) {
//         sum=0
//         n=Array.from(n.toString(),x=>Number(x))

//         for (let i = 0; i < n.length; i++) {
//             sum+=n[i]**2
//         }
//         if (sum===1) {
//             return true
//         }

//         if (set_n.has(sum)){
//             return false
//         }
//         set_n.add(sum)

//         n=sum
//     }
    
// };



// var isHappy = function(n) {
//     var visit = new Set();
    
//     var getNextNumber = function(n) {
//         var output = 0;
        
//         while (n > 0) {
//             var digit = n % 10;
//             output += digit * digit;
//             n = Math.floor(n / 10);
//         }
        
//         return output;
//     };

//     while (!visit.has(n)) {
//         visit.add(n);
//         n = getNextNumber(n);
//         if (n === 1) {
//             return true;
//         }
//     }

//     return false;    
// };


// 2е чужое

/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    function getNextNumber(n) {
        let output = 0;
        while (n > 0) {
            let digit = n % 10;
            output += digit * digit;
            n = Math.floor(n / 10);
        }
        return output;
    }

    let slow = getNextNumber(n);
    let fast = getNextNumber(getNextNumber(n));

    while (slow !== fast) {
        if (fast === 1) return true;
        slow = getNextNumber(slow);
        fast = getNextNumber(getNextNumber(fast));
    }

    return slow === 1;    
};