/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (nums.length==1) {
        return nums[0]
    }
    else if(nums.length==1){
        return 0
    }
    const memo={}
    let curList=nums
    function dfs(curInd) {
        if (curInd in memo) {
            return memo[curInd]
        }
        const check=curList.length-1-curInd
        if (curList.length-1-curInd<2) {
            memo[curInd]=curList[curInd]
            return curList[curInd]
        }

        if (curList.length-1-curInd==2) {
            memo[curInd]=curList[curInd]+curList[curInd+2]
            return curList[curInd]+curList[curInd+2]
        }
        const oneJump=dfs(curInd+2)
        const twoJump=dfs(curInd+3)

        const maxJump=Math.max(oneJump,twoJump)
        memo[curInd]=maxJump+curList[curInd]
        return maxJump+curList[curInd]
    }


    return  Math.max(dfs(0),dfs(1)) 
};



nums =[3,2,1,2]

let aaaa= rob(nums) 

let ab=32