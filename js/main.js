// ааа

// аааа
// document.write('lollollollollollollollollollol'); Добавляет строку к html
// console.log('Привет всем пишу из файла')
// console.log('Привет всем log'); //Выводит в консоль
// console.info('Привет всем info'); //Тоже выводит в консоль но через метод инфо, не знаю разницу наверно она есть
// console.error('Ошибка в том что я ошибся') // вывод в консоль информации о том что есть ошибка и Поэтому ошибочное оформление
// console.warn('Предупреждаю') // разница с ошибкой что Ошибка не дает работать скрипту а варнинг дает. Т.е.  warn= предупреждение

// var a=0
// var b=0
// b++
// a+=3
// var c=a+b;
// const pi=3.14;
// console.log(c)
// console.log(Math.PI)


//         if (5+3==8 ){
//             console.log('(5+3==8)');
//         }
//         if (5+3==8 && 3+3==6){ //оператор и 
//             console.log('(5+3==8 && 3+3==6)');
//         }
//         if (5+3==55555 || 3+3==6){ //оператор или 
//             console.log('(5+3==55555 || 3+3==6)');
//         }



//         wiseguy=true
//         if (wiseguy){
//     console.log('wiseguy')
// }

// let day = 2; // 0 - Пн, 1 - Вт, 2 - Ср, ...//лет это как вар только определена внутри своего блока кода И только. Плюс она лишь раз может объвиться ПЛЮС
// switch (day) {
//     case 0:
//         console.log("Понедельник");
//         break;
//     case 1:
//         console.log("Вторник");

//         break;
//     case 2:
//         console.log("Среда");
//         break;
//     default:
//         console.log("Неизвестный день");
// }

// arr=[23,4,5,'rptin',true]
// console.log(arr)
// arr[4]=false
// if (arr[4]){
//     console.log('arr[4]==true')
// }
// else {
//     console.log('arr[4]==false')
// }

// console.log(arr.length)

// for (let i = 0; i < 10; i++) {

//     console.log(i)
// }
// arr.forEach(element => {
//     console.log(element)
// });
// for (const i in arr) {
//     console.log(i)
//     console.log(arr[i])
// }
// console.log('for (const i of arr) {')
// for (const i of arr) {
//     console.log(i)
// }
// i=0
// while (i!=10) {
//     i++
//     console.log(i)
// }

//alert('что за день')//вспливающее простое окно
// let a =prompt('Сколько минут в часах:')
// if (a==60){
//     alert('Вы правы')

// }
// else{
//     alert('вы не правы')
// }
// if (confirm('Что потверщдить?')){
//     alert('потвердили')
// }
// else{
//     alert('НЕ потвердили')
// }
// function sum(a, b) {
//     return a + b
// }
// let a = 2
// function print_hi() {

//     for (let i = 0; i < 10; i++) {

//         console.log('helo')

//     }

// }

// console.log(sum(a, b))
// print_hi()
// print_hi()
// print_hi()
// a++
// b = a
// a++
// b = a
var col=true
function buton_fun(el) {
    console.log('Кнопка нажата');
    if (col){
        el.style.background="red";
        col=false
    }
    else{
        el.style.background="#17e4eb"
        col=true
    }
    
}
let Заг=document.getElementById('Заголовок');
Заг.style.color='red'
Заг.style.background="#17e4eb"
Заг.innerHTML='Привеет'
console.log(Заг.id)