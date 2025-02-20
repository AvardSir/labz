function wiggleSort(nums) {
    nums.sort((a,b)=>a-b)
    // nums_copy=[...nums]

    const anwer=Array(nums.length)
    // anwer[0]=nums
    
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
    for (let i = 0; i < nums.length; i++) {
        const element = nums[i];
        nums[i]=anwer[i]
    }
    // nums=[...anwer]
    // return anwer
    // let ab=32213
}

nums =[1,5,1,1,6,4]
let s='1 22 3 4 5'

nums =s.split(' ').map(Number)

// nums =[1,3,2,2,3,1]
let aaa=wiggleSort(nums)

let ab=32