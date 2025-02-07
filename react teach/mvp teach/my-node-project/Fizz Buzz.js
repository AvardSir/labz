/**
 * @param {number} n
 * @return {string[]}
 */

// мое решение
// var fizzBuzz = function(n) {
//     let a3=0
//     let a5=0
//     // let a15=0

//     let arr=Array.from({length:n},()=>'')
//     for (let i = 1; i < n+1; i++) {

//         // const element = array[i];
//         a3=i%3
//         a5=i%5
//         // a15=i%15
//         if (a3==0 || a5==0){
//             if (a3===0){
//                 arr[i-1]+='Fizz'
//             }
//             if (a5===0){
//                 arr[i-1]+='Buzz'
//             }
//         }
//         else
//         {
//             // console.log(i)
//             arr[i-1]=(i).toString()
//         }
//     }
//     return arr
// };

// чужое реешиние 
var fizzBuzz = function(n) {
    var res = [];
    var i = 1, fizz = 0, buzz = 0;
    
    while (i <= n) {
    fizz++;
    buzz++;
    
     if (fizz === 3 && buzz === 5) {
         res.push("FizzBuzz");
         fizz = buzz = 0;
     } else if (fizz === 3) {
         res.push("Fizz");
         fizz = 0;
     } else if (buzz === 5) {
         res.push("Buzz");
         buzz = 0;
     } else {
         res.push(i.toString());
     }
    
     i++;
    
    }
    
    return res;
    };


// попытка улучшить чужое, добавив мою мысль, о том чтобы сразу сделать маасив
// решение лучше, оно работает
var fizzBuzz = function(n) {


let res=Array.from({length:n},()=>null)
var i = 1, fizz = 0, buzz = 0;

while (i <= n) {
fizz++;
buzz++;

    if (fizz === 3 && buzz === 5) {
        res[i-1]=("FizzBuzz");
        fizz = buzz = 0;
    } else if (fizz === 3) {
        res[i-1]=("Fizz");
        fizz = 0;
    } else if (buzz === 5) {
        res[i-1]=("Buzz");
        buzz = 0;
    } else {
        res[i-1]=(i.toString());
    }

    i++;

}

return res;
};