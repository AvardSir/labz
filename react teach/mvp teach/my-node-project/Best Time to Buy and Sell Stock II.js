var maxProfit = function(prices) {
    let min_price=prices[0]
    let max_profit=0
     for (let i = 1; i < prices.length; i++) {

        // const element = prices[i];

        if (prices[i]<prices[i-1]){
            max_profit=max_profit+(prices[i-1]-min_price)
            min_price=prices[i]
            
        }
        // min_price=Math.min(prices[i],min_price)
        // max_profit=Math.max(max_profit,prices[i]-min_price)
     }
    
    max_profit=max_profit+(prices[prices.length-1]-min_price)
    //  if (prices[prices.length-1]>prices[prices.length-2] &&max_profit==0){
    //     console.log(max_profit)
    //     return prices[prices.length-1]-prices[0]
    //  }
     return max_profit
};

var prices=[7,1,5,3,6,4]
//надо 7
let aaaaa= maxProfit(prices)



let ab=3223