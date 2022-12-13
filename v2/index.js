const server=require('./bookServer')
const order=require('./orderServer')
const redis= require('./connectRedis')


server.bookServer()
order.orderServer()


