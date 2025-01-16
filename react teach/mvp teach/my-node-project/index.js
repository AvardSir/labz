arr=[1,2,3,4]

target=3
function upperBound(arr,target) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (i>target){
            return i
        }
        return arr.length-1
        
    }
    
}

console.log('2')
console.log(upperBound(arr,target))