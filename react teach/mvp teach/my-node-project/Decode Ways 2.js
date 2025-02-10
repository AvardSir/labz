/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    // s=s.toString()
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
        let len=arr.length

        for (let i = len; i < n; i++) {
            
            // const element = array[i];
            arr.push(arr[i-1]+arr[i-2])
        }

        return arr[arr.length-1]
    }

    
    let counter=1
    
    let start=0,end=0
    for (let i = 1; i < s.length; i++) {
        end++
        
        if ( (s[i]=='0' && Number(s[i-1])>2) || (s[i]=='0' && s[i-1]=='0')){
            return 0
        }

        if (s[i]=='0'){
            // случай 110
            counter*=variations_full(end-start+1-2)
            start=(s[start]+1? start=i+1: i)
            // end=i
        }
        else if(Number(s[i-1]+s[i])>26 && s.length==2){
            if (end-start==1){
                counter*=1 
            }
            else if(Number(s[1]+s[0])>26){
                counter=0
            }
            else{
                counter*=variations_full(end-start+1-2)+1 //почему был +1м
            }
            // start=(s[start]+1? start=i+1: i)
            start=i
        }

        
    }
    counter*=variations_full(end-start+1)

    return counter

    // случай когда (111) работает?
};

let s=''
// s= "123123" 
// s="1201234"



s='2611055971756562'

s='11111'

s='30'
s='300'
let aaaa = numDecodings(s)
//надо 3 если s=1201234




let ab=32