const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const fs=require('fs')
const urls=require('./router/bookRouter')
const app=express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(urls)
const port =3000

exports.bookServer= ()=>app.listen(port,()=>{
    console.log(`book connected with port ${port}`)
})