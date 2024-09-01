import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import CategoryController from "../controller/categoryController.js";

const categoryRoute = express.Router();

categoryRoute.post(
  "/create",
  isAuthenticate,
  catchTry(CategoryController.createCategory)
);

categoryRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(CategoryController.updateCategory)
);

categoryRoute.delete(
  "/delete/:id",
  isAuthenticate,
  catchTry(CategoryController.deleteCategory)
);

categoryRoute.get(
  "/all",
  isAuthenticate,
  catchTry(CategoryController.getAllCategory)
);

categoryRoute.get(
  "/single/:id",
  isAuthenticate,
  catchTry(CategoryController.getSingleCategory)
);

export default categoryRoute;
