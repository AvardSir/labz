/**
 * @param {{
*  graph: Record<string, string[]>,
*  startVertex: string,
*  endVertex: string,
* }}
* @returns {string[]}
*/
module.exports = function solution({ graph, startVertex, endVertex }) {
    if (!graph || typeof graph !== 'object' || Object.keys(graph).length === 0 || !startVertex || !endVertex) {
      return [];
    }
  
    if (startVertex === endVertex) return [startVertex];
  
    const queue = [[startVertex]];
    const visited = new Set();
  
    while (queue.length > 0) {
      const path = queue.shift();
      const vertex = path[path.length - 1];
  
      if (visited.has(vertex)) continue;
  
      visited.add(vertex);
  
      if (vertex === endVertex) return path;
  
      for (const neighbor of graph[vertex] || []) {
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  
    return [];
  };

// Примеры использования:

// Пример 1
// Пример с отсутствием startVertex в графе
const example4 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"]
    },
    startVertex: "A",
    endVertex: "C",
  };
  console.log(module.exports(example4)); // Ожидаемый вывод: []
  
  // Пример с совпадающими startVertex и endVertex
  const example5 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"]
    },
    startVertex: "A",
    endVertex: "A",
  };
  console.log(module.exports(example5)); // Ожидаемый вывод: ["A"]
  
  // Пример с дубликатами соседей
  const example6 = {
    graph: {
      A: ["B", "B"],
      B: ["A", "C"],
      C: ["B"]
    },
    startVertex: "A",
    endVertex: "C",
  };
  console.log(module.exports(example6)); // Ожидаемый вывод: ["A", В, "C"]
  
  // Пример с плотным графом (проверка устойчивости к большим данным)
  const example7 = {
    graph: {
      A: ["B", "C"],
      B: ["A", "C", "D"],
      C: ["A", "B", "D"],
      D: ["A", "B", "C"]
    },
    startVertex: "A",
    endVertex: "D",
  };
  console.log(module.exports(example7)); // Ожидаемый вывод: ["A", "D"] или другой кратчайший путь
  
  // Пример с направленными связями, где путь существует
const example9 = {
    graph: {
      A: ["B"],
      B: ["C"],
      C: ["A"] // C указывает на A, но A не указывает на C
    },
    startVertex: "A",
    endVertex: "C",
  };
  console.log(module.exports(example9)); // Ожидаемый вывод: ["A", "B", "C"]
  
  // Пример с направленными связями, где путь отсутствует
  const example10 = {
    graph: {
      A: ["B"],
      B: [],
      C: ["A"] // C указывает на A, но A не указывает на C
    },
    startVertex: "A",
    endVertex: "C",
  };
  console.log(module.exports(example10)); // Ожидаемый вывод: []
  const example11 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"],
      D: [] // Изолированная вершина
    },
    startVertex: "A",
    endVertex: "D",
  };
  console.log(module.exports(example11)); // Ожидаемый вывод: []
    
  // Граф с изолированной вершиной
const example12 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"],
      D: [] // Изолированная вершина
    },
    startVertex: "A",
    endVertex: "D",
  };
  console.log(module.exports(example12)); // Ожидаемый вывод: []
  
  // Пустой граф
  const example13 = {
    graph: {},
    startVertex: "A",
    endVertex: "B",
  };
  console.log(module.exports(example13)); // Ожидаемый вывод: []
  
  // Тест с отсутствующим начальным или конечным узлом
const example14 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"]
    },
    startVertex: "A",
    endVertex: "Z", // Вершина "Z" отсутствует
  };
  console.log(module.exports(example14)); // Ожидаемый вывод: []
  
  // Тест с пустым графом и неопределенными startVertex и endVertex
  try {
    console.log(module.exports({ graph: {}, startVertex: undefined, endVertex: undefined }));
    // Ожидаемый вывод: пустой массив или ошибка, если входные данные неверны
  } catch (error) {
    console.error("Ошибка:", error);
  }
  
  // Тест с неверными именами узлов (регистр символов)
  const example15 = {
    graph: {
      A: ["B"],
      B: ["A", "C"],
      C: ["B"]
    },
    startVertex: "A", // "a" с маленькой буквы не совпадает с "A"
    endVertex: "C",
  };
  console.log(module.exports(example15)); // Ожидаемый вывод: []
  