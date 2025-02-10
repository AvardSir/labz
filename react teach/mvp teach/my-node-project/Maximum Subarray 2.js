/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let arr=nums
    let len=arr.length
    let max=arr[len-1]
    let end=len-1
    let start=len-1

    let acc=max
    function sum(start,end) {
        let acc_sum=0
        for (let i = start; i < end+1; i++) {
            // const element = arr[i];
            acc_sum+=arr[i]
            
        }
        return acc_sum
        
    }
    for (let i = arr.length-1; i >-1; i--) {
        start--
        if ((arr[i-1]+acc)<0 ){
            end=i-1
        }
        
        acc=sum(start,end)
        if (acc<arr[i-1]){
            acc=arr[i-1]   
        }
        if (acc>max){
            max=acc
        }
        // const element = arr[i];
        
    }
    return max
};

const nums=[31,-41,59,26,-53,58,97,-93,-23,84]
// const nums=[4,-3, 2]

console.log((maxSubArray(nums)))


