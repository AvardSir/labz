/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function(nums) {
    if (nums.length<3) {
        return false
    }
    dp=Array(nums.length).fill(1)
    for (let i = 1; i < nums.length; i++) {
        const element = nums[i];
        for (let j = i; j > -1; j--) {
            const element = nums[j];
            if (nums[j]<nums[i]) {
                dp[i]=Math.max(dp[i],1+dp[j])
                if (dp[i]==3) {
                    return true
                }
            }
            
            
        }
        
    }

    return false
};

nums =[2,1,5,0,4,6]

let aaa=increasingTriplet (nums)

let ab=32