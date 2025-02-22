/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
    if (gas.length!=cost.length || gas.length<1) {
     return -1   
    }
    if (gas.length==1) {
        return 0
    }

    
    function max_subArray(delta) {
        let max_sum=delta[0]
        
        let cur_sum=0

        let max_index=0
        let cur_index=0
        for (let i = 0; i < delta.length; i++) {
            // const element = delta[i];
            if (cur_sum<0) {
                cur_sum=0
                cur_index=i
            }
            cur_sum+=delta[i]
            if (max_sum<cur_sum) {
                max_sum=cur_sum
                if (max_index!=cur_index) {
                    max_index=cur_index
                }
            }
            // delta[i]=
            
        }
        return [max_index,cur_index]
    }
    let delta=Array(gas.length)
    for (let i = 0; i < delta.length; i++) {
        delta[i]=gas[i]-cost[i]
        // const element = delta[-i];
        
    }
    function swap(test_string,last_ind) {
        return [...test_string.slice(last_ind),...test_string.slice(0,last_ind)]
    }
    let test_string='2 2 -33 5 -3 2'.split(' ').map(Number)
    function remake_str(test_string) {
        let [max_ind, last_ind] = max_subArray(test_string);

        const test1 = test_string.slice(last_ind);
        const test2 = test_string.slice(0, last_ind);
        test_string = [...test1, ...test2];
        return test_string
    }
    delta=[1,2,-3,4]
    delta=remake_str(delta)
    let tank=0
    for (let i = max_subArray_delta; i < gas.length; i++) {

        tank+=gas[i]
        tank-=cost[i]
        if (tank<0) {
            return -1
        }
        const element = gas[i];

        
    }
    // for (let i = 0; i < max_subArray_delta; i++) {
    //     const element = array[i];
        
    // }


    return 32
};

gas = [1,2,3,4,5]

cost = [3,4,5,1,2]

let aaa=canCompleteCircuit(gas, cost) 

let ab=32