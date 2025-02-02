/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let nums_answer=[]
    let prev=0
    for (let i = 0; i < nums.length-1; i++) {
        
        const element = nums[i];
        if (nums[i]!=nums[i+1]) {
            nums[prev:nums[i]]=nums[prev:nums[i]]
            nums_answer.push(nums[i])
        }
    }
    if (nums[nums.length-1]!=nums[nums.length-2]){
        nums_answer.push(nums[nums.length-1])
    }
    for (let i = 0; i < nums.length; i++) {
        nums[i]=nums_answer[i]
        
        
    }
    // nums=nums_answer
    // console.log(nums)
    return nums_answer.length

};
nums=[1,1,2]
console.log(removeDuplicates(nums))