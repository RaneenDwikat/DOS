const redis=require ("./connectRedis");

var functions={

  getCache: async function (key){
    const result= await redis.GET(key);
    if(result){
      return JSON.parse(result)
    }
    return
     
  },
  setCache:async function  (key,data, expired){
   
      await redis.setEx(key, expired, data);
      return data;
  }
}
 

module.export=functions