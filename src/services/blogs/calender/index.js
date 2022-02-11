import express, { response } from "express"
import calenderModel from "./schema.js"
const calenderRouter = express.Router()

calenderRouter.post("/",async(req,res,next)=>{
    try {
        const calender = new calenderModel(req.body)
        const {_id}= await calender.save()
        res.status(200).send({_id})
    } catch (error) {
        next(error)
    }
})
calenderRouter.get("/",async(req,res,next)=>{
    try {
        const calender = await calenderModel.find()
        res.send(calender)
      
    } catch (error) {
        next(error)
    }
})
calenderRouter.get("/:cId",async(req,res,next)=>{
    try {
        const id=req.params.cId
        const calender = await calenderModel.findById(id)
        res.send(calender)
        
    } catch (error) {
        next(error)
    }
})
calenderRouter.put("/:cId",async(req,res,next)=>{
    try {
        const id = req.params.cId
        const calender = await calenderModel.findByIdAndUpdate(id,req.body,{new:true})
        
            res.send(calender)
        
    } catch (error) {
        next(error)
    }
})
calenderRouter.delete("/:cId",async(req,res,next)=>{
    try {
        const id = req.params.cId
        const calender = await calenderModel.findByIdAndDelete(id)
        res.send(calender)
        
    } catch (error) {
        next(error)
    }
})

export default calenderRouter