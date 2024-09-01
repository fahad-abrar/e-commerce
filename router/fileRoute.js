import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import FileController from "../controller/fileController.js";
import upload from "../helper/multer.js";

const fileRoute = express.Router();

fileRoute.post(
  "/image/:id",
  isAuthenticate,
  upload.single("image"),
  catchTry(FileController.fileUpload)
);

fileRoute.put(
  "/image/:id",
  isAuthenticate,
  upload.single("image"),
  catchTry(FileController.productFileUpdate)
);

fileRoute.delete(
  "/image/:productId?:id",
  isAuthenticate,
  catchTry(FileController.productFileDelete)
);

fileRoute.get(
  "/image/:id",
  isAuthenticate,
  upload.array("image", 10),
  catchTry(FileController.getFileById)
);

fileRoute.get("/image", isAuthenticate, catchTry(FileController.getallFile));

export default fileRoute;
