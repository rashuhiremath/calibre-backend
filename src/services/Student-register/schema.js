import mongoose from "mongoose";
const { Schema, model } = mongoose;

const registerSchema = new Schema(
  {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    image: { type: String },
    country: { type: String, required: true },
    uniId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("register", registerSchema);
