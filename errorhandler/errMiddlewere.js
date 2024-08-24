import ErrorHandler from "./errHandler.js";

const errMiddlewere = (err, req, res, next) => {
  // set as default error
  (err.message = err.message || "internal server error"),
    (err.statusCode = err.statusCode || 500);

  // another coutom error
  if (err.name === "CastError") {
    const message = `invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // jwt token error
  if (err.name === "JsonWebTokenError") {
    const message = "invalid json web token";
    err = new ErrorHandler(message, 400);
  }

  // jwt token expire error
  if (err.name === "TokenExpiredError") {
    const message = `jwt token is expired`;
  }

  // duplicate key error (duplicate email in mongodb )
  if (err.code === 11000) {
    err.message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // return the error respose
  return res.status(err.statusCode).json({
    success: false,
    message: err.message || "internam server error",
    err: err,
  });
};

export default errMiddlewere;
