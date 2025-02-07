/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if (s.length==1){return s}
    function polindro(s1) {
            let s2=''
            let i=0
            let j=s1.length-1
            while (j>-1) {
                
                s2+=s1[j]
                j--
            }
        
            return s2===s1
            // return s
        }
    function substrings(s) {
        let arr=[]
        for (let i = 0; i < s.length-1; i++) {
            for (let j = i+2; j < s.length+1; j++) {
                
                arr.push(s.substring(i,j))
                // const element = s[j];
                
            }
        }
        return arr
        
    }
    s=substrings(s)
    let max=0
    let index=-1
    for (let i = 0; i < s.length; i++) {
        const element = s[i];
        if (polindro(s[i])){
            if (max<s[i].length){
                // console.log(s[i])
                max=s[i].length
                index=i
            }
           
        
    }
    }
    if (index==-1){return s[0][0]}
    return s[index]
    // for (const i of s) {
    //     if (polindro(i)){
    //         if (max<i.length){
    //             max=i.length
    //             index=i
    //         }
    //         // max= max|| i.length
    //     }
    // }
};


// отладка функции полиндрома
// function polindro(s1) {
//     let s2=''
//     let i=0
//     let j=s1.length-1
//     while (j>-1) {
        
//         s2+=s1[j]
//         j--
//     }

//     return s2===s1
//     // return s
// }

// s= 'baba'
// let a=polindro(s)
// console.log(polindro(s))

// все подстроки в строке
function substrings(s) {
    let arr=[]
    for (let i = 0; i < s.length-1; i++) {
        for (let j = i+2; j < s.length+1; j++) {
            
            arr.push(s.substring(i,j))
            // const element = s[j];
            
        }
    }
    return arr
    
}
let s= 'abcd'
let a=substrings(s)

