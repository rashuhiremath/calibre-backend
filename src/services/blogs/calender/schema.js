import mongoose from "mongoose"
const {Schema, model}=mongoose

const calenderSchema = new Schema({
   event:{type:String,required:true},
    type:{type:String,required:true},
    date:{type:String,required:true},
    time:{type:String,required:true},
   
},{
    timestamps:true,
})

export default model("Calender",calenderSchema)

