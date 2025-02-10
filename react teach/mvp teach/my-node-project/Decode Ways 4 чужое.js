/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    if (s[0] === '0') {
        return 0;
    }

    const n = s.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        const one = parseInt(s[i - 1]);
        const two = parseInt(s.substring(i - 2, i));

        if (1 <= one && one <= 9) {
            dp[i] += dp[i - 1];
        }
        if (10 <= two && two <= 26) {
            dp[i] += dp[i - 2];
        }
    }

    return dp[n];    
};

let s='110'
// s='30'
let aaaaa= numDecodings(s)

let ab=323