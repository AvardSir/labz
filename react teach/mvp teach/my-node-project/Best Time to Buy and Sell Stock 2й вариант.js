/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let max_profit = 0;
    let profit = 0;
    for (let i = 0; i < prices.length - 1; i++) {
        const element = prices[i];
        for (let j = i + 1; j < prices.length; j++) {
            const element = prices[j];
            if (i != j && prices[i] < prices[j]) {
                profit = prices[j] - prices[i];
                if (max_profit < profit) {
                    max_profit = profit; // Исправлено на max_profit
                }
            }
        }
    }
    return max_profit;
};

// Пример использования
const prices = [7, 4, 5, 3, 6, 0];
const result = maxProfit(prices);
console.log(result); // Вывод: 5 (покупка по 1 и продажа по 6)
