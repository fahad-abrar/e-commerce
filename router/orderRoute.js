import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import OrderController from "../controller/orderController.js";
const orderRoute = express.Router();

orderRoute.post(
  "/neworder",
  isAuthenticate,
  catchTry(OrderController.newOrders)
);

orderRoute.get(
  "/allorder",
  isAuthenticate,
  catchTry(OrderController.getAllOrder)
);

orderRoute.get(
  "/singleorder/:id",
  isAuthenticate,
  catchTry(OrderController.getSingleOrder)
);

orderRoute.get("/my", isAuthenticate, catchTry(OrderController.getMyOrder));

orderRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(OrderController.updateOrder)
);

orderRoute.delete(
  "/delete/:id",
  isAuthenticate,
  catchTry(OrderController.deleteOrder)
);

export default orderRoute;
