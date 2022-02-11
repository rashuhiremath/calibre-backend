import mongoose from "mongoose";
const { Schema, model } = mongoose;

const fileUploadSchema = new Schema(
  {
    teacherName: { type: String, required: true },
    topic: { type: String, required: true },
    file: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("fileUpload", fileUploadSchema);
