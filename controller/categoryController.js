import Category from "../model/categoryModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const { category } = req.body;
      const newCategory = await Category.create(category);
      // send the response
      return res.status(201).json({
        success: true,
        message: "category is created",
        category: newCategory,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateCategory(req, res, next) {
    try {
      // check if the category is exist or not
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return next(new ErrorHandler("category is not found", 500));
      }
      // update the category
      const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return res.status(201).json({
        success: true,
        message: "category is updated",
        category: updateCategory,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      // check if the category is exist or not
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return next(new ErrorHandler("category is not found", 500));
      }
      // delete the category
      const deleteCategory = await Category.findByIdAndDelete(id);
      return res.status(201).json({
        success: true,
        message: "category is deleted",
        category: deleteCategory,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getAllCategory(req, res, next) {
    try {
      // check if the category is exist or not
      const { id } = req.params;
      const category = await Category.find();
      if (!category) {
        return next(new ErrorHandler("category is not found", 500));
      }
      return res.status(201).json({
        success: true,
        message: "category is retrieved",
        category,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getSingleCategory(req, res, next) {
    try {
      // check if the category is exist or not
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return next(new ErrorHandler("category is not found", 500));
      }

      return res.status(201).json({
        success: true,
        message: "category is retrieved",
        category,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
export default CategoryController;
