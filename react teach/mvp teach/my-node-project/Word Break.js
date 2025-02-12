/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */

// метод dfs он РАБОТАЕТ. но медленно и не проходит Time Limit Exceeded
// var wordBreak = function(s, wordDict) {
//     wordDict=new Set(wordDict);
//     let isFind=false;
//     const n=s.length
//     function dfs(curInd,curString){

//         if (n==curInd || isFind) {
//             if (wordDict.has(curString)) {
//                 isFind=true
                
//             }
//             return
//         }

//         if (wordDict.has(curString)) {
//             dfs(curInd+1,s[curInd])
//         }


//         dfs(curInd+1,curString+s[curInd])

//     }

//     dfs(1,s[0])

//     return isFind
// };


// чужой dfs

var wordBreak = function(s, wordDict) {
    const memo = {};
    const wordSet = new Set(wordDict);

    

    function dfs(s) {
        if (s in memo) return memo[s];
        if (wordSet.has(s)) return true;
        for (let i = 1; i < s.length; i++) {
            const prefix = s.substring(0, i);// строка до iго элемента
            if (wordSet.has(prefix) && dfs(s.substring(i))) {
                memo[s] = true;
                return true;
            }
        }
        memo[s] = false;
        return false;
    }


    return dfs(s);
};

