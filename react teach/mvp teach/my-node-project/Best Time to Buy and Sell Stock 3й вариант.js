/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let prices_and_indexes=[]
    for (let i = 0; i < prices.length; i++) {
        prices_and_indexes.push([prices[i],i])
        const element = prices[i];
        
    }

    prices_and_indexes.sort()
    let len=prices_and_indexes.length

    let max=prices_and_indexes[len-1]
    let max_time=prices_and_indexes[len-1][1]
    let max_index=len-1

    let min=prices_and_indexes[0]
    let min_time=prices_and_indexes[0][1]
    let min_index=0

    let dif_min=prices_and_indexes[1][0]-prices_and_indexes[0][0]
    let dif_max=prices_and_indexes[len-1][0]-prices_and_indexes[len-2][0]
    function next_min(min_index) {
        return prices_and_indexes[min_index+1]
    }
    function next_dif_min(dif_min,min_index) {
        return dif_min+prices_and_indexes[min_index+1][0]
        
    }
    function next_max(max_index) {
        return prices_and_indexes[max_index+1]
    }
    function next_dif_max(dif_max,max_index) {
        return dif_max+prices_and_indexes[max_index+1][0]
        
    }
    while (true){
        if (max_time<min_time){
            //когда пародокс времени
            if (dif_min<dif_max)//кога минимально меняя мы теряем меньше
                {
                min=next_min(min_index)
                dif_min=next_dif_min(dif_min,min_index)
                min_index++
            }//кога максимальное меняя мы теряем меньше
            else{
                max=next_max(max_index)
                dif_max=next_dif_max(dif_max,max_index)
                max_index++
            }
            //случай када dif min=dif max
            if (dif_max==dif_min){
                // мы должны сначала подвинуть мин, сравнить с нынешним макс
                //затем подвинуть temp_max сравнить с нынешним мин.
                //если и то и то неправда то 
                min=next_min(min_index)
                dif_min=next_dif_min(dif_min,min_index)
                min_index++

            }
        }


        if (i>=prices.length*prices.length){
            return 0
        }
    }

};

// Пример использования
const prices = [7, 4, 5, 3, 6, 0];
const result = maxProfit(prices);
console.log(result); // Вывод: 5 (покупка по 1 и продажа по 6)
