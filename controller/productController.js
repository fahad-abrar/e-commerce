import ErrorHandler from "../errorhandler/errHandler.js";
import Product from "../model/productModel.js";
import Review from "../model/reviewModel.js";
import fileUploader from "../utils/fileUploader.js";
import fs from "fs";
import catchTry from "../errorhandler/catchTryBlock .js";
import path from "path";

class ProductController {
  // create product
  static async createProduct(req, res) {
    const { name, description, price, ratings, category, stock, noOFReview } =
      req.body;

    // check all the field is provided or not
    if (!name || !description || !price || !category || !stock) {
      throw new ErrorHandler("all the fields are required", 404);
    }

    // create a object model to store data
    const productData = {
      name,
      description,
      price,
      category,
      stock,
      ratings,
      noOFReview,
    };

    // create product database
    const product = await Product.create(productData);

    // send the response
    return res.status(200).json({
      success: true,
      message: "product is created",
      product: product,
    });
  }

  static async getProduct(req, res) {
    const { page = 1, limit = 1 } = req.query;

    // pagination part
    if (page < 0) {
      page = 1;
    }
    if (limit < 0) {
      limit = 1;
    }
    const skip = (page - 1) * limit;

    // find all the product
    const findProduct = await Product.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    if (findProduct.length === 0) {
      throw new ErrorHandler("product is not found");
    }

    // find the no of total product and total page
    const totalProduct = await Product.countDocuments();
    const totalPage = Math.ceil(totalProduct / limit);

    // return all the retrieved value
    return res.status(200).json({
      success: true,
      message: "all the product are retrieved",
      totalProduct: totalProduct,
      totalPage: totalPage,
      currentPage: page,
      limit: limit,
      product: findProduct,
    });
  }

  static async getProductById(req, res) {
    const { id } = req.params;

    // find the product by using id
    const findProduct = await Product.findById(id);

    if (findProduct.length === 0) {
      throw new ErrorHandler("product is not found", 404);
    }
    // return the  finding product
    return res.status(200).json({
      success: true,
      message: "product is retrieved",
      product: findProduct,
    });
  }

  static async updateProduct(req, res) {
    const { id } = req.params;

    // store the update data
    const updateData = req.body;

    // find the product and update the product
    const updateProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "product is created",
      product: updateProduct,
    });
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;

    // find the product by using id
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (findProduct.length === 0) {
      throw new ErrorHandler("product is not found", 404);
    }
    // return the  finding product
    return res.status(200).json({
      success: true,
      message: "product is deleted",
      product: deleteProduct,
    });
  }

  static async searchProduct(req, res) {
    const { srckey, page = 1, limit = 1 } = req.query;
    const query = {};

    // search portion
    if (srckey) {
      query.$or = [
        { name: { $regex: srckey, $options: " i" } },
        { cayegory: { $regex: srckey, $options: "i" } },
        { description: { $regex: srckey, $options: "i" } },
      ];
    }

    // pagination portion
    if (page < 0) {
      page = 1;
    }
    if (limit < 0) {
      limit = 1;
    }
    const skip = (page - 1) * limit;

    // find the target product
    const findProduct = await Product.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    if (findProduct.length === 0) {
      throw new ErrorHandler("product is not found", 404);
    }

    // find the no of total product and total page
    const totalProduct = await Product.countDocuments();
    const totalPage = Math.ceil(totalProduct / limit);

    // return all the retrieved value
    return res.status(200).json({
      success: true,
      message: "product is retrieved",
      totalProduct: totalProduct,
      totalPage: totalPage,
      currentPage: page,
      limit: limit,
      product: findProduct,
    });
  }
}

export default ProductController;
