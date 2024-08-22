import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    user:{
        type:String,
        required: true
    },
    rating:{
        type:Number,
        required: true
    },
    comment:{
        type:String,
        required: true
    }
})
const Review = mongoose.model('Review', reviewSchema)
export default Review