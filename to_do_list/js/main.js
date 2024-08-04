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

let container_1=document.getElementById('container_1')
let text=container_1.childNodes[3]
let title=container_1.childNodes[1]

console.log(container_1.childNodes[3])
console.log(container_1.childNodes[1])
var count=1
document.getElementById(`add_button`).addEventListener('click', function() {
    
    el=`add_button`
    el=document.getElementById(el)
    console.log(count)
    console.log(el)
    console.log(el.parentElement)
    count++
    code_of_class=`<div class="container" id="container_${count}">
            <h1 class="title">Название записи</h1>
            <p class="content">
                Это содержимое записи. Здесь можно добавить текст, который будет отображаться в записи. Фон белый, 
                а текст имеет светлый серый цвет для контраста. Ширина записи ограничена для лучшего отображения на 
                экране. Вы можете заменить этот текст на свой собственный, сохраняя структуру и оформление.
            </p>
            
            <button class="button" id="add_button" >Добавить</button>
            <button class="button" id="del_button">Удалить</button>
            <button class="button" id="change_button">Изменить</button>
        </div>`
    
    let newElement=el
    el=el.parentElement

    let mainElement=document.getElementById('main-content');
    mainElement.appendChild(newElement);
    
    el.insertAdjacentHTML('afterend', code_of_class);
    document.body.appendChild(newButton);

})
//ненен
//может да может нет
// function add_button(el) {//ЗАБРОШЕНО
//     count++
//     console.log(count)
//     console.log(el)
//     console.log(el.parentElement)
    
//     code_of_class=`<div class="container" id="container_${count}">
//             <h1 class="title">Название записи</h1>
//             <p class="content">
//                 Это содержимое записи. Здесь можно добавить текст, который будет отображаться в записи. Фон белый, 
//                 а текст имеет светлый серый цвет для контраста. Ширина записи ограничена для лучшего отображения на 
//                 экране. Вы можете заменить этот текст на свой собственный, сохраняя структуру и оформление.
//             </p>
            
//             <button class="button" id="add_button_${count}" onclick="add_button()">Добавить</button>
//             <button class="button" id="del_button">Удалить</button>
//             <button class="button" id="change_button">Изменить</button>
//         </div>`
//     let mainElement=document.getElementById('main-content');
//     mainElement.appendChild(newElement);

//     //el=el.parentElement
    
//     //el.insertAdjacentHTML('afterend', code_of_class);

//     // document.write(`<div class="container" id="container_1">
//     //         <h1 class="title">Название записи</h1>
//     //         <p class="content">
//     //             Это содержимое записи. Здесь можно добавить текст, который будет отображаться в записи. Фон белый, 
//     //             а текст имеет светлый серый цвет для контраста. Ширина записи ограничена для лучшего отображения на 
//     //             экране. Вы можете заменить этот текст на свой собственный, сохраняя структуру и оформление.
//     //         </p>
            
//     //         <button class="button" id="add_button" onclick="add_button()">Добавить</button>
//     //         <button class="button" id="del_button">Удалить</button>
//     //         <button class="button" id="change_button">Изменить</button>
//     //     </div>`)



// }
// не сегодня