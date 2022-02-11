import express from "express"
import myModel from "./schema.js"

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const postRouter = express.Router()

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone-blogs",
    },
  });

 /*  postRouter.post(
    "/:blogId/uploadCloudinary",
    multer({ storage: cloudinaryStorage }).single("image"),
    async (req, res, next) => {
      try {
        const image = req.file.path;
        console.log(image)
        
        const id = req.params.blogId;
        const result = await blogModel.findByIdAndUpdate(id, {$set:{image:image}}, {
          new: true,
        });
  
        res.send({ result });
      } catch (error) {
        next(error);
      }
    }
  ); */

  postRouter.post("/:blogId/uploadCloudinary",
    multer({ storage: cloudinaryStorage }).single("image"),
    async (req, res) => {
      try {
        const getPostById = await myModel.findById(req.params.blogId);

        if (getPostById) {
          getPostById.image = req.file.path;

          await getPostById.save();

          res.status(203).send({ success: true, data: getPostById });
        } else {
          res.status(404).send({ success: false, message: "Post not found" });
        }
      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    }
  );


//*****************Endpoints***************************/
//get all the blogs
postRouter.get("/" ,async(req,res,next)=>{
    try{
        const blog= await myModel.find()
        res.send(blog)

    }catch(error){
       next(error)
    }
})
//post the blogs
postRouter.post("/" ,async(req,res,next)=>{
    try{

        const newBlog = new myModel(req.body)
        const {_id}= await newBlog.save()
        res.status(200).send({_id})
    }catch(error){
       next(error)
    }
})
//get by id
postRouter.get("/:blogId" ,async(req,res,next)=>{
    try{
        const id = req.params.blogId
        const blog = await myModel.findById(id)
        res.send(blog)
    }catch(error){
        next(error)
    }
})

//update  by id
postRouter.put("/:blogId" ,async(req,res,next)=>{
    try{
        const id = req.params.blogId
        const blog = await myModel.findByIdAndUpdate(id,req.body,{new:true})
        res.send(blog)


    }catch(error){
        next(error)
    }
})

//delete by id
postRouter.delete("/:blogId" ,async(req,res,next)=>{
    try{
        const id = req.params.blogId
        const blog = await myModel.findByIdAndDelete(id)
        res.send()
    }catch(error){
       next(error)
    }
})

//upload image by cloudinary





export default postRouter