import mongoose from "mongoose";
const { Schema, model } = mongoose;

const fileUploadSchema = new Schema(
  {
    teacherName: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: false,
    },
    file: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Student" },
        comment: { type: String, required: true },
      },
      { timestamps: true },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("fileUpload", fileUploadSchema);
