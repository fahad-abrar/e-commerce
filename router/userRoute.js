import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import UserController from "../controller/userController.js";
import isAuthenticate from "../middlewere/auth.js";
const userRoute = express.Router();

userRoute.post("/register", catchTry(UserController.registerUser));

userRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(UserController.updateUser)
);

userRoute.get("/alluser", isAuthenticate, catchTry(UserController.getAllUser));

userRoute.get(
  "/user/:id",
  isAuthenticate,
  catchTry(UserController.getSingleUser)
);

userRoute.get("/me", isAuthenticate, catchTry(UserController.getUser));

userRoute.post("/login", catchTry(UserController.logInUser));

userRoute.get("/logout", isAuthenticate, catchTry(UserController.logOutUser));

userRoute.post(
  "/password/change",
  isAuthenticate,
  catchTry(UserController.changePassword)
);

userRoute.post("/password/forgot", catchTry(UserController.forgotPassword));

userRoute.post(
  "/password/reset/:token",
  catchTry(UserController.resetPassword)
);

export default userRoute;
