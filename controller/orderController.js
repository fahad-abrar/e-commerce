import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import Notification from "../model/notificationModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";
import Order from "../model/orderModel.js";
import sendMail from "../helper/sendMail.js";

class OrderController {
  static async newOrders(req, res, next) {
    try {
      const {
        shipingInfo,
        orderItem,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        deleveredAt,
      } = req.body;

      // set the order skeleton
      const orderSkeleton = {
        shipingInfo,
        orderItem,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        deleveredAt,
        user: req.user.id,
      };

      // store the data in order data frame
      const order = await Order.create(orderSkeleton);

      // set up notification schema
      const notificationSchema = {
        userId: req.user.id,
        title: " a new order is placed",
        message: `${req.user.name} order this ${order.orderItem} product`,
      };
      const notification = await Notification.create(notificationSchema);

      // set up a mail option to send the user
      const mailOps = {
        to: req.user.email,
        subject: "order is received",
        text: "....",
      };
      sendMail(mailOps);

      // send the response
      return res.status(200).json({
        success: true,
        message: " order is created",
        order: order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getAllOrder(req, res, next) {
    try {
      // find the auth user
      const authUser = await User.findById(req.user.id);
      if (!authUser) {
        return next(
          new ErrorHandler("only logged in user can place the order", 404)
        );
      }
      // find the all order
      const orders = await Order.find();

      // find the total ammount
      let totalAmount = 0;
      orders.forEach((order) => {
        totalAmount = totalAmount + order;
      });

      // send the response
      return res.status(200).json({
        success: true,
        message: " orders are retrieved",
        order: orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getSingleOrder(req, res, next) {
    try {
      const { id } = req.params;

      // find the auth user
      const authUser = await User.findById(req.user.id);
      if (!authUser) {
        return next(
          new ErrorHandler("only logged in user can place the order", 404)
        );
      }

      // check if the order is exist or not
      const order = await Order.findById(id);
      if (!order) {
        return next(new ErrorHandler("order is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: " orders are retrieved",
        order: order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getMyOrder(req, res, next) {
    try {
      // check if the order is exist or not
      const orders = await Order.find({
        user: req.user.id,
      });
      if (orders.length === 0) {
        return next(new ErrorHandler("order is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: " orders are retrieved",
        order: orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      // check if the order is exist or not
      const orders = await Order.findById(id);
      if (!orders) {
        return next(new ErrorHandler("order is not found", 404));
      }

      // check if the order has already delivered or not
      if (orders.orderStatus === "delivered") {
        return next(
          new ErrorHandler("you have already delivered the order", 404)
        );
      }

      // update the order status and deliver date
      orders.orderStatus = orderStatus;
      if (orderStatus === "delivered") {
        orders.deleveredAt = Date.now();
      }

      // update the available product quantity
      orders.orderItem.forEach(async (order) => {
        const orderProduct = await Product.findById(order.product);
        orderProduct.stock = orderProduct.stock - order.quantity;
        await orderProduct.save({
          validateBeforeSave: false,
        });
      });

      // save the order
      await orders.save({
        validateBeforeSave: false,
      });

      // send the response
      return res.status(200).json({
        success: true,
        message: " orders are retrieved",
        order: orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;

      // find the auth user
      const authUser = await User.findById(req.user.id);
      if (!authUser) {
        return next(
          new ErrorHandler("only logged in user can place the order", 404)
        );
      }

      // check if the order is exist or not
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return next(new ErrorHandler("order is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: " orders are retrieved",
        order: order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

export default OrderController;
