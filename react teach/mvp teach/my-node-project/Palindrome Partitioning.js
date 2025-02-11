/**
 * @param {string} s
 * @return {string[][]}
 */

// не смог решит
// var partition = function(s) {
//     //в теории надо идти половину строки 

//     function isPolindrim(s) {
//         if (s.length==1){return true}
//         const len_half=Math.floor(s.length/2)
//         const len_s=s.length
//         for (let i = 0; i < len_half; i++) {
//             // const element = array[i];
//             if(s[i]!=s[len_s-i]){
//                 return false
//             }
//         }
//         return true
//     }

//     let arr=[[]]
//     const len_global=s.length-1
//     // let start=0
//     const len_half=Math.floor(s.length/2)
//     function subPartition(start,s) {
//         const answer=[]
//         for (let i = 0; i <len_mid ; i++) {
//             if (isPolindrim(start+1,s.substring(start,i+1))){

//             }
//             // const element = s[i];
                    
//         }
//     }
//     subPartition(0,s)
// };


var partition = function(s) {
    let res = [];
    let n = s.length;
    
    function isPalindrome(str) {
        if (str.length==1){return true}
        let left = 0;
        let right = str.length - 1;
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    function getAllPartitions(curInd, curList) {
        let isLastPalindrome = isPalindrome(curList[curList.length - 1]);
        if (curInd === n) {
            if (isLastPalindrome) {
                res.push([...curList]);
            }
            return;
        }
        if (isLastPalindrome) {
            curList.push(s[curInd]);
            getAllPartitions(curInd + 1, curList);
            curList.pop();
        }
        curList[curList.length - 1] += s[curInd];
        getAllPartitions(curInd + 1, curList);
        curList[curList.length - 1] = curList[curList.length - 1].slice(0, -1);
    }
    
    getAllPartitions(1, [s[0]]);
    return res;
};


s = "aab"
let aaaa=partition(s)

let aaaba=323