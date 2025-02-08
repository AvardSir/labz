/**
 * @param {number} n
 * @return {string[]}
 */

// МОЕ РЕШЕНИЕ. 5 процентов бита но МОЕ

// var generateParenthesis = function(n) {
//     function bracket_ckec(bracket) {
//         if (bracket.length%2!=0 ||bracket[0]==')'){return false}
//         // if (bracket[0]==')'){}
//         //bracket is a string
//         // const cashe=[]
//         let counter=0
//         for (let i = 0; i < bracket.length; i++) {
//             if (bracket[i]==')' && counter==0){
//                 return false
    
//             }
//             else if (bracket[i]=='(' ){
//                 // cashe.push(')')
//                 counter++
//             }
//             else if (bracket[i]==')' && counter>0) {
//                 // cashe[cashe.length-1]='_'
//                 counter--
//             }
//             const element = bracket[i];
            
//         }
//         if (counter>0){return false}
//         return true
        
//     }
//     function bkacket_combinations(n) {
//         let arr=[['(',')']]
//         for (let i = 1; i < n; i++) {
//             arr.push([])//[[0,1],[]]
//             for (let j = 0; j < 2; j++) {
//                 for (let z = 0; z < arr[i-1].length; z++) {
//                     // const element = array[z];
//                     arr[i].push(arr[0][j]+arr[i-1][z])
                    
//                 }
                
//             }
//         }
        
    
//         return arr
//     }
//     n=bkacket_combinations(n*2)
//     n=n[n.length-1].filter(bracket_ckec)
//     return n

// };




// // let n=4
// // let a=bkacket_combinations(n)

// // bracket%2!=0
// // let bracket='(()))('
// // let aba=bracket_ckec(bracket)
// // let b=3


// чужое великолепие использующее поиск в глубину и сохранения резлуьтатов во внешнем массиве
var generateParenthesis = function(n) {
    const res = [];

    function dfs(openP, closeP, s) {
        if (openP === closeP && openP + closeP === n * 2) {
            res.push(s);
            return;
        }

        if (openP < n) {
            dfs(openP + 1, closeP, s + "(");
        }

        if (closeP < openP) {
            dfs(openP, closeP + 1, s + ")");
        }
    }

    dfs(0, 0, "");

    return res;    
};


// попробую сделать 000 001 010 011 через dfs
const res=[]
let prev=''
let n=2
let i=0
let len=0

let f=10
function dfs(prev,len) {
    
    if (n==len) {
        res.push(prev)
        return
    }
    for (let i = 0; i < f; i++) {
        dfs(prev+i.toString(),len+1);

        // dfs('1'+prev,len+1);
        // dfs('2'+prev,len+1);
        
    }
    
    
    // i++;
}

dfs(prev,0) 
let aba=''
