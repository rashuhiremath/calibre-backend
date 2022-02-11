import createHttpError from "http-errors";
import registerModel from "../services/Student-register/index.js";
import atob from "atob";

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "please provide the Authorization in header"));
  } else {
    const base64Credential = req.headers.authorization.split(" ")[1];
    console.log(base64Credential);
    const decode = atob(base64Credential);

    const [email, uniId] = decode.split(":");

    const student = await registerModel.checkTheCredentials(email, uniId);

    if (student) {
      req.student = student;

      next();
    } else {
      next(createHttpError(401, "credentials are not correct"));
    }
  }
};
