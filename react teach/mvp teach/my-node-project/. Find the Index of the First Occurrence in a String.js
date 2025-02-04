/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function check_needle(haystack,needle,i) {
    for (let j = 0; j < needle.length; j++) {
        const element = needle[j];
        if (needle[j]!=haystack[i+j]){
            return false
        }
    }
    return true
}
var strStr = function(haystack, needle) {
    if (haystack.length < needle.length) {//услвоие которое от beat 13% дало мне beat 100%
        return -1;
    }
    first=needle[0]
    for (let i = 0; i < haystack.length; i++) {
        if (first==haystack[i]){
            if (check_needle(haystack,needle,i)) {
                return i
            }

        }
        const element = haystack[i];
        
    }   
    return -1

};