/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    let flag=true
    let even=0
    let odd=0
    for (let i = 0; i < nums.length; i++) {
        const element = nums[i];
        if (flag) {
            flag=!flag
            even+=element
        }
        else{
            flag=!flag
            odd+=element
        }   
        
    }
    let even2=0
    let odd2=0
    for (let i = 0; i < nums.length; i++) {
        const element = nums[i];
        
    }
    return Math.max(even,odd)
};

nums =[1,2,3,1]

let aaa=rob(nums) 

let ab=23