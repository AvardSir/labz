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

    let left_max_heigh=0
    for (let i = 0; i < height.length-1; i++) {
        // const element = height[i];
        let left_height=height[i]
        if (height[i]>left_max_heigh) {
            for (let j = height.length-1; j >i ; j--) {
                // const element = height[j];
                if (left_height<=height[j]) {
                    let cur_volum=(j-i)*left_height
                    max_volum=Math.max(cur_volum,max_volum)
                    break
                }
                else {
                    //left>height[j]
                    cur_volum=(j-i)*height[j]
                    max_volum=Math.max(cur_volum,max_volum)
                }
                
            }
            left_max_heigh=height[i]
        }
        
    }

    return max_volum
};


let ab=23