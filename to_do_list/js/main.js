var arr_note = [];
let count = 0;

function add_but() {
    count++;
    let newButton = document.createElement('div');
    newButton.innerHTML = `
        <div class="container" id="container_2">
            <h1 class="title">Название записи ${count}
                <div class="cute-checkbox">
                    <input type="checkbox" id="cuteCheckbox${count}">
                    <label for="cuteCheckbox${count}"></label>
                </div>
            </h1>
            <p class="content">
                Это содержимое записи. Здесь можно добавить текст, который будет отображаться в записи. Фон белый, 
                а текст имеет светлый серый цвет для контраста. Ширина записи ограничена для лучшего отображения на 
                экране. Вы можете заменить этот текст на свой собственный, сохраняя структуру и оформление.
            </p>
            <button class="button add_button">Добавить</button>
            <button class="button del_button">Удалить</button>
        </div>`;

    // Удаление записи при нажатии на кнопку "Удалить"
    let delButton = newButton.querySelector('.del_button');
    delButton.addEventListener('click', () => {
        newButton.remove();
    });

    // Вставка новой записи в контейнер
    const container = document.getElementById('container_parent');
    container.appendChild(newButton);

    // Добавление функционала для редактирования текста при наведении
    let content = newButton.querySelector('.content');
    content.addEventListener('mouseenter', () => makeEditable(content));

    // Добавление обработчика события для кнопки "Добавить" внутри каждой записи
    let addButton = newButton.querySelector('.add_button');
    addButton.addEventListener('click', add_but);
}

function makeEditable(element) {
    element.setAttribute('contenteditable', 'true');
    element.focus();

    // Убираем редактирование при потере фокуса
    element.addEventListener('blur', () => {
        element.removeAttribute('contenteditable');
    });
}

// Добавляем обработчик события на ссылку "Создать запись"
document.getElementById('create_note').addEventListener('click', (e) => {
    e.preventDefault(); // Отменяем стандартное поведение ссылки
    add_but();
});

// Создаем первую запись при загрузке страницы
add_but();
