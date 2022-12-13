const r=require ( 'redis')


module.exports= async function connectRedis() {
    try {
        const conn=redis.connect()
        console.log("connected with redis")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}