import User from "../model/userModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";
import bcrypt from "bcrypt";
import resetToken from "../helper/resetToken.js";
import sendMail from "../helper/sendMail.js";
import redis from "../database/redis.js";
import crypto from "crypto";
import signInJwt from "../helper/signInJwt.js";

class UserController {
  static async registerUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // check if all the fields is provided or not
      if (!name || !email || !password) {
        return next(new ErrorHandler("all the fields are required", 404));
      }
      // check if the user is exist or not
      const existUser = await User.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("user is already  exist", 404));
      }

      // handle the files if it is provided
      if (req.files && req.files.avatar) {
        console.log(req.files);
      }

      // create a new user
      const newUser = await User.create({
        name,
        email,
        password,
        role,
      });

      //set the redis client instance
      const redisClient = redis();

      // send the user into the cashe
      await redisClient.set(`user:${newUser._id}`, JSON.stringify(newUser));

      // return the file
      return res.status(200).json({
        success: false,
        message: "user is created",
        user: newUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async updateUser(req, res, next) {
    try {
      const { id } = req.user;
      const info = req.body;

      // find the user is exist or not
      const findUser = await User.findById(id);

      // check is the user is find or not
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // update the user profile
      const upUser = await User.findByIdAndUpdate(id, info, {
        new: true,
        runValidators: true,
      });

      // return the file
      return res.status(200).json({
        success: false,
        message: "user is updated",
        user: upUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getAllUser(req, res, next) {
    try {
      const { page = 1, limit = 1 } = req.query;

      // find the authe user
      const { id } = req.user;
      const authUser = await User.findById(id);

      // check if the auth user is exist or not
      if (!authUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      //pagination portion
      if (page < 0) {
        page = 1;
      }
      if (limit < 0) {
        limit = 1;
      }
      const skip = (page - 1) * limit;

      // find all the user
      const findUser = await User.find()
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      if (findUser.lenght === 0) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // find the number total user
      const totalUser = await User.countDocuments();
      const totalPage = Math.ceil(totalUser / limit);

      // return all the retrieve value
      return res.status(200).json({
        success: true,
        message: "all the user is retrieved",
        users: totalUser,
        pages: totalPage,
        user: findUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getSingleUser(req, res, next) {
    try {
      //find the user
      const { id } = req.params;
      const findUser = await User.findById(id);
      if (findUser.lenght === 0) {
        return next(new ErrorHandler("user is not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "user is retrieved",
        user: findUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getUser(req, res, next) {
    try {
      // find the authe user
      const { id } = req.user;
      const authUser = await User.findById(id);

      // check if the auth user is exist or not
      if (!authUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // return the response
      return res.status(200).json({
        success: true,
        message: "user is retrieved",
        user: authUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async logInUser(req, res, next) {
    try {
      // access the email and password
      const { email, password } = req.body;

      // check if the user is exist or not
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // check the password is match or not
      const isMatch = bcrypt.compareSync(password, findUser.password);

      if (!isMatch) {
        return next(new ErrorHandler("invalid credential", 404));
      }

      // generate jwt token
      const token = signInJwt(findUser);

      // set cookie option
      const option = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      //set the redis client instance
      const redisClient = redis();

      // remove user from the cashe
      await redisClient.set(`user:${findUser._id}`, JSON.stringify(findUser));

      // send the response
      return res.cookie("token", token, option).status(200).json({
        success: true,
        message: "user is logged in",
        token: token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async logOutUser(req, res, next) {
    try {
      // access the id from the auth user
      const { id } = req.user;

      // find the auth user
      const authUser = await User.findById(id);
      if (!authUser) {
        return next(new ErrorHandler("invalid credential", 404));
      }

      // set the cookie option
      const option = {
        expires: new Date(Date.now() + 10),
        httpOnly: true,
      };

      //set the redis client instance
      const redisClient = redis();

      // remove user from the cashe
      await redisClient.del(`user:${authUser._id}`);

      // clear the cookie and send the response
      return res.cookie("token", null, option).status(200).json({
        success: true,
        message: " user is logout",
        user: authUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async changePassword(req, res, next) {
    try {
      //access the id and password
      const { id } = req.user;
      const { password, confirmPassword } = req.body;

      // find the auth user
      const authUser = await User.findById(id);
      if (!authUser) {
        return next(new ErrorHandler("auth user is not found", 404));
      }

      // check if the password and confirm password are same or not
      if (password !== confirmPassword) {
        return next(
          new ErrorHandler("password and confirmPassword sholud be same", 404)
        );
      }

      // verify the password
      const isMatch = bcrypt.compareSync(password, authUser.password);

      //check if the given password is macth or not
      if (!isMatch) {
        return next(new ErrorHandler("incorrect password", 400));
      }

      // save the new password
      authUser.password = password;
      await authUser.save();

      return res.status(200).json({
        success: true,
        message: " password is changed",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // check is the user is exist or not
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return next(new ErrorHandler("user is not exist", 404));
      }
      // generate the token and its expiration time
      const { token, hashToken, expires } = resetToken();

      // store the token and its expires
      findUser.resetPasswordToken = hashToken;
      findUser.resetPasswordExpires = expires;
      await findUser.save();

      // generate link to reset password
      const link = `${req.protocol}://${req.get(
        "host"
      )}/api/auth/password/reset/${token}`;

      try {
        // create a messsage
        const text = `your  reset password token is :- \n\n ${link} \n\n if you have not requested this , plz ignore it`;
        const subject = "request for reset password";
        const mailBody = {
          to: findUser.email,
          subject,
          text,
        };

        //await sendMail(mailBody)

        // send the response
        return res.status(200).json({
          success: true,
          message: "link send to the user email",
          mailBody: mailBody,
          link: link,
        });
      } catch (err) {
        findUser.resetPasswordToken = undefined;
        findUser.resetPasswordExpires = undefined;
        await findUser.save();
        return next(new ErrorHandler("fail to  send mail", 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;

      const hashToken = crypto.createHash("sha256").update(token).digest("hex");
      // find the existing user
      const findUser = await User.findOne({
        resetPasswordToken: hashToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // check if the new pass and confirm pass are same or not
      if (newPassword !== confirmPassword) {
        return next(
          new ErrorHandler("new pass and confirm pass should be same", 404)
        );
      }
      // save the new password and clear the token
      findUser.password = newPassword;
      findUser.resetPasswordToken = undefined;
      findUser.resetPasswordExpires = undefined;
      await findUser.save();

      return res.status(200).json({
        success: true,
        message: "password is updated",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

export default UserController;
