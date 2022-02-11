import express, { response } from "express";
import registerModel from "./schema.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "capstone-blogs",
  },
});

const registerRouter = express.Router();

registerRouter.post(
  "/:stdId/uploadCloudinary",
  multer({ storage: cloudinaryStorage }).single("image"),
  async (req, res) => {
    try {
      const getPostById = await registerModel.findById(req.params.stdId);

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

registerRouter.post("/", async (req, res, next) => {
  try {
    const student = new registerModel(req.body);
    const { _id } = await student.save();
    res.status(200).send({ _id });
  } catch (error) {
    next(error);
  }
});
registerRouter.get("/", async (req, res, next) => {
  try {
    const student = await registerModel.find();
    res.send(student);
  } catch (error) {
    next(error);
  }
});
registerRouter.get("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const student = await registerModel.findById(id);
    res.send(student);
  } catch (error) {
    next(error);
  }
});
registerRouter.put("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const student = await registerModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.send(student);
  } catch (error) {
    next(error);
  }
});
registerRouter.delete("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const student = await registerModel.findByIdAndDelete(id);
    res.send(student);
  } catch (error) {
    next(error);
  }
});

export default registerRouter;
