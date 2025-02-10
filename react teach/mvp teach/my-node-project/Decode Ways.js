/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    if(s[0]=='0'){return false}
    let counter=0
    // проверить еще с длиной строки
    for (let i = 0; i < s.length; i++) {
        
        let arr=[[1],[2]]//хранит количество вариантов при отсуствии 0 и отсуствии 27>0
        function variations_full(n) {

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

        

        // проверку надо еще проверить
        if (Number(s[i])+Number(s[i+1])>26){
            continue
        }
        else
            { counter++}

        if (s[i]==0 && s[i+1]==0){
            return false
        }
        else if(s[i]==0){
            continue
        }
        else{
            counter++
        }
        
    }

    
};