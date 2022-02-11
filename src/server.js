import express from "express";
import listEndpoints from "express-list-endpoints";
import postRouter from "./services/blogs/index.js";
import cors from "cors";
import mongoose from "mongoose";
import calenderRouter from "./services/blogs/calender/index.js";
import registerRouter from "./services/Student-register/index.js";
import signupRouter from "./services/signup/index.js";
import fileRouter from "./services/uploads/index.js";

const whiteList = [process.env.LOCAL_FE];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by cors!");
      error.status = 403;
      callback(error);
    }
  },
};

const server = express();
server.use(cors());
server.use(express.json());

server.use("/universityBlog", postRouter);
server.use("/calender", calenderRouter);
server.use("/student-register", registerRouter);
server.use("/signup", signupRouter);
server.use("/teacher", fileRouter);
const port = 3030;

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.log("server running on port:", port);
    console.table(listEndpoints(server));
  });
});
