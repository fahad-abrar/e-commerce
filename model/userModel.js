import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxLength:[30, 'name can not be exceed in 30 charecter'],
        minLength:[2, 'name should be at least 2 charecter']
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: true
    },
    avatar:{
        public_id:{
            type: String,
            required: false
        },
        url:{
            type: String,
            required: false
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

const User = mongoose.model('User', userSchema)
export default userSchema