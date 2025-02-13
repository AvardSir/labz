/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    let acc=1
    let max_prod=nums[0]
    let dp=Array(nums.length).fill(nums[0])
    let isOneMinus=false
    let remember_minus=-1
    for (let i = 0; i < nums.length; i++) {
        
        acc*=nums[i]
        
        // случай нуля не сделан
        if (nums[i]==0) {
            max_prod=Math.max(max_prod,acc)

            dp[i]=acc
            acc=1
            isOneMinus=false

            
        }
        else if(nums[i]<0 && !isOneMinus){
            remember_minus=i
            isOneMinus=!isOneMinus
            max_prod=Math.max(max_prod,acc)

            dp[i]=acc

            acc=1
        }
        else if(nums[i]<0 && isOneMinus){
            acc=dp[remember_minus]*acc
            max_prod=Math.max(max_prod,acc)
            isOneMinus=!isOneMinus

            dp[i]=acc
        }

        else{
            max_prod=Math.max(max_prod,acc)
            dp[i]=acc
        }
        
        
        

        
    }

    return max_prod
};


let nums = [-2,0,-1]

// nums=[-4,-3]

// nums=[-4,-3,-2]


// nums= [-3,-1,-1]
nums=[2,-5,-2,-4,3]

let aaaaa=maxProduct(nums)

let abas=32
