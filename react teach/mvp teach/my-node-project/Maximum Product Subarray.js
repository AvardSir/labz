/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    let acc=1
    let max_prod=nums[0]
    //если массив nums= [-2,0]
    let start_past=0
    let counter=1
    let n=nums.length-1
    let past_max=1
    for (let i = 0; i < nums.length; i++) {
        
        acc*=nums[i]
        if (nums[i]<0 &&counter!=2) {
            past_max=acc
            counter++

            acc=1
        }
        else if (nums[i]<0 &&counter==2) {
            
            counter=1
            acc=past_max*acc
            // (start_past,i)
        }
        
        // случай нуля не сделан
        if (nums[i-1]==0) {
            acc=nums[i]
            past_max=0
            // start_past=i
        }
        
        
        max_prod=Math.max(max_prod,acc)

        
    }
    // if (nums[n]<0 &&counter==2) {
        
    //     // counter=1
    //     acc=past_max
    //     // (start_past,i)
    // }
    max_prod=Math.max(max_prod,acc)
    return max_prod
};

let nums = [-2,0,-1]

// nums=[-4,-3]

// nums=[-4,-3,-2]



let aaaaa=maxProduct(nums)

let abas=32