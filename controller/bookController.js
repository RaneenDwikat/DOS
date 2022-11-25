const express=require('express')
const fs=require('fs')
const path=require('path') 
const r=require ('redis')

 redis = r.createClient()

exports.search = async(req,res,next)=>{
    try {

         result= await redis.GET(`search_${req.params.topic}`)
        if(null!=null){
            return res.status(200).json({status:true,data:result})
        }
        else{
            result=[]
            const {}=req.params
            await fs.readFile('data/book.csv',async (err,data)=>{console.log(err)
               jsonData=JSON.parse(data)
               console.log(jsonData)
               jsonData.forEach(element => {
   
                   if( element.topic==req.params.topic){
                       console.log(element)
                       result.push(element)
                   }
               });
                await redis.setEx(`search_${req.params.topic}`, 3600, JSON.stringify(result));
               // jsond=JSON.parse(result)
              return res.status(200).json({status:true,data:result})
           })
        
        }
       
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
    
}

exports.info= async(req,res,next)=>{
    // console.log('info')

    try {
        result=await redis.GET(`info_${req.params.item_number}`)
        if(result!=null){
            return res.status(200).json({data:result[0]})
        }
        else{
            result=[]
            flag=0
            const {}=req.params
             await fs.readFile('data/book.csv',async(err,data)=>{console.log(err)
                jsonData=JSON.parse(data)
                jsonData.forEach(element => {
    
                    if( element.item_number==req.params.item_number){
                        flag=1
                        result.push(element)
                    }
                });
                console.log(result)
                // jsond=JSON.parse(result)
              if(flag==1){
                await redis.setEx(`info_${req.params.topic}`, 3600, JSON.stringify(result));
                return res.status(200).json({data:result[0]})
              }else{
                return res.status(204).json({data:"book doesn't exist"})
              }
            })    
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
    
}
exports.updateBook=async(req,res,next)=>{
    try {
        result=[]
        const {}=req.params
         await fs.readFile('data/book.csv',async (err,data)=>{console.log(err)
            jsonData=JSON.parse(data)
            console.log(req.body)
            
            jsonData.forEach(async element => {

                if( element.item_number==req.params.item_number){
                    if(req.body.cost!=null){
                        element.cost=req.body.cost
                    }
                    if(req.body.itemsInStock!=undefined){

                        if(element.itemsInStock==1){
                            msg="you cannot buy"
                        }else{
                            element.itemsInStock=Number(element.itemsInStock)+Number(req.body.itemsInStock)
                            await fs.writeFile('data/book.csv',JSON.stringify(jsonData),(error)=>{
                                console.log(error)
                            })
                            msg="updated"

                        }
                    }
                    
                }
            });
            console.log('element')
           
           return res.status(200).json({status:true,msg:msg})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
}
