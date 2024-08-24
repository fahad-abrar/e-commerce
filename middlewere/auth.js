import jwt from "jsonwebtoken";
import ErrorHandler from "../errorhandler/errHandler.js";

const isAuthenticate = (req, res, next) => {
  // access the token from the cookie
  const token = req.cookies.token;

  // check if the token is found or not
  if (!token) {
    next(new ErrorHandler("unauthorized to access", 401));
  }
  try {
    // verufy the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user info to the request object
    req.user = decoded;

    // sent to the next middlewere
    next();
  } catch (err) {
    console.log(err);
    next(new ErrorHandler("invalid token", 400));
  }
};

export default isAuthenticate;
