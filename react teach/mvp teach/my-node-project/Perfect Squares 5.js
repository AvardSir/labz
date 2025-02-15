function numSquares(n){
    let dp= new Array(n + 1).fill(Number.MAX_SAFE_INTEGER);
    dp[0] = 0; // 0 квадратов для 0

    let count = 1;
    while (count * count <= n) {
        let sq= count * count;
        for (let i = sq; i <= n; i++) {
            dp[i] = Math.min(dp[i], dp[i - sq] + 1);
        }
        count++;
    }
    return dp[n];
}