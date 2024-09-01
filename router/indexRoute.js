import express from "express";
import categoryRoute from "./categoryRoute.js";
import orderRoute from "./orderRoute.js";
import couponRoute from "./couponRoute.js";
import fileRoute from "./fileRoute.js";
import notificationRoute from "./notificationRoute.js";
import productRoute from "./productRoute.js";
import reviewRoute from "./reviewRoute.js";
import userRoute from "./userRoute.js";
const route = express.Router();

// route ---------
route.use("/user", userRoute);
route.use("/product", productRoute);
route.use("/order", orderRoute);
route.use("/file", fileRoute);
route.use("/coupon", couponRoute);
route.use("/review", reviewRoute);
route.use("/category", categoryRoute);
route.use("/notification", notificationRoute);

export default route;
