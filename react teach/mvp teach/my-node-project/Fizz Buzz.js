/**
 * @param {number} n
 * @return {string[]}
 */

// мое решение
var fizzBuzz = function(n) {
    let a3=0
    let a5=0
    // let a15=0

    let arr=Array.from({length:n},()=>'')
    for (let i = 1; i < n+1; i++) {

        // const element = array[i];
        a3=i%3
        a5=i%5
        // a15=i%15
        if (a3==0 || a5==0){
            if (a3===0){
                arr[i-1]+='Fizz'
            }
            if (a5===0){
                arr[i-1]+='Buzz'
            }
        }
        else
        {
            // console.log(i)
            arr[i-1]=(i).toString()
        }
    }
    return arr
};



