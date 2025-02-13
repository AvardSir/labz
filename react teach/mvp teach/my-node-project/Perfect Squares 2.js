/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const sqer=Math.floor(Math.sqrt(n))
    const arr=Array(sqer)
    const arrInSquare=Array(sqer)
    for (let i = sqer-1; i >0 ; i--) {
        // const element = arr[i];
        arr[i]=i+1
        arrInSquare[i]=(i+1)**2
        // if (n%arrInSquare[i]==0) {
        //     return n/arrInSquare[i]
        // }
        
    }
    arrInSquare[0]=1
    arr[0]=1

    // let a=32    
    let temp=n
    let count=0
   
        for (let i = arrInSquare.length-1; i >-1 ; i--) {
            // const element = arrInSquare[i];
            while (temp>0) {
                temp-=arrInSquare[i]
                count++
            }

            if (temp==0) {
                return count
            }
            else{
                count--
                temp+=arrInSquare[i]
            }
            
        }
        

};

let aaaa=Math.floor(Math.sqrt(13))

let n=13
n=19

n=9*10
810
//случай 90, это вроде 10*9 а на деле это 9**2+3**2= 81+9=90

let aaa=numSquares(n) 
//10


let ab=32


