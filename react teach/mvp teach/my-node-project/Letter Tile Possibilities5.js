var numTilePossibilities = function(tiles) {
    let counts = Array(26).fill(0);
    for (let c of tiles) {
        counts[c.charCodeAt(0) - 'A'.charCodeAt(0)]++;
    }
    let fac = Array(tiles.length + 1).fill(1);
    for (let i = 1; i <= tiles.length; i++) {
        fac[i] = i * fac[i - 1];
    }
    
    let lengthcounts = Array(tiles.length + 1).fill(0);
    lengthcounts[0] = 1;
    memo_temo_arr=[]
    for (let i = 0; i < 26; i++) {
        if (counts[i] > 0) {
            let temp = Array(tiles.length + 1).fill(0);
            for (let j = 0; j <= tiles.length  > 0; j++) {
                
                    let totallength = j +1
                    let prev_lengthcounts=lengthcounts[j]
                    let fac_totallength=fac[totallength]
                    
                    let fac_j=fac[j]
                    let all=lengthcounts[j] * fac[totallength] / ( fac[j])
                    temp[totallength] += lengthcounts[j] * totallength;
                
            }
            let ab=32
            memo_temo_arr.push(temp)
            for (let j = 0; j <= tiles.length; j++) {
                lengthcounts[j] += temp[j];
            }
            let stop=32
        }
        
    }
    return lengthcounts.reduce((acc, val, idx) => acc + (idx > 0 ? val : 0), 0);
};

tiles ="AAABBC"
tiles='AAB'
tiles='AACD'
tiles='AAB'
let aaa =numTilePossibilities(tiles) 
let arr=[0,0]
let ab32='a'.charCodeAt(0)-'A'.charCodeAt(0)
let ab=321