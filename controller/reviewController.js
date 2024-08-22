import User from "../model/userModel.js";
import Product from "../model/productModel.js"
import Review from '../model/reviewModel.js'
import ErrorHandler from '../errorhandler/errHandler.js'

const createReview =async (req, res, next)=>{ 
    const {id} = req.user
    const {productId} =  req.params
    const {rating, comment} = req.body

    if(!(rating || comment)){
        return next(new ErrorHandler('all the fields are required', 404))
    }
    // check if the user is authorized or not
    const authUser = await User.findById(id)
    if(!authUser){
        return next(new ErrorHandler('unauthorized to review', 404))
    }
    // check if the product is exist or not
    const product = await Product.findById(productId)

    if(!product){
        return next(new ErrorHandler('product is not found', 404))
    }
    
    // set the review skeleton
    const reviewSkeleton = {
        productId,
        userId : authUser.id,
        user: authUser.name,
        rating,
        comment 
    }
    // store the review in the dataframe
    const review = await Review.create(reviewSkeleton)

    // restore the no of review and avg reating
    product.reviews.push(review)
    product.noOfReview = product.reviews.length
    product.ratings = product.reviews.reduce((acc, item)=>{
        return (acc + item.rating)
    }, 0)/product.reviews.length
    await product.save()

    // send the response
    return res.status(200).json({
        success: true,
        message:'review is created',
        review: review
    })
}

export default createReview