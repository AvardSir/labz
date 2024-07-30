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
// let Заг=document.getElementById('Заголовок');
// Заг.style.color='red'
// Заг.style.background="#17e4eb"
// Заг.innerHTML='Что как?'
// console.log(Заг.id)
// let p_=document.getElementsByTagName('p')
// //p_.style.setProperty("font-size" , "200px");

// //p_.style.background="#17e4eb"
// for (const i of p_) {
    
//     //i.style.setProperty("font-size" , "200px");
// }
// let _leftbar=document.getElementsByClassName('Leftbar')
// for (const i of _leftbar) {
//     //console.log(i)
//     //i.style.setProperty("font-size" , "200px");
// }

function ready_click(el) {
    let name=document.getElementById('name')
    let repass=document.getElementById('repass')
    let pass=document.getElementById('pass')
    const state=document.querySelector('input[name="state"]:checked')
    let fail=document.getElementById('fail')

    fail.innerHTML=''
    if (state==null){console.log('Выбери пол')
        fail.innerHTML+='Выбери пол<br>'
    }
    if (typeof name.value !== "string" || name.value=='') {
        console.log('В имени ошибка')
        fail.innerHTML+='В имени ошибка<br>'
    } 
    
    // console.lo
    //(name.value)
    // console.log(pass.value)
    // console.log(repass.value)
    console.log(state.value)

    if (typeof name.value !== "string" ) {
        console.log('В пароле ошибка')
        fail.innerHTML+='В пароле ошибка<br>'
    } 
    
    
    if (pass.value!=repass.value) {
        fail.innerHTML+='Пароли не сходятся<br>'

        console.log('Пароли не сходятся')
    }
    if (fail.innerHTML==''){window.location='https://sp.freehat.cc/episode/season-26/'}
    

}

// function fun() {
//     console.log('фан')
//     count_1++
//     if (count_1==2){clearInterval(inter_1)}
// }
// let count_1=0
// let inter_1=setInterval(fun, 1000)
// setInterval(function () {
//     console.log('фан ананомный')
// },1000)

// setTimeout(() => {
//     console.log('Таймер сработал')
// }, 1000);

// let data=new Date();
// console.log(data.getFullYear())
// data.setFullYear(10)
// console.log(data.getFullYear())
class person{
    constructor(name,hp,atack){
        this.name=name
        this.hp=hp
        this.atack=atack
    }
     atack_someone(who_under_atack) {
        who_under_atack.hp-=this.atack
        if (who_under_atack.hp<=0){
            console.log(who_under_atack.name+' убит')
        }
    }
}
let per=new person('Bob',10,10)
let ork1=new person('ork1',20,10)
per.atack_someone(ork1)
console.log(ork1.hp)