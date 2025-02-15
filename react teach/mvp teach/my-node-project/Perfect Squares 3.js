/**
 * @param {number} n
 * @return {number}
 */

// мое решение бьет 50 процентов 
var numSquares = function(n) {
    const dp=Array(n+1)
    const dpKnow=[0,1,2,3,1]
    for (let i = 0; i < dpKnow.length; i++) {
        // const element = dp[i];
        dp[i]=dpKnow[i]
    }

    let nextSqr=9
    let nextI=3
    let PreSqwr=Math.floor(Math.sqrt(n))

    // const arrSqr=[1,4]
    const arrSqr=Array(PreSqwr)
    for (let i = 0; i < PreSqwr; i++) {
        // const element = PreSqwr[i];
        arrSqr[i]=(i+1)**2
    }
    

    let min=n
    
    for (let i = dpKnow.length; i < dp.length; i++) {
        // curInt=i
        if (i==nextSqr) {
            nextI++
            nextSqr=/**
 * @param {number} n
 * @return {number}
 */

// мое решение бьет 50 процентов 
var numSquares = function(n) {
    const dp=Array(n+1)
    const dpKnow=[0,1,2,3,1]
    for (let i = 0; i < dpKnow.length; i++) {
        // const element = dp[i];
        dp[i]=dpKnow[i]
    }

    let nextSqr=9
    let nextI=3
    let PreSqwr=Math.floor(Math.sqrt(n))

    // const arrSqr=[1,4]
    const arrSqr=Array(PreSqwr)
    for (let i = 0; i < PreSqwr; i++) {
        // const element = PreSqwr[i];
        arrSqr[i]=(i+1)**2
    }
    

    let min=n
    
    for (let i = dpKnow.length; i < dp.length; i++) {
        // curInt=i
        if (i==nextSqr) {
            nextI++
            nextSqr=nextI**2
        }
        // const element = dp[i];
        for (let j = 0; j < nextI-1; j++) {
            // const element = arrSqr[j];
            
            min=Math.min(min,1+dp[i-arrSqr[j]])

        }
        dp[i]=min
        min=n
        
    }

    return dp[n]
}


// function numSquares(n){
//     let dp= new Array(n + 1).fill(Number.MAX_SAFE_INTEGER);
//     dp[0] = 0; // 0 квадратов для 0

//     let count = 1;
//     while (count * count <= n) {
//         let sq= count * count;
//         for (let i = sq; i <= n; i++) {
//             dp[i] = Math.min(dp[i], dp[i - sq] + 1);
//         }
//         count++;
//     }
//     return dp[n];
// }

let aaaa=Math.floor(Math.sqrt(13))

let n=5
n=19

n=13
//случай 90, это вроде 10*9 а на деле это 9**2+3**2= 81+9=90

let aaa=numSquares(n) 
//10


let ab=32
        }
        // const element = dp[i];
        for (let j = 0; j < nextI-1; j++) {
            // const element = arrSqr[j];
            
            min=Math.min(min,1+dp[i-arrSqr[j]])

        }
        dp[i]=min
        min=n
        
    }

    return dp[n]
}


// function numSquares(n){
//     let dp= new Array(n + 1).fill(Number.MAX_SAFE_INTEGER);
//     dp[0] = 0; // 0 квадратов для 0

//     let count = 1;
//     while (count * count <= n) {
//         let sq= count * count;
//         for (let i = sq; i <= n; i++) {
//             dp[i] = Math.min(dp[i], dp[i - sq] + 1);
//         }
//         count++;
//     }
//     return dp[n];
// }

let aaaa=Math.floor(Math.sqrt(13))

let n=5
n=19

n=13
//случай 90, это вроде 10*9 а на деле это 9**2+3**2= 81+9=90

let aaa=numSquares(n) 
//10


let ab=32