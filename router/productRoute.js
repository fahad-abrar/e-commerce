import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import ProductController from "../controller/productController.js";
import isAuthenticate from "../middlewere/auth.js";
const productRoute = express.Router();

productRoute.post(
  "/newproduct",
  isAuthenticate,
  catchTry(ProductController.createProduct)
);

productRoute.get(
  "/get",
  isAuthenticate,
  catchTry(ProductController.getProduct)
);

productRoute.get(
  "/get/:id",
  isAuthenticate,
  catchTry(ProductController.getProductById)
);

productRoute.get(
  "/search",
  isAuthenticate,
  catchTry(ProductController.searchProduct)
);

productRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(ProductController.updateProduct)
);

productRoute.delete(
  "/delete/:id",
  isAuthenticate,
  catchTry(ProductController.deleteProduct)
);

export default productRoute;
