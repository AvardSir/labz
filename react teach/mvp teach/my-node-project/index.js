

/**
 * @param {string} s
 * @return {boolean}
 */

// console.log(good_bracket)
var isValid = function(s) {
    let bad_bracket=[')',']','}']
let good_bracket=['(','[','{']

const bracket_dict={}
for (let i = 0; i < bad_bracket.length; i++) {
    const element = bad_bracket[i];
    bracket_dict[good_bracket[i]]=bad_bracket[i]
}

// console.log(bracket_dict)
cache=[]
    for (let i = 0; i < s.length; i++) {
        const element = s[i];
        if (bad_bracket.includes(element) && cache[cache.length-1]!=element){

            return false
        }
        if (bad_bracket.includes(element) && cache[cache.length-1]==element){
            s[i]='|'
            cache.pop();
        }
        if (good_bracket.includes(element)){
            cache.push(element)
        }
    }
    return true
};


console.log(isValid('()'))