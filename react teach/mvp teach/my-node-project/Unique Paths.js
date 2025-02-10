/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */

// мое решение. оно решает но Time Limit Exceeded
// var uniquePaths = function(m, n) {
    
//     const n_global=n-1
//     const m_global=m-1
//     let counter_paths=0
//     function dfs(n,m) {
//         if (n==n_global && m==m_global){
//             counter_paths++
//             return 
//         }
//         if (n<n_global){
//             dfs(n+1,m)
//         }
//         if (m<m_global){
//             dfs(n,m+1)
//         }
        
//     }
//     dfs(0,0)
//     return counter_paths
// };


/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */

// мое решение. оно решает но Time Limit Exceeded
var uniquePaths = function(m, n) {
    let arr=Array.from({length:n},x=>Array.from({length:m},x=>0))
    arr[0][0]=1
    // let ab=323
    for (let i = 0; i < n; i++) {
        // const element = array[i];
        for (let j = 0; j < m; j++) {
            
            if (j>0 && i>0){
                arr[i][j]=arr[i][j-1]+arr[i-1][j]
                //потом
            }
            else if (j>0) {
                arr[i][j]=1
            }
            else if (i>0) {
                arr[i][j]=1
            }
        }
        
    }
    return arr[n-1][m-1]
};

let n=3,m=3
let a=uniquePaths(m,n)

let ab=32


