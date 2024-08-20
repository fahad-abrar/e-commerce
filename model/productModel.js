import mongoose from'mongoose'

// product schema
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'plz provide product name']
    },
    description:{
        type: String,
        required:[ true, 'plz provide product description']
    },
    price:{
        type: Number,
        required:[ true, 'plz provide product price']
    },
    rating:{
        type:Number,
        default: 0
    },
    image:[
        {
        public_id: {
            type: String,
            required:[ false, 'plz provide product image id']
            },

        url: {
            type:String,
            required:[ false, 'plz provide product image url']
            }
        }
    ],
    category:{
        type:String,
        required:[ true, 'plz provide product category']
    },
    stock:{
        type:Number,
        required:[ true, 'plz provide available stock'],
        max:[999, 'stock cannot exceed 4 charecter'],
        default: 1
    },
    noOfReview:{
        type:Number,
        default: 0
    },
    review:[{

        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: false
        },
        user:{
            type:String,
            required: false
        },
        rating:{
            type:Number,
            required: false
        },
        comment:{
            type:String,
            required: false
        }
    }],
    createdAt:{
        type:Date,
        default: Date.now
    }   
})

const Product = mongoose.model('Product', productSchema)

export default Product