/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */


var wordBreak = function(s, wordDict) {
    const wordSet= new Set(wordDict)
    const memo={}
    function dfs(s) {
        if (s in memo) {
            return memo[s]
        }
        if (  wordSet.has(s)){
            return true
        }

        for (let i = 1; i < s.length; i++) {
            const preSrting=s.slice(0,i)
            const postString=s.slice(i)

            if (wordSet.has(preSrting)  && dfs(postString)) {
                
                memo[s]=true
                return true
            }            
        }
        memo[s]=false
        return false 
    }
    

    return dfs(s)
};


let s="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"
s='aaab'
let wordDict =["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]
s='aab'
s='leetcode'
wordDict =["leet","code"]
let aaaaa= wordBreak(s, wordDict) 

// s='ab'
// s=s.slice(0,s.length)


let ab=32