/**
 * @param {number[]} height
 * @return {number}
 */

//работает но медленно
var maxArea = function(height) {
    if (height.length<2) {
        return 0
    }
    
    let max_volum=Math.min(height[0],height[1])
    for (let i = 0; i < height.length-1; i++) {
        // const element = height[i];
        let left_height=height[i]
        for (let j = i+1; j < height.length; j++) {
            // const element = height[j];
            if (left_height<=height[j]) {
                let cur_volum=(j-i)*left_height
                max_volum=Math.max(cur_volum,max_volum)
            }
            else {
                //left>height[j]
                cur_volum=(j-i)*height[j]
                max_volum=Math.max(cur_volum,max_volum)
            }
            
        }
    }

    return max_volum
};


let ab=23