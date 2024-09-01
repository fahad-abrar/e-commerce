import express from "express";
import catchTry from "../errorhandler/catchTryBlock .js";
import isAuthenticate from "../middlewere/auth.js";
import ReviewController from "../controller/reviewController.js";
const reviewRoute = express.Router();

reviewRoute.post(
  "/create/:productId",
  isAuthenticate,
  catchTry(ReviewController.createReview)
);

reviewRoute.put(
  "/update/:id",
  isAuthenticate,
  catchTry(ReviewController.updateReview)
);

reviewRoute.delete(
  "/delete/:id",
  isAuthenticate,
  catchTry(ReviewController.deleteReview)
);

reviewRoute.get(
  "/single/:id",
  isAuthenticate,
  catchTry(ReviewController.getSingleReview)
);
reviewRoute.get(
  "/all",
  isAuthenticate,
  catchTry(ReviewController.getAllReview)
);

export default reviewRoute;
