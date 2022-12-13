const express=require('express')
const fs=require('fs')
const path=require('path') 
const r=require ('redis')

 redis = r.createClient()

exports.search = async(req,res,next)=>{
    try {

       
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
                // await redis.setEx(`search_${req.params.topic}`, 3600, JSON.stringify(result));
               // jsond=JSON.parse(result)
              return res.status(200).json({status:true,data:result})
           })
        
        
       
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
    
}

exports.info= async(req,res,next)=>{
    // console.log('info')

    try {       
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
                console.log("yeees")
                return res.status(200).json({data:result[0]})
              }else{
                return res.status(204).json({data:"book doesn't exist"})
              }
            })    
        
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
            status_Code=500
            jsonData.forEach(async element => {
                msg=element

                if( element.item_number==req.params.item_number){
                    msg="first if"
                    if(req.body.itemsInStock==-1){
                        msg="second if"
                        if(element.itemsInStock==0){
                             status_Code=204
                            msg="you cannot buy"
                        }else{
                            msg="updated"
                             status_Code=200
                            element.itemsInStock=Number(element.itemsInStock)+Number(req.body.itemsInStock)
                            await fs.writeFile('data/book.csv',JSON.stringify(jsonData),(error)=>{
                                console.log(error)
                            })
                            console.log(msg)
                        }
                    } 
                }
            });
            console.log('element')

           return res.status(status_Code).json({status:true,msg:msg})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
}
