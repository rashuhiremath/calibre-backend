import express from "express";
import fileUploadModel from "./schema.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { pipeline } from "stream";
//import { createGzip } from "zlib";

import { getPdfReadableStream } from "../../tools/pdf-tools.js";
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teacher-files",
    resource_type: "raw",
  },
});

const fileRouter = express.Router();

fileRouter.post(
  "/:tid/uploadCloudinary",
  multer({
    storage: cloudinaryStorage,
    //limits: { fieldSize: 100 * 1024 * 1024 },
    maxBytes: 10000000,
  }).single("fileUpload"),
  async (req, res) => {
    try {
      console.log(req.file);

      const getFileById = await fileUploadModel.findByIdAndUpdate(
        req.params.tid
      );

      if (getFileById) {
        getFileById.file = req.file.path;

        await getFileById.save();
        console.log("here is the file", getFileById);

        res.status(203).send({ success: true, data: getFileById });
      } else {
        res.status(404).send({ success: false, message: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  }
);

fileRouter.post("/", async (req, res, next) => {
  try {
    const teacher = new fileUploadModel(req.body);
    const { _id } = await teacher.save();
    res.status(200).send({ _id });
  } catch (error) {
    next(error);
  }
});
fileRouter.get("/", async (req, res, next) => {
  try {
    const teacher = await fileUploadModel.find();
    res.send(teacher);
  } catch (error) {
    next(error);
  }
});
fileRouter.get("/:tid", async (req, res, next) => {
  try {
    const id = req.params.tid;
    const teacher = await fileUploadModel.findById(id);
    res.send(teacher);
  } catch (error) {
    next(error);
  }
});
fileRouter.put("/:tid", async (req, res, next) => {
  try {
    const id = req.params.tid;
    const teacher = await fileUploadModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.send(teacher);
  } catch (error) {
    next(error);
  }
});
fileRouter.delete("/:tid", async (req, res, next) => {
  try {
    const id = req.params.tid;
    const teacher = await fileUploadModel.findByIdAndDelete(id);
    res.send(teacher);
  } catch (error) {
    next(error);
  }
});

fileRouter.get("/:tid/downloadFile", async (req, res, next) => {
  try {
    const downloadFile = await fileUploadModel.findById(req.params.tid);

    if (!downloadFile) {
      res.status(404).send(message, `teacher id ${req.params.tid} not found`);
    } else {
      //const source = await downloadFile.file;
      const source = await getPdfReadableStream(downloadFile.file);
      //const transform = createGzip();
      const destination = res;

      res.setHeader("Content-Disposition", `attachment; filename= data.pdf`);

      pipeline(source, destination, (err) => {
        if (err) next(err);
      });
    }
  } catch (error) {
    next(error);
  }
});

export default fileRouter;
