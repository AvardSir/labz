class note{
    constructor(name,text){
        this.name=name
        this.text=text
    }
}
var arr_note;
function add_noet(el) {
    let ell=document.getElementById('el')//элемент id?
    let text=ell.childNodes[3]
    let title=ell.childNodes[1]

    arr_note.push(new note())
}
let count=0;
function add_but() {
    count++
    let newButton = document.createElement('text');
    newButton.innerHTML = `<div class="container" id="container_2">
            <h1 class="title">Название записи ${count} 
           <div class="cute-checkbox">
    <input type="checkbox" id="cuteCheckbox${count} ">
    <label for="cuteCheckbox${count} "></label>
    
  </div> 
  </h1>
  
        
            <p class="content">
                Это содержимое записи. Здесь можно добавить текст, который будет отображаться в записи. Фон белый, 
                а текст имеет светлый серый цвет для контраста. Ширина записи ограничена для лучшего отображения на 
                экране. Вы можете заменить этот текст на свой собственный, сохраняя структуру и оформление.
            </p>
            
            <button class="button" id="add_button">Добавить</button>
            <button class="button" id="del_button">Удалить</button>
            <button class="button" id="change_button">Изменить</button>
        </div>`;


    
    
    //del but=[7]
    let del_buttonn=newButton.childNodes[0].childNodes[7]
    del_buttonn.addEventListener('click', () => {
        del_buttonn.parentNode.parentNode.remove()
        console.log(del_buttonn.parentNode.parentNode)
      });

    add_buton=newButton.childNodes[0].childNodes[5]
    add_buton.addEventListener('click', () => {
      add_but();
    });

    // Вставка кнопки в контейнер
    const container = document.getElementById('container_parent');
container.appendChild(newButton);

//change_but
const convertButton = document.getElementById('change_button');
let isConverted = false;

convertButton.addEventListener('click', () => {
    // Функция для перевода элемента в textarea
    function convertToTextarea(element) {
        const textarea = document.createElement('textarea');
        textarea.value = element.textContent;
        textarea.className = 'editable-input';
        textarea.dataset.originalTag = element.tagName.toLowerCase();
        textarea.dataset.originalClass = element.className; // Сохраняем классы оригинального элемента
        textarea.dataset.originalStyle = element.style.cssText; // Сохраняем инлайн-стили

        // Применяем инлайн-стили к textarea, чтобы сохранить оформление
        textarea.style.cssText = element.style.cssText;

        // Функция для автоматического изменения размера textarea
        function autoResizeTextarea(textarea) {
            textarea.style.width = '80%';
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        // Изменение размера при первоначальном создании и при вводе текста
        autoResizeTextarea(textarea);
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));

        return textarea;
    }

    // Функция для перевода элемента textarea обратно в p или h1
    function convertToText(element) {
        const tag = element.dataset.originalTag;
        const textElement = document.createElement(tag);
        textElement.textContent = element.value;
        textElement.className = element.dataset.originalClass; // Восстанавливаем классы
        textElement.style.cssText = element.dataset.originalStyle; // Восстанавливаем инлайн-стили
        return textElement;
    }

    if (!isConverted) {
        // Переводим все h1 и p в textarea
        document.querySelectorAll('h1, p').forEach(element => {
            const textarea = convertToTextarea(element);
            element.replaceWith(textarea);
        });
        convertButton.textContent = 'Перевести обратно';
    } else {
        // Переводим все textarea обратно в p или h1
        document.querySelectorAll('textarea.editable-input').forEach(textarea => {
            const textElement = convertToText(textarea);
            textarea.replaceWith(textElement);
        });
        convertButton.textContent = 'Перевести в input';
    }

    isConverted = !isConverted;
});

}

add_but();//ne to do homeworks
//nono//nono