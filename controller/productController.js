import ErrorHandler from "../errorhandler/errHandler.js";
import Product from "../model/productModel.js";
import redis from "../database/redis.js";

class ProductController {
  static async createProduct(req, res, next) {
    try {
      const { name, description, price, ratings, category, stock, noOFReview } =
        req.body;

      // check all the field is provided or not
      if (!name || !description || !price || !category) {
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

      // cache the product data in Redis
      try {
        const redisClient = redis();
        if (redisClient) {
          await redisClient.set(
            `product:${product._id}`,
            JSON.stringify(product)
          );
        }
      } catch (redisError) {
        console.error("failed to cache product in redis:", redisError.message);
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: "product is created",
        product: product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getProduct(req, res, next) {
    try {
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
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      //set the redis client instance
      const redisClient = redis();

      // find product form the redis
      const cashe = await redisClient.get(`product:${id}`);
      if (cashe) {
        // return the  finding product
        return res.status(200).json({
          success: true,
          message: "product is retrieved from the cashe",
          product: JSON.parse(cashe),
        });
      }

      // find the product by using id
      const findProduct = await Product.findById(id);

      if (findProduct.length === 0) {
        throw new ErrorHandler("product is not found", 404);
      }

      // send the product into the cashe
      await redisClient.set(
        `product:${findProduct._id}`,
        JSON.stringify(findProduct)
      );

      // send the response
      return res.status(200).json({
        success: true,
        message: "product is retrieved from the db",
        product: findProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async updateProduct(req, res, next) {
    try {
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
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async deleteProduct(req, res, next) {
    try {
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
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async searchProduct(req, res, next) {
    try {
      const { srckey, page = 1, limit = 1 } = req.query;
      const query = {};

      // search portion
      if (srckey) {
        query.$or = [
          { name: { $regex: srckey, $options: "i" } },
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

      //set the redis client instance
      const redisClient = redis();

      // Try to get cached results from Redis
      const cacheKey = `products:search:${srckey}`;
      const cachedProducts = await redisClient.get(cacheKey);

      if (cachedProducts) {
        return res.status(200).json({
          success: true,
          message: "Products retrieved from cache",
          totalProduct: JSON.parse(cachedProducts).totalProduct,
          totalPage: JSON.parse(cachedProducts).totalPage,
          currentPage: page,
          limit: limit,
          products: JSON.parse(cachedProducts).products,
        });
      }

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

      // cache the results in Redis
      const productData = {
        totalProduct,
        totalPage,
        products: findProduct,
      };

      // send the product into the cashe
      await redisClient.set(cacheKey, JSON.stringify(productData));

      // return all the retrieved value
      return res.status(200).json({
        success: true,
        message: "product is retrieved from the db",
        totalProduct: totalProduct,
        totalPage: totalPage,
        currentPage: page,
        limit: limit,
        product: findProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

export default ProductController;
