var canCompleteCircuit = function(gas, cost) {
    if (gas.reduce((a, b) => a + b, 0) < cost.reduce((a, b) => a + b, 0)) {
        return -1;
    }

    let currentGas = 0;
    let start = 0;

    for (let i = 0; i < gas.length; i++) {
        currentGas += gas[i] - cost[i];
        if (currentGas < 0) {
            currentGas = 0;
            start = i + 1;
        }
    }

    return start;    
};

gas = [1,2,3,4,5]

cost = [3,4,5,1,2]

let aaa=canCompleteCircuit(gas, cost) 

let ab=32