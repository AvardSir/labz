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
// еще memo нужна
    for (let i = 0; i < tiles.length; i++) {
        const element = tiles[i];
        for (let j = i; j < tiles.length; j++) {
            const element = tiles[j];
            const need_check=tiles.slice(i,j+1)

            
        }
        
    }
};




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
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const element = dict[key];
            res=res/factorial(element)
        }
    }
    return res
    
    

}

let ab=check_arr_str('abc')

let aaa=32
