/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    let memo={}
    let setWord=new Set(wordDict)
    let n=s.length

    function dfs(s) {
        if (s in memo) {
            return memo[s]
        }
        if (setWord.has(s)){
            return true
        }

        for (let i = 1; i < s.length; i++) {
            const pref=s.slice(0,i)
            const post=s.slice(i)

            if (setWord.has(pref)&&dfs(post)) {
                
                memo[s]=true
                return true
            }
            // const element = s[i];
            
        }
        memo[s]=false
        return false

    }

    return dfs(s)
};