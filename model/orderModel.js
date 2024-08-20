import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shipingInfo:{
        adddress:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        pinCode:{
            type: Number,
            required: true
        },
        phone:{
            type: Number,
            required: true
        }
    },
    orderItem:[{
        product:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        price:{
            type: String,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        image:{
            type: String,
            required: true
        }
    }],
    user:{
        type: String,
        required: true
    },
    paymentInfo:{
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }
    },
    paidAt:{
        type: Date,
        required: true
    },
    itemsPrice:{
        type: Number,
        required: true,
        default: 0
    },
    taxPrice:{
        type: Number,
        required: true,
        default: 0
    },
    shipingPrice:{
        type: Number,
        required: true,
        default: 0
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    orderStatus:{
        type:String,
        required: true,
        default: 'processing'
    },
    deleveredAt:{
        type: Date
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model('Order', orderSchema)

export default orderSchema