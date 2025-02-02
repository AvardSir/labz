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
    let curr= new ListNode();
    let list3 =new ListNode();
    if(list1.value>list2.value){
        curr=list2
        list3=list2
        if_cur_list1=false
    }
    else 
    {
        curr=list1
        list3=list1
        if_cur_list1=true
    }
    function dif_list(if_cur_list1) {
        if (if_cur_list1){
            return list2
        }
        else{return list1}
    }
    function nextInList(if_cur_list1,list1,list2) {
        if (if_cur_list1){
            list1=list1.next
        }
        else{
            list2=list2.next
        }
        return list1,list2
    }
    while (curr.next.value || dif_list(if_cur_list1).next.value){
        if (curr.value>dif_list(if_cur_list1).value){
            curr=dif_list(if_cur_list1)
            if_cur_list1=!if_cur_list1
            console.log(curr.value,"значение, ",curr.next," следующее")
        }
        if (curr.next.value>curr.value && dif_list(if_cur_list1).value>curr.value){
            if (curr.next.value<dif_list(if_cur_list1).value){
                curr=curr.next
                list1,list2=nextInList(if_cur_list1,list1,list2)
                console.log(curr.value,"значение, ",curr.next," следующее")
            }
            else{
                curr.next=dif_list(if_cur_list1)
                curr=dif_list(if_cur_list1)
                if_cur_list1=!if_cur_list1
                console.log(curr.value,"значение, ",curr.next," следующее")
            }
        }
        if (curr.value==dif_list(if_cur_list1).value){
            curr.next=dif_list(if_cur_list1)
            curr=dif_list(if_cur_list1)
            if_cur_list1=!if_cur_list1

            if (dif_list(if_cur_list1).next.value<curr.next.value){
                curr.next=dif_list(if_cur_list1).next.value
                curr=dif_list(if_cur_list1).next
                list1,list2=nextInList(true,list1,list2)
                list1,list2=nextInList(false,list1,list2)
                console.log(curr.value,"значение, ",curr.next," следующее")
            }
            else{
                
                curr=curr.next
                list1,list2=nextInList(true,list1,list2)
                list1,list2=nextInList(false,list1,list2)
                console.log(curr.value,"значение, ",curr.next," следующее")
            }

        }
        if (!curr.next){
            curr.next=dif_list(if_cur_list1)
            console.log(curr.value,"значение, ",curr.next," следующее")
        }
    }
    return list3
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