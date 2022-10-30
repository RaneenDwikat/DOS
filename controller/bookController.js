const express=require('express')
const fs=require('fs')
const path=require('path') 
exports.search = async(req,res,next)=>{
    try {
        result=[]
        const {}=req.params
         await fs.readFile('data/book.csv',(err,data)=>{console.log(err)
            jsonData=JSON.parse(data)
            console.log(jsonData)
            jsonData.forEach(element => {

                if( element.topic==req.params.topic){
                    console.log(element)
                    result.push(element)
                }
            });
            console.log(result[0])
            // jsond=JSON.parse(result)
           return res.status(200).json({data:result})
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
        const {}=req.params
         await fs.readFile('data/book.csv',(err,data)=>{console.log(err)
            jsonData=JSON.parse(data)
            jsonData.forEach(element => {

                if( element.item_number==req.params.item_number){
                    result.push(element)
                }
            });
            // console.log(result[0])
            // jsond=JSON.parse(result)
           return res.status(200).json({data:result[0]})
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
            
            jsonData.forEach(element => {

                if( element.item_number==req.params.item_number){
                    if(req.body.cost!=null){
                        element.cost=req.body.cost
                    }
                    if(req.body.itemsInStock!=undefined){
                        element.itemsInStock=Number(element.itemsInStock)+Number(req.body.itemsInStock)
                    }
                    
                    console.log(element)
                }
            });
            await fs.writeFile('data/book.csv',JSON.stringify(jsonData),(error)=>{
                console.log(error)
            })
           return res.status(200).json({status:true,msg:"updated"})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:error})
    }
}
