/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */

class ListNode {
    constructor(value = 0, next = null) {
        this.value = value; // Значение узла
        this.next = next;   // Указатель на следующий узел
    }
}
var mergeTwoLists = function(list1, list2) {
    function revers(link_list) {
        let simple_list=[]
        while (link_list) {
            simple_list.push(link_list.value)
            link_list=link_list.next
        }
        return simple_list
    }
    function toListNode(simple_list) {
        listNode=new ListNode(simple_list[0])
        listNodeTOreturn=listNode
        for (let i = 1; i < simple_list.length; i++) {
            // const element = array[i];
            listNode.next=new ListNode(simple_list[i])
            listNode=listNode.next
            //что делаем? 
            
        }


        return listNodeTOreturn
    }
    list1=revers(list1)
    list2=revers(list2)
    list1=list1.concat(list2)
    list1.sort()
    return toListNode(list1)
};


// Создание первого списка
const list1 = new ListNode(1);
list1.next = new ListNode(2);
list1.next.next = new ListNode(3);

// Создание второго списка
const list2 = new ListNode(1);
list2.next = new ListNode(2);
list2.next.next = new ListNode(3);

// Функция для вывода значений списка
function printList(head) {
    let current = head;
    while (current) {
        console.log(current.value); // Вывод значения каждого узла
        current = current.next;
    }
}


printList(mergeTwoLists(list1, list2))