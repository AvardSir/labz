/**
 * @param {number[]} nums
 * @return {number}
 */

// решение 1 не рабочее
// var missingNumber = function(nums) {
//     len=nums.length
//     if (len==1){
//         if (nums[0]==0){return 1}
//         if (nums[0]==1){return 0}
//     }
//     nums.sort()
//     // console.log(nums)
//     for (let i = 0; i < len-1; i++) {
//         // const element = nums[i];
        
//         if (nums[i]+1!=nums[i+1]){
//             console.log(nums[i])
//             return nums[i]+1
//         }
//     }
//     return nums[len-1]+1
// };
// a=[45,35,38,13,12,23,48,15,44,21,43,26,6,37,1,19,22,3,11,32,4,16,28,49,29,36,33,8,9,39,46,17,41,7,2,5,27,20,40,34,30,25,47,0,31,42,24,10,14]
// a.sort((a, b) => a - b)


// 1е решение, "рабочее"
var missingNumber = +function(nums) {
    nums.sort((a, b) => a - b)
    if (nums.length==1 && nums[0]==0){return 1}
    for (let i = 0; i < nums.length; i++) {
        if (nums[i]!=i){return i}
        
        
    }
    return nums[nums.length-1]+1
};