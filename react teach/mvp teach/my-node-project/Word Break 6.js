/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const max_len=Math.max(...wordDict.map(x=>x.length))
    const setWord=new Set(wordDict)
    const n=s.length
    
    const dp=new Array(n+1).fill(false)
    dp[0]=true
    for (let i = 1; i <= n; i++) {
        const aaa=Math.max(i-max_len-1,0)
        for (let j = i-1; j >= Math.max(i-max_len-1,0); j--) {
            
            if (dp[j]&&setWord.has(s.slice(j,i))) {
                dp[i]=true
                break
            }
            // const element = array[j];
            
        }
        // const element = array[i];
        
    }
    return dp[n]
};

wordDict =["leet","code"]

s="leetcode"

let aaaa=wordBreak (s, wordDict) 

let ab=2323