/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    s=s.toString()
    // случай 100 должен false
    if(s[0]=='0'){return 0}
    if (s.length==1 ){return 1}
    if (s.length==2&&Number(s[0]+s[1])>26){return 1}

    let arr=[1,2,3]//хранит количество вариантов при отсуствии 0 и отсуствии 27>0
    function variations_full(n) {
        if (n<=0){return 1}
        if (arr.length>=n){
            return arr[n-1]
        }
        // let len=Math.max(0,arr.length-1)
        let len=arr.length-1

        for (let i = len; i < n; i++) {
            
            // const element = array[i];
            arr.push(arr[i]+arr[i-1])
        }

        return arr[arr.length-1]
    }

    
    let counter=1
    
    let start=0,end=0
    for (let i = 1; i < s.length; i++) {
        end++
        
        if (s[i]=='0' && Number(s[i-1])>2){
            return 0
        }

        if (s[i]=='0' ){
            // случай 110
            counter*=variations_full(end-start+1-2)
            start=(s[start]+1? start=i+1: i)
            // end=i
        }
        else if((Number(s[i-1]+s[i])>26)){
            counter*=(variations_full(end-start+1-2)+1)
            start=(s[start]+1? start=i+1: i)
        }

        
    }
    counter*=variations_full(end-start+1)

    return counter

    // случай когда (111) работает?
};

s='27'

let a = numDecodings(s)

// console.log(a==1?'Рабтает':'Не правильно','выводит ',a)


s=1201234
let aaaa = numDecodings(s)
//надо 3


let ab=32