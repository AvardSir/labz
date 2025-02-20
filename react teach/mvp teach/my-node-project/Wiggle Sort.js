function wiggleSort(nums) {
    nums.sort()
    // nums_copy=[...nums]

    anwer=Array(nums.length)
    anwer[0]=nums
    
    let flag=true
    let start=0
    let end=nums.length-1
    let i=0
    while (start<=end){

        if (flag) {
            anwer[i]=nums[start]
            flag=!flag
            start++
        }
        else{
            anwer[i]=nums[end]
            flag=!flag
            end--
        }
        i++
        
    }
    return anwer

}


nums = [1,2,3,4,5]
nums = [6,6,5,6,3,8]
nums = [3,5,2,1,6,4]


let aaaa= wiggleSort(nums)


let ab=32