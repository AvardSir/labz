/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    function bracket_ckec(bracket) {
        if (bracket.length%2!=0){return false}
        //bracket is a string
        // const cashe=[]
        let counter=0
        for (let i = 0; i < bracket.length; i++) {
            if (bracket[i]==')' && counter==0){
                return false
    
            }
            else if (bracket[i]=='(' ){
                // cashe.push(')')
                counter++
            }
            else if (bracket[i]==')' && counter>0) {
                // cashe[cashe.length-1]='_'
                counter--
            }
            const element = bracket[i];
            
        }
        if (counter>0){return false}
        return true
        
    }
    function bkacket_combinations(n) {
        let arr=[['(',')']]
        for (let i = 1; i < n; i++) {
            arr.push([])//[[0,1],[]]
            for (let j = 0; j < 2; j++) {
                for (let z = 0; z < arr[i-1].length; z++) {
                    // const element = array[z];
                    arr[i].push(arr[0][j]+arr[i-1][z])
                    
                }
                
            }
        }
        
    
        return arr
    }
    n=bkacket_combinations(n*2)
    n=n[n.length-1].filter(bracket_ckec)
    return n

};




// let n=4
// let a=bkacket_combinations(n)

// bracket%2!=0
// let bracket='(()))('
// let aba=bracket_ckec(bracket)
// let b=3