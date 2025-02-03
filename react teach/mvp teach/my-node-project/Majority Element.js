/**
 * @param {number[]} nums
 * @return {number}
 */

// первое решение
// var majorityElement = function(nums) {
//     nums.sort()
//     mid=Math.floor(nums.length/2)
//     if (nums[0]==mid){
//         return nums[0]
//     }
//     else{
//         return nums[mid]
//     }
    
// };

// версия 2
// var majorityElement = function(nums) {
    
//     dict={}
//     let key=-1
//     for (let i = 0; i < nums.length; i++) {
//         key=nums[i]
//         if (key in dict){
//             dict[key]++
//         }
//         else{
//             dict[key]=0
//         }
        
        
//     }
//     let max=-1
//     let remember_key=-1
//     for (let key in dict) {
//         if (dict[key]>max){
//             max=dict[key]
//             remember_key=key
//         }
//     }
//     return Number(remember_key)
// };


// лол 3е решение хуже 2го, хотя направлено на оптмизацию

// var majorityElement = function(nums) {
    
//     threshold=Math.ceil(nums.length/2)

//     dict={}
//     let key=-1
//     for (let i = 0; i < nums.length; i++) {
//         key=nums[i]
//         if (key in dict){
//             dict[key]++
//             if (dict[key]>threshold){
//                 return key
//             }
//         }
//         else{
//             dict[key]=0
//         }
        
        
//     }
//     let max=-1
//     let remember_key=-1
//     for (let key in dict) {
//         if (dict[key]>max){
//             max=dict[key]
//             remember_key=key
//         }
//     }
//     return Number(remember_key)
// };


// чуджое  И ОНО ХУЖЕ МОЕГО ВТОРОГО!

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    const hash = {};
    let res = 0;
    let majority = 0;

    for (let n of nums) {
        hash[n] = 1 + (hash[n] || 0);
        if (hash[n] > majority) {
            res = n;
            majority = hash[n];
        }
    }

    return res;    
};