import createHttpError from "http-errors";
import signupModel from "../../src/services/signup/schema.js";
import { verfityToken } from "./tools.js";

export const JWTtokenMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "provide the token for authorization"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const decodeToken = await verfityToken(token);

      const user = await signupModel.findById(decodeToken._id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(401, "user not found"));
      }
    } catch (error) {
      console.log(error);
      next(createHttpError("provide the credential"));
    }
  }
};
