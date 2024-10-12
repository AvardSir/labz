// const http=require('http')
// const fs=require('fs')
// let server = http.createServer((req,res)=>{
//     res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})

//     if (req.url === '/') {
//         fs.createReadStream('templates/index.html').pipe(res);
//     } else if (req.url === '/about') {
//         fs.createReadStream('templates/about.html').pipe(res);
//     }
//     else 
//    {
//         fs.createReadStream('templates/error.html').pipe(res);
//     }
    
//     // res.end('Hello <b>ddd<b>')
// })

// const PORT=3000
// const HOST='localhost'

// server.listen(PORT,HOST,()=>{
//     console.log(`Сервер запущен ${PORT} и ${HOST}`)
// }) 

const express=require('express')
const app=express()

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/user/:username',(req,res)=>{
    let data = {username: req.params.username, hoby:['fotbal','socer','swiming']}
    res.render('user',data)
})
 
app.get('/about',(req,res)=>{
    res.render('about')
})

app.post('/check-user',(req,res)=>{
    console.log(req.body)
    
})

PORT=3000
app.listen(PORT,()=>{
    console.log(`server start localhost:${PORT}`)
})