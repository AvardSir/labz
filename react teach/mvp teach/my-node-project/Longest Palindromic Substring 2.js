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
        
            return s2===s1}
        
        let arr=[]
        let max=0
        let ans=''
        for (let i = 0; i < s.length-1; i++) {
            for (let j = i+2; j < s.length+1; j++) {
                
                if (polindro(s.substring(i,j)))
                    {
                        if (max<j-i){
                            max=j-i
                            ans=s.substring(i,j)
                        }
                    }
                // const element = s[j];
                
            }
        }
        if (ans===''){return s[0]}
        return ans
    }