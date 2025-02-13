/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (nums.length==1) {
        return nums[0]
    }
    else if(nums.length==0){
        return 0
    }
    else if (nums.length==3) {
        // nums[0]=nums[0]+Math.max(nums[i+2],nums[i+3])
        return Math.max(nums[1],nums[0]+nums[2])
    }

    nums[nums.length-3]=nums[nums.length-3]+nums[nums.length-1]
    for (let i = nums.length-1-3; i >-1 ; i--) {
        // const element = nums[i];
        nums[i]=nums[i]+Math.max(nums[i+2],nums[i+3])
        
    }
    
    return Math.max(nums[0],nums[1])
};

nums =[2,7,9,3,1]

let aaa=rob (nums) 

let ab=32