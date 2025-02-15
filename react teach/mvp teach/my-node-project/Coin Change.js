/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    if (amount==0) {
        return 0
    }
    coins.sort((a,b)=>a-b)
    // const amount=amount
    
    const dp=Array(amount+1).fill(Number.MAX_SAFE_INTEGER)
    dp[0]=0
    for (let i = 1; i < dp.length; i++) {
        // const element = dp[i];
        for (let j = 0; j < coins.length; j++) {
            //перспективы улучшить это сделать чтоб не все j проходили
            if (i-coins[j]<0) {
                break
            }
            if (dp[i-coins[j]]!=Number.MAX_SAFE_INTEGER ) {
                dp[i]=Math.min(dp[i],dp[i-coins[j]]+1)    
            }
        }
        
        
    }

    // let ab=dp[249]

    if (dp[amount]==Number.MAX_SAFE_INTEGER ) {
        return -1   
    }
    else{
        return dp[amount]
    }
};

// // nums = [10,9,2,5,3,7,101,18]

// // coins = [1,2,5]
// // amount = 11

// coins =[474,83,404,3]
// amount =264
// let aaa=coinChange(coins, amount)

// let ab=23