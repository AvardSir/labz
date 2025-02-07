/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    function ListNode(val) {
        this.val = val;
        this.next = null;
    }

    const set = new Set();
    // let head=head
    while (head) {
        if (set.has(head) ){
            return true
        }
        set.add(head)
        head=head.next
    }
    return false
};

// чужое  быстрый и медленнй указатель
// var hasCycle = function(head) {
//     let fast = head;
//     let slow = head;

//     while (fast && fast.next) {
//         fast = fast.next.next;
//         slow = slow.next;

//         if (fast === slow) {
//             return true;
//         }
//     }

//     return false;    
// };