/**
 * @param {string} tiles
 * @return {number}
 */
var numTilePossibilities = function(tiles) {
        
    function factorial(n) {
        if (n < 0) {
            return undefined; // Факториал не определен для отрицательных чисел
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i; // Умножаем результат на текущее число
        }
        return result;
    }
        
    function check_arr_str(arr_str) {
        // должна возвращать количество сочетаний
        const dict={}
        for (let i = 0; i < arr_str.length; i++) {
            const element = arr_str[i];
            if (element in dict ) {
                dict[element]++
            }
            else
            {
                dict[element]=1
            }
            
        }
        let res=factorial(arr_str.length)

        for (const key in dict) {
            if (Object.prototype.hasOwnProperty.call(dict, key)) {
                const element = dict[key];
                res=res/factorial(element)
            }
        }
        return res
        
        

    }
    const dict_letters_out={}
    //превращаем строку с словарь символов, где значение это количество вхождения это символа
    for (let i = 0; i < tiles.length; i++) {
        const element = tiles[i];
        if (element in dict_letters_out ) {
            dict_letters_out[element]++
        }
        else
        {
            dict_letters_out[element]=1
        }
        
    }

    let n=tiles.length
    len=1
    // cur_tiles
    function sort_String(str) {
        return str.split('').sort().join('')
    }
    // let cheStr='cba'
    // cheStr=sort_String(cheStr)
    
    const memoSet_out=new Set()
    let count=0
    function recursion(cur_tiles,len,dict_letters) {
        

        for (const key in dict_letters) {
            if (Object.prototype.hasOwnProperty.call(dict_letters, key)) {
                
                if (dict_letters[key]!=0) {
                    
                    const element = cur_tiles+key
                    const element_sort = sort_String(element)
                    if (!memoSet_out.has(element_sort)) {
                        memoSet_out.add(element_sort)
                        count+=check_arr_str(element_sort)
                    }
                    dict_letters[key]--
                    recursion(element,len+1,dict_letters)
                    dict_letters[key]++
                }
            }
        }
        return 


    
    }
    recursion('',0,dict_letters_out)

    
    
    return count
    
};


let tiles ="ABA"
tiles ="AAABBC"
let aaaa=numTilePossibilities(tiles) 


tiles ="AAABBC"



let aaa=32