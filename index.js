const server=require('./bookServer')
const order=require('./orderServer')
const redis= require('./connectRedis')
const connectRedis = require('./connectRedis')

server.bookServer()
order.orderServer()
connectRedis()