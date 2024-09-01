import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import CouponController from "../controller/couponController.js";

const couponRoute = express.Router();

couponRoute.post(
  "/create",
  isAuthenticate,
  catchTry(CouponController.createCoupon)
);

couponRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(CouponController.updateoupon)
);

couponRoute.delete(
  "/delete/:id",
  isAuthenticate,
  catchTry(CouponController.deleteCoupon)
);

couponRoute.get(
  "/all",
  isAuthenticate,
  catchTry(CouponController.getAllCoupon)
);

couponRoute.get(
  "/single/:id",
  isAuthenticate,
  catchTry(CouponController.getSingleCoupon)
);

export default couponRoute;
