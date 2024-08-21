import User from '../model/userModel.js'
import ErrorHandler from '../errorhandler/errHandler.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import resetToken from '../helper/resetToken.js'
import sendMail from '../helper/sendMail.js'
import crypto from 'crypto'

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
 
        // create a new user
        const newUser = await User.create({
            name, 
            email, 
            password, 
            role,
            avatar:{
                public_id,
                url
            } 
        })
        const token = newUser.getJWTToken()

        // return the file
        return res.status(200).json({
            success: false,
            message:'user is created',
            token: token,
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

        // generate jwt token
        const token = findUser.getJWTToken()

        // set cookie option
        const option ={
            expires: new Date(Date.now()+24*60*60*1000),
            httpOnly: true
        }
        // send the response
        return res.cookie('token', token, option).status(200).json({
            success: true,
            message:'user is logged in',
            token: token
        })
    }
    static async logOutUser(req, res, next){

        // access the id from the auth user
        const {id} = req.user

        // find the auth user
        const authUser = await User.findById(id)
        if(!authUser){
            next(new ErrorHandler('invalid credential', 404))
        }

        // set the cookie option
        const option = {
            expires : new Date(Date.now()+10),
            httpOnly: true
        }

        // clear the cookie and send the response
        return res.cookie('token', null, option).status(200).json({
            success: true,
            message:' user is logout',
            user: authUser
        })
    }
    static async changePassword(req, res, next){
        //access the id and password
        const {id} = req.user
        const {password, confirmPassword} = req.body

        // find the auth user
        const authUser = await User.findById(id)
        if(!authUser){
            next( new ErrorHandler('auth user is not found', 404))
        }

        // check if the password and confirm password are same or not
        if(password !== confirmPassword){
            next( new ErrorHandler('password and confirmPassword sholud be same', 404))
        }

        // verify the password
        const isMatch = bcrypt.compareSync(password, authUser.password)

        //check if the given password is macth or not
        if(!isMatch){
            next( new ErrorHandler('incorrect password', 400))
        }

        // save the new password
        authUser.password = password
        await authUser.save()

        return res.status(200).json({
            success: true,
            message: ' password is changed'
        })


    }
    static async forgotPassword(req, res, next){
        const {email} = req.body

        // check is the user is exist or not
        const findUser = await User.findOne({email})
        if(!findUser){
           return next( new ErrorHandler('user is not exist', 404))
        }
        // generate the token and its expiration time
        const {token, hashToken, expires} = resetToken()

        // store the token and its expires
        findUser.resetPasswordToken = hashToken
        findUser.resetPasswordExpires = expires
        await findUser.save()

        // generate link to reset password
        const link = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${token}`

        try {
            // create a messsage
            const text = `your  reset password token is :- \n\n ${link} \n\n if you have not requested this , plz ignore it`
            const subject = 'request for reset password'
            const mailBody = {
                to: findUser.email,
                subject,
                text
            }
            
            //await sendMail(mailBody)

            // send the response 
            return res.status(200).json({
                success: true,
                message:'link send to the user email',
                mailBody: mailBody,
                link: link
            })

        } catch (err) {
            findUser.resetPasswordToken = undefined
            findUser.resetPasswordExpires = undefined
            await findUser.save()
            return next( new ErrorHandler('fail to  send mail', 500))            
        }
    }
    static async resetPassword(req, res, next){

        const {token} = req.params
        const {newPassword, confirmPassword} = req.body

        const hashToken = crypto.createHash('sha256')
                                .update(token)
                                .digest('hex')
        // find the existing user
        const findUser = await User.findOne({resetPasswordToken: hashToken,
            resetPasswordExpires:{$gt: Date.now()}
        })
        if(!findUser){
            return next( new ErrorHandler('user is not found', 404)) 
        }   
        
        // check if the new pass and confirm pass are same or not
        if(newPassword !== confirmPassword){
            return next( new ErrorHandler('new pass and confirm pass should be same', 404)) 

        }
        // save the new password and clear the token
        findUser.password = newPassword
        findUser.resetPasswordToken = undefined;
        findUser.resetPasswordExpires = undefined;
        await findUser.save()

        return res.status(200).json({
            success: true,
            message:'password is updated'
        })
    }
}

export default UserController