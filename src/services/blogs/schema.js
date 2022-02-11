import mongoose from "mongoose"
const {Schema, model}=mongoose

const blogSchema = new Schema({
    name:{type:String,required:true},
    branch:{type:String,required:true},
    image:{type:String,required:false},
    title:{type:String,required:true},
    detail:{type:String,required:true},
},{
    timestamps:true,
})

export default model("blogs",blogSchema)

