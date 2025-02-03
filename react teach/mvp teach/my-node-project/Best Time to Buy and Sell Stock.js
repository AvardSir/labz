/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // dif=[[]]
    const n = prices.length; // Количество строк
    const m = prices.length; // Количество столбцов

    const dif = Array.from({ length: n }, () => Array(m).fill(0));
    for (let i = 0; i < prices.length - 1; i++) {
        const element = prices[i];
        for (let j = i + 1; j < prices.length; j++) {
            const element = prices[j];
            if (i != j && prices[i] < prices[j]) {
                dif[i].push(prices[j] - prices[i]);
            }
        }
    }
    for (let i = 0; i < dif.length; i++) {
        const element = dif[i];
        dif[i] = Math.max(...dif[i]);
    }
    const answer = Math.max(...dif);
    return answer;
};

// Пример использования
const prices = [7, 4, 5, 3, 2, 4];
const result = maxProfit(prices);
console.log(result); // Вывод: 5 (покупка по 1 и продажа по 6)
