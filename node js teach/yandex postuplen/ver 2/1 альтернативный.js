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
  const distances = { [startVertex]: 0 }; // Словарь для хранения расстояний до вершин

  while (queue.length > 0) {
      const path = queue.shift();
      const vertex = path[path.length - 1];

      if (visited.has(vertex)) continue;

      visited.add(vertex);

      // Проверяем, если текущая вершина - это конечная
      if (vertex === endVertex) {
          return path; // Возвращаем путь, как только достигли конечной вершины
      }

      for (const neighbor of graph[vertex] || []) {
          const newPath = [...path, neighbor];
          if (!visited.has(neighbor)) {
              // Обновляем расстояние до соседа, если оно еще не установлено
              if (!(neighbor in distances)) {
                  distances[neighbor] = distances[vertex] + 1;
              }
              queue.push(newPath);
          }
      }
  }

  return []; // Если путь не найден
};



// Подключение вашего решения


function runTests() {
  const testCases = [
    // Тест 1
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: ['A', 'B', 'C'],
    },
    // Тест 2
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "A",
        endVertex: "A",
      },
      expected: ["A"],
    },
    // Тест 3
    {
      input: {
        graph: {
          A: ["B", "B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: ["A", "B", "C"],
    },
    // Тест 4
    {
      input: {
        graph: {
          A: ["B", "C", 'D'],
          B: ["A", "C", "D"],
          C: ["A", "B", "D"],
          D: ["A", "B", "C"]
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "D"], // или другой кратчайший путь
    },
    // Тест 5
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["A"] // C указывает на A, но A не указывает на C
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: ["A", "B", "C"],
    },
    // Тест 6
    {
      input: {
        graph: {
          A: ["B"],
          B: [],
          C: ["A"] // C указывает на A, но A не указывает на C
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: [],
    },
    // Тест 7
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"],
          D: [] // Изолированная вершина
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: [],
    },
    // Тест 8
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"],
          D: [] // Изолированная вершина
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: [],
    },
    // Тест 9
    {
      input: {
        graph: {},
        startVertex: "A",
        endVertex: "B",
      },
      expected: [],
    },
    // Тест 10
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "A",
        endVertex: "Z", // Вершина "Z" отсутствует
      },
      expected: [],
    },
    // Тест 11
    {
      input: { graph: {}, startVertex: undefined, endVertex: undefined },
      expected: [],
    },
    // Тест 12
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "a", // "a" с маленькой буквы не совпадает с "A"
        endVertex: "C",
      },
      expected: [],
    },
    // Тест 13
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "A",
        endVertex: "Z", // Вершина "Z" отсутствует
      },
      expected: [],
    },
    // Тест 14
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        startVertex: "a", // "a" с маленькой буквы не совпадает с "A"
        endVertex: "C",
      },
      expected: [],
    },

    // Новые тестовые случаи
    // Тест 15: Путь через несколько вершин
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["A", "D"],
          C: ["A", "D"],
          D: ["B", "C"]
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "B", "D"], // или ["A", "C", "D"]
    },
    // Тест 16: Неполный граф с несколькими путями
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["A"],
          C: ["A", "D"],
          D: ["C"]
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "C", "D"], // путь через C
    },
    // Тест 17: Дерево
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["D", "E"],
          C: ["F"],
          D: [],
          E: [],
          F: []
        },
        startVertex: "A",
        endVertex: "F",
      },
      expected: ["A", "C", "F"],
    },
    // Тест 18: Граф с кольцом
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["A"]
        },
        startVertex: "A",
        endVertex: "B",
      },
      expected: ["A", "B"],
    },
    // Тест 19: Изолированная вершина
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A"],
          C: [] // Изолированная вершина
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: [],
    },
    // Тест 20: Обе вершины отсутствуют
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A"]
        },
        startVertex: "X", // отсутствующая начальная вершина
        endVertex: "Y", // отсутствующая конечная вершина
      },
      expected: [],
    },
    // Тест 21: Граф с петлей
    {
      input: {
        graph: {
          A: ["B", "A"], // петля на A
          B: ["C"],
          C: ["A"]
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: ["A", "B", "C"],
    },
    // Тест 22: Два соединенных компонента
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A"],
          C: ["D"],
          D: ["C"]
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: [], // Невозможно добраться из A в C
    },
    // Тест 23: Граф с несколькими кратчайшими путями
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["A", "D"],
          C: ["A", "D"],
          D: ["B", "C"]
        },
        startVertex: "B",
        endVertex: "C",
      },
      expected: ["B", "A", "C"], // Один из кратчайших путей
    },
    // Тест 24: Путь через изолированную вершину
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["D"],
          D: [],
          E: [] // Изолированная вершина E
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "B", "C", "D"],
    },
    // Тест 25: Граф с самоссылающейся вершиной
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C", "B"], // B указывает на себя
          C: ["A"]
        },
        startVertex: "A",
        endVertex: "B",
      },
      expected: ["A", "B"],
    },
    // Тест 26: Путь к самой себе с несколькими переходами
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["D"],
          D: ["A"] // Цикл
        },
        startVertex: "A",
        endVertex: "A",
      },
      expected: ["A"],
    },
    // Тест 27: Граф с несколькими изолированными компонентами
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A"],
          C: [],
          D: ["E"],
          E: ["D"]
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: [],
    },
    // Тест 28: Граф с неполным путем
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["A"],
          C: ["A"]
        },
        startVertex: "B",
        endVertex: "C",
      },
      expected: ["B", "A", "C"],
    },
    // Тест 29: Один путь с одним ребром
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["D"],
          D: []
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "B", "C", "D"],
    },
    // Тест 30: Граф с несколькими путями, но один из них заблокирован
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: [""],
          C: ["D"], // Путь от C к D
          D: []
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ['A','C','D'],
    },
    // Тест 31: Полный граф
    {
      input: {
        graph: {
          A: ["B", "C", "D"],
          B: ["A", "C", "D"],
          C: ["A", "B", "D"],
          D: ["A", "B", "C"]
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "D"], // Один из возможных путей
    },
    // Тест 32: Вершина без исходящих ребер
    {
      input: {
        graph: {
          A: ["B"],
          B: [],
        },
        startVertex: "A",
        endVertex: "B",
      },
      expected: ["A", "B"],
    },
    // Тест 33: Граф с двумя путями, один из которых длиннее
    {
      input: {
        graph: {
          A: ["B", "C"],
          B: ["D"],
          C: ["D"],
          D: [],
        },
        startVertex: "A",
        endVertex: "D",
      },
      expected: ["A", "B", "D"], // Один из возможных путей
    },
    // Тест 34: Граф с циклом
    {
      input: {
        graph: {
          A: ["B"],
          B: ["C"],
          C: ["A"], // Цикл
        },
        startVertex: "A",
        endVertex: "C",
      },
      expected: ["A", "B", "C"],
    },
    // Тест 35: Граф с несколькими изолированными компонентами
    {
      input: {
        graph: {
          A: ["B"],
          B: ["A"],
          C: ["D"],
          D: ["C"],
          E: ["F"],
          F: ["E"],
        },
        startVertex: "A",
        endVertex: "F",
      },
      expected: [],
    },

    // Тест 36: Путь через одну изолированную вершину
    {
      input: {
          graph: {
              A: ["B"],
              B: ["C"],
              C: ["D"],
              D: ["E"],
              E: [], // Изолированная вершина
          },
          startVertex: "A",
          endVertex: "E",
      },
      expected: ["A", "B", "C", "D", "E"],
  },
  // Тест 37: Путь между двумя изолированными компонентами
  {
      input: {
          graph: {
              A: ["B"],
              B: ["A"],
              C: ["D"],
              D: ["C"],
          },
          startVertex: "B",
          endVertex: "C",
      },
      expected: [],
  },
  // Тест 38: Путь с циклом
  {
      input: {
          graph: {
              A: ["B"],
              B: ["C"],
              C: ["A", "D"], // Цикл на A
              D: [],
          },
          startVertex: "A",
          endVertex: "D",
      },
      expected: ["A", "B", "C", "D"],
  },
  // Тест 39: Две пересекающиеся ветки
  {
      input: {
          graph: {
              A: ["B", "C"],
              B: ["D"],
              C: ["D"],
              D: [],
          },
          startVertex: "A",
          endVertex: "D",
      },
      expected: ["A", "B", "D"], // Или ["A", "C", "D"]
  },
  // Тест 40: Граф с несколькими путями
  {
      input: {
          graph: {
              A: ["B", "C"],
              B: ["D"],
              C: ["D", "E"],
              D: [],
              E: [],
          },
          startVertex: "A",
          endVertex: "E",
      },
      expected: ["A", "C", "E"], // Или через D
  },
  // Тест 41: Полный граф с самоссылками
  {
      input: {
          graph: {
              A: ["B", "C"],
              B: ["A", "C"],
              C: ["A", "B", "C"], // Самоссылка на C
          },
          startVertex: "A",
          endVertex: "C",
      },
      expected: ["A", "C"],
  },
  // Тест 42: Граф с петлями и изолированными вершинами
  {
      input: {
          graph: {
              A: ["B"],
              B: ["A", "C"],
              C: ["B", "C"], // Петля на C
              D: [], // Изолированная вершина
          },
          startVertex: "A",
          endVertex: "D",
      },
      expected: [],
  },
  // Тест 43: Граф с несколькими путями и циклом
  {
      input: {
          graph: {
              A: ["B", "C"],
              B: ["D", "A"], // Цикл через A
              C: ["D"],
              D: [],
          },
          startVertex: "A",
          endVertex: "D",
      },
      expected: ["A", "B", "D"], // Или ["A", "C", "D"]
  },
  // Тест 44: Граф, где конечная вершина изолирована
  {
      input: {
          graph: {
              A: ["B"],
              B: ["A"],
              C: ["D"],
              D: [], // Изолированная вершина
          },
          startVertex: "A",
          endVertex: "C",
      },
      expected: [],
  },
   // Тест 45: Граф с несколькими циклами
   {
    input: {
        graph: {
            A: ["B", "C"],
            B: ["A", "D"],
            C: ["A", "D"],
            D: ["B", "C"], // Циклы между B и C
        },
        startVertex: "A",
        endVertex: "D",
    },
    expected: ["A", "B", "D"], // Или ["A", "C", "D"]
},
// Тест 46: Путь с отсутствующей конечной вершиной
{
    input: {
        graph: {
            A: ["B"],
            B: ["C"],
            C: [],
        },
        startVertex: "A",
        endVertex: "D", // D отсутствует
    },
    expected: [],
},
// Тест 47: Граф с двумя независимыми компонентами
{
    input: {
        graph: {
            A: ["B"],
            B: ["A"],
            C: ["D"],
            D: ["C"],
        },
        startVertex: "A",
        endVertex: "C",
    },
    expected: [],
},
// Тест 48: Граф с узловыми пиками
{
    input: {
        graph: {
            A: ["B", "C"],
            B: ["D"],
            C: ["D", "E"],
            D: ["F"],
            E: [],
            F: [],
        },
        startVertex: "A",
        endVertex: "F",
    },
    expected: ["A", "B", "D", "F"], // Или ["A", "C", "D", "F"]
},
// Тест 49: Граф с повторяющимися вершинами
{
    input: {
        graph: {
            A: ["B", "B", "C"],
            B: ["A", "D"],
            C: ["A"],
            D: ["B"],
        },
        startVertex: "A",
        endVertex: "D",
    },
    expected: ["A", "B", "D"],
},
// Тест 50: Дерево с несколькими путями к конечной вершине
{
    input: {
        graph: {
            A: ["B", "C"],
            B: ["D", "E"],
            C: ["E"],
            D: [],
            E: [],
        },
        startVertex: "A",
        endVertex: "E",
    },
    expected: ["A", "B", "E"], // Или ["A", "B", "E"]
},
// Тест 51: Граф, в котором нет путей между двумя вершинами
{
    input: {
        graph: {
            A: ["B"],
            B: ["C"],
            C: [],
            D: ["E"],
            E: [],
        },
        startVertex: "A",
        endVertex: "D",
    },
    expected: [],
},
// Тест 52: Граф с большой компонентой
{
    input: {
        graph: {
            A: ["B", "C"],
            B: ["A", "D"],
            C: ["A"],
            D: ["B", "E"],
            E: ["D", "F"],
            F: ["E"],
            G: [] // Изолированная вершина
        },
        startVertex: "A",
        endVertex: "F",
    },
    expected: ["A", "B", "D", "E", "F"],
},
// Тест 53: Граф с несколькими кратчайшими путями, один из которых длиннее
{
    input: {
        graph: {
            A: ["B", "C"],
            B: ["D"],
            C: ["D", "E"],
            D: [],
            E: [],
        },
        startVertex: "A",
        endVertex: "E",
    },
    expected: ["A", "C", "E"], // Кратчайший путь через C
},

// Тест 54: Путь с именами
{
  input: {
      graph: {
          "Alice": ["Bob", "Charlie"],
          "Bob": ["Alice", "David"],
          "Charlie": ["Alice", "David"],
          "David": ["Bob", "Charlie"],
      },
      startVertex: "Alice",
      endVertex: "David",
  },
  expected: ["Alice", "Bob", "David"], // Или ["Alice", "Charlie", "David"]
},
// Тест 55: Имена с разными регистрами
{
  input: {
      graph: {
          "Alice": ["Bob"],
          "bob": ["Alice", "Charlie"],
          "Charlie": ["bob"],
      },
      startVertex: "Alice",
      endVertex: "Charlie",
  },
  expected: [],
},
// Тест 56: Граф с именами и изолированной вершиной
{
  input: {
      graph: {
          "Eve": ["Frank"],
          "Frank": ["Eve"],
          "Grace": [], // Изолированная вершина
      },
      startVertex: "Eve",
      endVertex: "Grace",
  },
  expected: [],
},
// Тест 57: Путь с именами и множественными соединениями
{
  input: {
      graph: {
          "Hannah": ["Ivy", "Jack"],
          "Ivy": ["Hannah", "Liam"],
          "Jack": ["Hannah", "Liam"],
          "Liam": ["Ivy", "Jack"],
      },
      startVertex: "Hannah",
      endVertex: "Liam",
  },
  expected: ["Hannah", "Ivy", "Liam"], // Или ["Hannah", "Jack", "Liam"]
},
// Тест 58: Граф с именами, где нет пути между вершинами
{
  input: {
      graph: {
          "Mia": ["Nina"],
          "Nina": ["Mia"],
          "Olivia": ["Paul"],
          "Paul": [],
      },
      startVertex: "Mia",
      endVertex: "Olivia",
  },
  expected: [],
},
// Тест 59: Граф с именами и повторяющимися вершинами
{
  input: {
      graph: {
          "Quinn": ["Ryan", "Ryan"],
          "Ryan": ["Quinn", "Sophie"],
          "Sophie": ["Ryan"],
      },
      startVertex: "Quinn",
      endVertex: "Sophie",
  },
  expected: ["Quinn", "Ryan", "Sophie"],
},
// Тест 60: Путь с именами и изменяющимися регистрами
{
  input: {
      graph: {
          "Tina": ["Uma"],
          "uma": ["Tina", "Victor"],
          "Victor": ["Uma"],
      },
      startVertex: "Tina",
      endVertex: "Victor",
  },
  expected: [],
},
// Тест 61: Граф с несколькими путями и именами
{
  input: {
      graph: {
          "Will": ["Xander", "Yara"],
          "Xander": ["Will", "Zane"],
          "Yara": ["Will"],
          "Zane": ["Xander"],
      },
      startVertex: "Will",
      endVertex: "Zane",
  },
  expected: ["Will", "Xander", "Zane"], // Или другой возможный путь
},
// Тест 62: Граф с именами и изолированными компонентами
{
  input: {
      graph: {
          "Amy": ["Brian"],
          "Brian": ["Amy"],
          "Cathy": ["Daniel"],
          "Daniel": ["Cathy"],
      },
      startVertex: "Amy",
      endVertex: "Daniel",
  },
  expected: [],
},
  ];


  let failedTests = 0;

  testCases.forEach(({ input, expected }, index) => {
      const actual = module.exports(input);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          console.log(`Test case ${index + 1} failed:`);
          console.log('Input:', input);
          console.log('Expected:', expected);
          console.log('Actual:', actual);
          console.log('-------------------');
          failedTests++; // Увеличиваем счетчик не пройденных тестов
      } else {
          console.log(`Test case ${index + 1} passed.`);
      }
  });
  
  // В конце выводим количество не пройденных тестов
  console.log(`Total failed tests: ${failedTests}`);
  
}

// Запуск тестов
runTests();
