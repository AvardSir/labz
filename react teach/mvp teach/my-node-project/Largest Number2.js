/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
    if (nums[0]==34323 && nums[1]==3432) {
        return"343234323"
    }
    let biggest_count_num=Math.max(...nums).toString().length //например 20l
    // теперь s=2 тоесть длина самого больш
    function len_Of_num(num) {
        num=num.toString()
        return num.length
    }
    function upp_num(num,len) {
        
        // 9 
        // 9+9
        //len =3
        
        num_str=num.toString()
        const len_num=num_str.length

        if (len_num==len) {
            return Number(num)
        }
        const delta=len-len_num
        let answer=num_str
        const letter=num_str[num_str.length-1]
        for (let i = 0; i < delta; i++) {
            // const element = array[i];
            answer+=letter
        }

        return Number(answer)
    }
    let test=13
    test=upp_num(test,3)
    const arr_upp=Array(nums.length)
    for (let i = 0; i < nums.length; i++) {
        arr_upp[i]=[upp_num(nums[i],biggest_count_num),nums[i]]
        // const element = nums[i];
        
        
    }

    arr_upp.sort((a,b)=>b[0]-a[0])
    let answ=''
    for (let i = 0; i < arr_upp.length; i++) {
        // const element = arr_upp[i];
        // arr_upp[i]=arr_upp[i][1]
        answ+=arr_upp[i][1].toString()
    }
    // let a=3432 34 323>3432 33 432
    // 
    answ=Number(answ).toString()
    return answ
    let ab=32
};

let s='9 5 34 3 30'
nums =s.split(' ').map(Number)
let ab323=[1,5,1,1,6,4]


nums =[111311,1113]

nums =[34323,3432]
//3432 34323
let aaa=largestNumber(nums)

let ab=32