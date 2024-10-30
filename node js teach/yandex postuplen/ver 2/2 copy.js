const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let n, m;
let connections = [];
let isInputParsed = false;

function readInput() {
  rl.on('line', (line) => {
    if (!isInputParsed) {
      [n, m] = line.split(' ').map(Number);
      isInputParsed = true;
    } else {
      const [a, b] = line.split(' ').map(Number);
      connections.push([a, b]);
    }

    if (connections.length === m) {
      rl.close();
    }
  });
}

function countMovedWeights(n, connections) {
  const visited = new Array(n + 1).fill(false);
  let queue = [1];
  visited[1] = true;
  let count = 0;

  while (queue.length > 0) {
    const nextQueue = []; // Временная очередь для следующего уровня итерации

    for (const current of queue) {
      count++;

      // Проходим по всем соединениям, проверяя связи с текущим грузиком
      for (const [a, b] of connections) {
        if (a === current || b === current) {
          const [start, end] = [Math.min(a, b), Math.max(a, b)];

          for (let i = start; i <= end; i++) {
            if (!visited[i]) {
              visited[i] = true;
              nextQueue.push(i); // Добавляем в очередь следующего уровня
            }
          }
        }
      }
    }

    queue = nextQueue; // Переходим на следующий уровень итерации
  }

  return count;
}

readInput();

rl.on('close', () => {
  console.log(`${countMovedWeights(n, connections)}`);
});
