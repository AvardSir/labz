/**
 * @param {number[]} nums
 * @return {boolean}
 */

//решение работает но по времени не проходит
var increasingTriplet = function(nums) {
    if (nums.length<3) {
        return false
    }
    const triplet_arr=[nums[0],undefined]
    for (let i = 1; i < nums.length; i++) {
        const element = nums[i];
        if (element>triplet_arr[0]) {
            if (triplet_arr[1]===undefined) {
                triplet_arr[1]=element
            }
            else{
                if (element>triplet_arr[1]) {

                    return true
                }
                else{
                    triplet_arr[1]=element
                }
            }
            
        }
        else{
            triplet_arr[0]=element
        }
    }
    return false
};

nums =[1,0,-1,0,0,0,0,0,0,0,100000000]

let aaa=increasingTriplet (nums)

let ab=32


