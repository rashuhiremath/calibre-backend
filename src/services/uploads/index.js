import express from "express";
import fileUploadModel from "./schema.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { pipeline } from "stream";
//import { createGzip } from "zlib";

import { getPdfReadableStream } from "../../tools/pdf-tools.js";
/* const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teacher-files",
    resource_type: "raw",
    // raw_convert: "pdf",
  },
}); */
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary, // CREDENTIALS,
  params: {
    folder: "test",

    resource_type: "raw",
    //  raw_convert: "aspose",
  },
});

const fileRouter = express.Router();

fileRouter.post(
  "/:tid/uploadCloudinary",
  multer({
    storage: cloudinaryStorage,
    //limits: { fieldSize: 100 * 1024 * 1024 },
    /*  maxBytes: 10000000,
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(ppt|pptx)$/)) {
        return cb(new Error("Please upload a file"));
      }
      cb(null, true);
    }, */
  }).single("fileUpload"),
  async (req, res) => {
    try {
      const id = req.params.tid;
      const filePath = req.file.path;
      const teacher = await fileUploadModel.findByIdAndUpdate(
        id,
        { $set: { file: filePath } },
        { new: true }
      );
      if (teacher) {
        res.status(203).send(teacher);
      } else {
        res.status(404).send(`teacher with id ${id} not found`);
      }
    } catch (error) {
      console.log(error);
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

fileRouter
  .get("/:tid/comment", async (req, res) => {
    try {
      const getComments = await fileUploadModel
        .findById(req.params.tid)
        .populate("comments.user");

      if (getComments) {
        res.status(200).send({ success: true, data: getComments.comments });
      } else {
        res.status(404).send({ success: false, error: "file  not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .post("/:tid/comment", async (req, res) => {
    try {
      console.log(req.body);

      const newComment = await fileUploadModel.findByIdAndUpdate(
        req.params.tid,
        { $push: { comments: req.body } },
        { new: true }
      );

      if (newComment) {
        res.status(201).send({ success: true, data: newComment.comments });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });

fileRouter
  .delete("/:tid/comment/:commentId", async (req, res) => {
    try {
      const deleteComment = await fileUploadModel.findByIdAndUpdate(
        req.params.tid,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
      );

      if (deleteComment) {
        res
          .status(204)
          .send({ success: true, message: "Comment Deleted Succesfully" });
      } else {
        res.status(404).send({ success: false, message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .put("/:tid/comment/:commentId", async (req, res) => {
    try {
      const updateComment = await fileUploadModel.updateOne(
        {
          _id: req.params.tid,
          "comments._id": new mongoose.Types.ObjectId(req.params.commentId),
        },
        {
          $set: { "comments.$.comment": req.body.comment },
        },
        { new: true }
      );

      if (updateComment) {
        res.status(203).send({ success: true, data: updateComment.comments });
      } else {
        res.status(404).send({ success: false, message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });
export default fileRouter;
/* try {
      console.log(req.file);

      const getFileById = await fileUploadModel.findByIdAndUpdate(
        req.params.tid
      );

      if (getFileById) {
        getFileById.file = req.file.path;
        console.log(getFileById.file);
        await getFileById.save();
        console.log("here is the file", getFileById);

        res.status(203).send({ success: true, data: getFileById });
      } else {
        res.status(404).send({ success: false, message: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    } */
