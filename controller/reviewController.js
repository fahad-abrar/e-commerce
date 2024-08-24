import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import Review from "../model/reviewModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";

class ReviewController {
  static async createReview(req, res, next) {
    const { id } = req.user;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!(rating || comment)) {
      return next(new ErrorHandler("all the fields are required", 404));
    }
    // check if the user is authorized or not
    const authUser = await User.findById(id);
    if (!authUser) {
      return next(new ErrorHandler("unauthorized to review", 404));
    }
    // check if the product is exist or not
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("product is not found", 404));
    }

    // set the review skeleton
    const reviewSkeleton = {
      productId,
      userId: authUser.id,
      user: authUser.name,
      rating,
      comment,
    };
    // store the review in the dataframe
    const review = await Review.create(reviewSkeleton);

    // restore the no of review and avg reating
    product.reviews.push(review);
    product.noOfReview = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => {
        return acc + item.rating;
      }, 0) / product.reviews.length;
    await product.save();

    // send the response
    return res.status(200).json({
      success: true,
      message: "review is created",
      review: review,
    });
  }

  static async updateReview(req, res, next) {
    const { id } = req.params;
    const updateData = req.body;

    // check if the review is exist or not
    const findReview = await Review.findById(id);
    if (!findReview) {
      return next(new ErrorHandler("review is not found", 404));
    }

    // check if the user is authorized to update
    if (findReview.userId.toString() !== req.user.id.toString()) {
      return next(
        new ErrorHandler("unauthorized access to update the review", 404)
      );
    }

    // find the associate product
    const product = await Product.findById(findReview.productId);
    if (!product) {
      return next(new ErrorHandler("associate product not found", 404));
    }

    // update and store the review
    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // find the review of the product and update it
    product.reviews.forEach((review, idx) => {
      if (review._id.toString() === id.toString()) {
        product.reviews[idx] = updatedReview;
      }
    });

    // restore the no of review and avg reating
    product.ratings =
      product.reviews.reduce((acc, item) => {
        return acc + item.rating;
      }, 0) / product.reviews.length;

    await product.save();

    // sent he response
    return res.status(200).json({
      success: true,
      message: "review is updated",
      review: updatedReview,
    });
  }

  static async deleteReview(req, res, next) {
    const { id } = req.params;

    // check if the review is exist or not
    const findReview = await Review.findById(id);
    if (!findReview) {
      return next(new ErrorHandler("review is not found", 404));
    }

    // check if the user is authorized to update
    if (findReview.userId.toString() !== req.user.id.toString()) {
      return next(
        new ErrorHandler("unauthorized access to update the review", 404)
      );
    }

    // find the associate product
    const product = await Product.findById(findReview.productId);
    if (!product) {
      return next(new ErrorHandler("associate product not found", 404));
    }

    // delete the review
    const deletedReview = await Review.findByIdAndDelete(id);

    // remove the review form the product reviews array
    product.reviews = product.reviews.filter((review) => {
      return review._id.toString() !== id;
    });

    // update the no of review and avg reating
    product.noOfReview = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => {
        return acc + item.rating;
      }, 0) / product.reviews.length;
    await product.save();

    // sent he response
    return res.status(200).json({
      success: true,
      message: "review is updated",
      review: deletedReview,
    });
  }
}

export default ReviewController;
