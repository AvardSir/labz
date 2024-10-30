const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (input) => {
    const [num1, num2] = input.split(' ').map(Number);
    console.log(num1 + num2);
    rl.close();
});
