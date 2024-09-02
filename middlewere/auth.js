import jwt, { decode } from "jsonwebtoken";
import redis from "../database/redis.js";
import User from "../model/userModel.js";
import ErrorHandler from "../errorhandler/errHandler.js";

const isAuthenticate = async (req, res, next) => {
  // access the token from the cookie
  const token = req.cookies.token;

  // check if the token is found or not
  if (!token) {
    return next(new ErrorHandler("unauthorized to access", 401));
  }
  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new ErrorHandler("token is not verified", 401));
    }

    const redisClient = redis();
    const casheUser = await redisClient.get(`user:${decode.id}`);

    if (casheUser) {
      req.user = JSON.parse(casheUser);
      return next();
    }

    //attach the user info to the request object
    req.user = await User.findById(decoded.id);

    await redisClient.set(`user:${decoded.id}`, JSON.stringify(decoded));
    //req.user = decoded;

    // sent to the next middlewere
    return next();
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("invalid token", 400));
  }
};

export default isAuthenticate;
