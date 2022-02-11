import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";
const signupSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    checkbox: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

signupSchema.pre("save", async function (next) {
  const newUser = this;
  const password = newUser.password;
  if (newUser.isModified("password")) {
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;
  }
  next();
});

signupSchema.methods.toJSON = function () {
  const userDoc = this;
  const userObject = userDoc.toObject();

  return userObject;
};

signupSchema.statics.checkTheCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });

    if (user) {
      const matchUser = await bcrypt.compare(password, user.password);
      if (matchUser) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export default model("signup", signupSchema);
