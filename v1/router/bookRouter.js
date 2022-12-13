
const express=require('express')
const actions=require('../controller/bookController')

const bookRouter=express.Router()

bookRouter.get('/search/:topic',actions.search)
bookRouter.get('/info/:item_number',actions.info)
bookRouter.put('/update/:item_number',actions.updateBook)
module.exports=bookRouter