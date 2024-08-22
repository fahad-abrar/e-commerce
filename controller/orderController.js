import Order from "../model/orderModel.js";
import Product from "../model/productModel.js"
import User from '../model/userModel.js'
import ErrorHandler from '../errorhandler/errHandler.js'



class OrderController{

    static async orders(req, res, next){
        const {address, city, state, country, pincode, phone} = req.body

        if(!address || !city || !country || !phone){
            return next(new ErrorHandler('all the fields are required', 404))
        }



    }
}