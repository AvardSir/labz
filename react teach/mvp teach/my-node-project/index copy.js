// console.log('ff')

/**
 * @param {string} s
 * @return {boolean}
 */

// console.log(good_bracket)
var isValid = function(s) {
    let right_bracket=[')',']','}']
let left_bracket=['(','[','{']

const bracket_dict={}
for (let i = 0; i < right_bracket.length; i++) {
    const element = right_bracket[i];
    bracket_dict[left_bracket[i]]=right_bracket[i]
}

// console.log(bracket_dict)
cache=[]
for (let i = 0; i < s.length; i++) {
    const element = s[i];
    if (right_bracket.includes(element) && cache[cache.length-1]!=element){

        return false
    }
    if (right_bracket.includes(element) && cache[cache.length-1]==element){
        s[i]='|'
        cache.pop();
    }
    if (left_bracket.includes(element)){
        cache.push(bracket_dict[element])
    }
}
return true
};


s='(([(]))'

console.log(isValid(s))