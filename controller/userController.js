import User from '../model/userModel.js'
import ErrorHandler from '../errorhandler/errHandler.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController{

    static async registerUser(req, res, next){
        const {name, email, password, role} = req.body

        // check if all the fields is provided or not
        if(!name || !email || !password){
            next( new ErrorHandler('all the fields are required', 404))
        }
        // check if the user is exist or not
        const existUser = await User.findOne({email})
        if(existUser){
            next( new ErrorHandler('user is already  exist', 404))
        }

        // handle the files if it is provided
        if(req.files && req.files.avatar){
            console.log(req.files)
        }

        let public_id = ''
        let url = ''


        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)


        // create a new user
        const newUser = await User.create({
            name, 
            email, 
            password: hashPass, 
            role,
            avatar:{
                public_id,
                url
            } 
        })

        // return the file
        return res.status(200).json({
            success: false,
            message:'user is created',
            user: newUser
        })
    }
    static async updateUser(req, res, next){
        const {id} =  req.params
        const info = req.body

        // find the user is exist or not
        const findUser = await User.findById(id).select("-password")
        console.log(findUser)

        if(!findUser){
            next( new ErrorHandler('user is not found', 404))
        }

        // handle the file if avater is provided
        if(req.file && req.files.avatar){
            console.log(avatar)
        }

        // update the user profile
        const upUser = await User.findByIdAndUpdate(id, info, {
            new: true
        })

        // return the file
        return res.status(200).json({
            success: false,
            message:'user is updated',
            user: upUser
        })
    }
    static async getAllUser(req, res, next){
        const {page=1, limit=1} = req.query

        //pagination portion
        if(page<0){
            page = 1
        }
        if(limit<0){
            limit = 1
        }
        const skip = (page -1)*limit

        // find all the user
        const findUser = await User.find()
                            .limit(parseInt(limit))
                            .skip(parseInt(skip))

        if(findUser.lenght === 0){
            next( new ErrorHandler('user is not found', 404))
        }

        // find the number total user 
        const totalUser = await User.countDocuments()
        const totalPage = Math.ceil(totalUser/limit)

        // return all the retrieve value
        return res.status(200).json({
            success: true,
            message:'all the user is retrieved',
            users: totalUser,
            pages: totalPage,
            user: findUser
        })
        
                            



    }
    static async getSingleUser(req, res, next){
        const {id} = req.params

        //find the user 
        const findUser = await User.findById(id)
        if(findUser.lenght === 0){
            next( new ErrorHandler('user is not found', 404))
        }

        return res.status(200).json({
            success: true,
            message: 'user is retrieved',
            user: findUser
        })


    }
    static async logInUser(req, res, next){

        // access the email and password
        const {email, password}= req.body

        // check if the user is exist or not
        const findUser = await User.findOne({email})
        if(!findUser){
            next(new ErrorHandler('user is not found',404))
        }

        // check the password is match or not
        const isMatch = bcrypt.compareSync(password, findUser.password)

        if(!isMatch){
            next(new ErrorHandler('invalid credential', 404))
        }

        // make a payload to store in the token
        const payload ={
            id: findUser._id,
            email: findUser.email,
            role: findUser.role
        }

        // to sign in jwt
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        })
        console.log('token--->>>>' , token)

        // set cookie option
        const option ={
            expires: new Date(Date.now()+24*60*60*1000),
            httpOnly: true
        }
        // send the response
        return res.cookie('token', token, option).status(200).json({
            success: true,
            message:'user is logedin',
            token: token
        })
    }
    static async logOutUser(req, res, next){
        const user = req.user
        return res.status(200).json({
            success: true,
            message:' user is logout',
            user: user
        })
    }
    static async changePassword(req, res, next){

    }
    static async forgotPassword(req, res, next){
        
    }
    static async resetPassword(req, res, next){
        
    }










}

export default UserController