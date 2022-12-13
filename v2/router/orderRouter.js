
const express=require('express')
const actions=require('../controller/orderController')

const orderRouter=express.Router()

orderRouter.post('/purchase/:item_number',actions.perchase)

module.exports=orderRouter