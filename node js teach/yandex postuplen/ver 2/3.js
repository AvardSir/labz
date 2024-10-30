const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let n, m;
let connections = [];
let isInputParsed = false;

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

rl.on('close', () => {
  console.log(countMovedWeights(n, connections));
});

function countMovedWeights(n, connections) {
  if (n === 0) return 0; // Проверка на случай, если n равно 0

  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of connections) {
    graph[a].push(b);
    graph[b].push(a);
  }

  const visited = new Array(n + 1).fill(false);
  const queue = [1]; // Убедитесь, что 1 - это корректный начальный узел
  visited[1] = true;
  let count = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    count++;

    for (const neighbor of graph[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }

  return count;
}
