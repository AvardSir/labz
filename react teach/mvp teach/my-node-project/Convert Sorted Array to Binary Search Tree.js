/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
console.log(Math.floor(3 /2))
console.log(Math.ceil(3 /2))
// Math.ceil

var sortedArrayToBST = function(nums) {
    function TreeNode(val, left, right) {
            this.val = (val===undefined ? 0 : val)
            this.left = (left===undefined ? null : left)
            this.right = (right===undefined ? null : right)
        }

    function BST(start,end) {
     
        if (end<start){return null}
        let mid=Math.floor((end+start)/2)//середина

        return new TreeNode(nums[mid],BST(start,mid-1),BST(mid+1,end))
    }
    return BST(0,nums.length-1)
};