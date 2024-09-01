import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import NotificationController from "../controller/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(NotificationController.updateStatus)
);

notificationRoute.get(
  "/all",
  isAuthenticate,
  catchTry(NotificationController.getnotification)
);

export default notificationRoute;
