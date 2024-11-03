function countMovedWeights(n, connections) {
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of connections) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Set();
  const queue = [1];
  visited.add(1);
  let count = 0;
// jqjqj
// Не сегодня
// эххх не сейчас
// еххе
  while (queue.length > 0) {
    const current = queue.shift(); // Извлекаем из начала очереди
    count++;

    for (const neighbor of graph[current]) {
      const [start, end] = [Math.min(current, neighbor), Math.max(current, neighbor)];

      for (let i = start; i <= end; i++) {
        if (!visited.has(i)) {
          visited.add(i);
          queue.push(i);
        }
      }
    }
  }

  return count;
}



function testInput(testCases) {
  let failedTests = 0;

  for (const test of testCases) {
    const result = countMovedWeights(test.n, test.connections);
    const expected = test.expected;

    if (result === expected) {
      console.log("\x1b[32m✔️ Тест пройден успешно!\x1b[0m");
    } else {
      console.log("\x1b[31m❌ Тест не пройден!\x1b[0m");
      failedTests++;
    }
    console.log(`Ввод: ${test.n} грузиков и ${test.connections.length} нитей => Вывод: ${result}, Ожидаемый: ${expected}\n`);
  }

  console.log(`Количество проваленных тестов: ${failedTests}`);
}

const testCases = [
  { n: 5, connections: [[1, 3], [2, 4]], expected: 4 }, // Пример 1
  { n: 1000, connections: [[1, 100], [100, 200], [200, 300], [300, 400], [350, 421]], expected: 421 }, // Пример 2
  { n: 5, connections: [[1, 4], [2, 3]], expected: 4 },
  { n: 5, connections: [[1, 5], [2, 3]], expected: 5 },
];

// Запуск тестов
testInput(testCases);
