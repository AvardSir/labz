var maxProduct = function(nums) {
    // let res = Math.max(...nums);
    let res=nums[0]
    let curMax = 1, curMin = 1;

    for (let n of nums) {
        const tempMax = curMax * n;
        const tempMin = curMin * n;
        curMax = Math.max(tempMax, tempMin, n);
        curMin = Math.min(tempMax, tempMin, n);

        res = Math.max(res, curMax);
    }

    return res;    
};

// let nums=[-2,0,-1]
// nums=[2,-2,-2,-3,3]
// let aaaa=maxProduct(nums)

// let ab=323