/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let k=0
    let temp=0
    for (let i = 0; i < nums.length; i++) {
        
        if (nums[i]!=0){
            
            // логику i смены
            temp=nums[i]
            nums[i]=0
            nums[k]=temp
            // nums[i]=nums[k]
            k++
        }
        // const element = nums[i];
        // ofr
    }
    return nums
};