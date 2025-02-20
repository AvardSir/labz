var wiggleSort = function(nums) {
    nums.sort((b,a)=>b-a);
    nums.reverse();
    let mid = Math.floor(nums.length/2)
    mid+=nums.length%2==0?0:1;
    let even = nums.slice(0, mid);
    let odd = nums.slice(mid);
    for(let i=0;i<nums.length;i++) {
        if (i%2==0) {
            nums[i] = even.pop();
        } else {
            nums[i] = odd.pop();
        }
    }
};

nums =[1,5,1,1,6,4]
let s='1 22 3 4 5'


s='1 2 3 4 5'
nums =s.split(' ').map(Number)
let ab323=[1,5,1,1,6,4]


// ab323.sort((b,a)=>b-a);
// nums =[1,3,2,2,3,1]


nums =[1,3,2,2,3,1]
let aaa=wiggleSort(nums)

let ab=32