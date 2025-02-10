/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let max_jump=nums[0]
    for (let i = 0; i < nums.length-1; i++) {
        // const element = nums[i];
        if (nums[i]==0) {
            if (max_jump <= i){
                return false
            }
        }
        max_jump=Math.max(max_jump,nums[i]+i)
        // nums[i]=nums[i]+i
        
    }
    return true
};

let nums=[3,2,1,0,4]
let a=canJump(nums)
let ab=3