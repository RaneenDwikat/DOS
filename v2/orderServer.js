const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const fs=require('fs')
const urls=require('./router/orderRouter')
const app=express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(urls)
const port =3005

exports.orderServer= ()=>app.listen(port,()=>{
    console.log(`order connected with port ${port}`)
})