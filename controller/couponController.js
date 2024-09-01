import Coupon from "../model/couponModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";

class CouponController {
  static async createCoupon(req, res, next) {
    try {
      const { coupon, expiry } = req.body;
      const newCoupon = await coupon.create({
        coupon,
        expiry,
      });
      // send the response
      return res.status(201).json({
        success: true,
        message: "coupon is created",
        coupon: newCoupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateoupon(req, res, next) {
    try {
      // check if the coupon is exist or not
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return next(new ErrorHandler("coupon is not found", 500));
      }
      // update the coupon
      const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      // send the response
      return res.status(201).json({
        success: true,
        message: "coupon is updated",
        coupon: updateCoupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteCoupon(req, res, next) {
    try {
      // check if the coupon is exist or not
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return next(new ErrorHandler("coupon is not found", 500));
      }
      // delete the coupon
      const deleteCoupon = await Coupon.findByIdAndDelete(id);

      // send the response
      return res.status(201).json({
        success: true,
        message: "coupon is deleted",
        coupon: deleteCoupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getAllCoupon(req, res, next) {
    try {
      // check if the coupon is exist or not
      const { id } = req.params;
      const coupon = await Coupon.find();
      if (!coupon) {
        return next(new ErrorHandler("coupon is not found", 500));
      }

      // send the response
      return res.status(201).json({
        success: true,
        message: "coupon is retrieved",
        coupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getSingleCoupon(req, res, next) {
    try {
      // check if the coupon is exist or not
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return next(new ErrorHandler("coupon is not found", 500));
      }
      // send the response
      return res.status(201).json({
        success: true,
        message: "coupon is retrieved",
        coupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
export default CouponController;
