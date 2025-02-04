/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */

// первое решение
var intersect = function(nums1, nums2) {
    dict_nums1={}
    let key=0
    for (let i = 0; i < nums1.length; i++) {
        key =nums1[i]
        if (key in dict_nums1){
            dict_nums1[key]++
        }
        else{
            dict_nums1[key]=1
        }
        const element = nums1[i];
        
    }
    
    let nums3=[]
    for (let i = 0; i < nums2.length; i++) {
        if (nums2[i] in dict_nums1 && dict_nums1[nums2[i]]!=0){
            dict_nums1[nums2[i]]--
            nums3.push(nums2[i])
        }
        const element = nums2[i];
    }
    return nums3
};