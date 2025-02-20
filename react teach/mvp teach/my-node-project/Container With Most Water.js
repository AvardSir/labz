/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    if (height.length<2) {
        return 0
    }
    let start=0
    let end=height.length-1
    function volum(start,end) {
        
        let height_Vol=Math.min(height[start],height[end])
        let width=end-start
        return height_Vol*width
    }
    let max_height=volum(0,1)
    // for (let i = 0; i < height.length; i++) {
    //     // const element = height[i];
        
    //     max_height=Math.max(volum(start,end),max_height)
    //     // height[i]
    // }
    while (start<end) {
        max_height=Math.max(volum(start,end),mмax_height)

        start++
        end--
    }

    return max_height
};