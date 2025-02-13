/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const sqer=Math.floor(Math.sqrt(n))
    const arr=Array(sqer)
    const arrInSquare=Array(sqer)
    for (let i = sqer; i >0 ; i--) {
        // const element = arr[i];
        arr[i]=i+1
        arrInSquare[i]=(i+1)**2
        if (n%arrInSquare[i]==0) {
            return n/arrInSquare[i]
        }
        
    }
    arrInSquare[0]=1
    arr[0]=1

let a=32

};

let aaaa=Math.floor(Math.sqrt(13))

let n=13

let aaa=numSquares(n) 

let ab=32

