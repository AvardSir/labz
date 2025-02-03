/**
 * @param {number[]} nums
 * @return {number}
 */
//первая версия
// var singleNumber = function(nums) {
//     nums.sort()
//     for (let i = 0; i < nums.length; i=i+2) {
//         const element = nums[i];
//         if (nums[i]!=nums[i+1]){
//             return nums[i]
//         }
//     }
// };

var singleNumber = function(nums) {
    // Initialize the unique number...
    let uniqNum = 0;
    // TRaverse all elements through the loop...
    for (let idx = 0; idx < nums.length; idx++) {
        // Concept of XOR...
        uniqNum = uniqNum ^ nums[idx];
    } return uniqNum;       // Return the unique number...
};