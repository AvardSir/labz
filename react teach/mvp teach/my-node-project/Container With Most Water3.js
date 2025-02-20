/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    if (height.length<2) {
        return 0
    }
    
    let max_volum=Math.min(height[0],height[1])
    for (let i = 0; i < height.length; i++) {
        const element = height[i];
        let left_height=height[i]
        for (let j = 1; j < height.length; j++) {
            const element = height[j];
            if (left_height<height[j]) {
                cur_height=(j-i)*left_height

            }
            
        }
    }
};


let ab=23