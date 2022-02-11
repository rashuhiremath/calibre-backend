import express from "express";
import signupModel from "./schema.js";
import { tokenAuthenticate } from "../../authorization/tools.js";
import createHttpError from "http-errors";
const signupRouter = express.Router();

signupRouter.post("/", async (req, res, next) => {
  try {
    const outsider = new signupModel(req.body);
    const { _id } = await outsider.save();
    /*  const { email, password: plainTextPassword } = req.body;
    const password = await bcrypt.hash(password, 10);
    // console.log(await bcrypt.hash(password, 10));
    /*  const response = await signup.create({
      outsider,
    }); */
    res.status(200).send({ _id });
  } catch (error) {
    next(error);
  }
});
signupRouter.get("/", async (req, res, next) => {
  try {
    const outsider = await signupModel.find();
    res.send(outsider);
  } catch (error) {
    next(error);
  }
});
signupRouter.get("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const outsider = await signupModel.findById(id);
    res.send(outsider);
  } catch (error) {
    next(error);
  }
});
signupRouter.put("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const outsider = await signupModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.send(outsider);
  } catch (error) {
    next(error);
  }
});
signupRouter.delete("/:cId", async (req, res, next) => {
  try {
    const id = req.params.cId;
    const outsider = await signupModel.findByIdAndDelete(id);
    res.send(outsider);
  } catch (error) {
    next(error);
  }
});

signupRouter.post("/login", async (req, res, next) => {
  try {
    console.log(1111111);
    const { email, password } = req.body;
    const userData = await signupModel.checkTheCredentials(email, password);
    if (userData) {
      const accessToken = await tokenAuthenticate(userData);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials not ok!"));
    }
  } catch (error) {
    next(error);
  }
});
/* signupRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await signupModel.checkTheCredentials(email, password);

    if (user) {
      const accessToken = await tokenAuthenticate(user);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials not ok!"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
 */
export default signupRouter;
