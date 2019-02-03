const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

exports.isAuth = (req, res, next) => {
  let decodedToken;
  const authHeader = req.get("Authorization");
  if (
    authHeader &&
    (decodedToken = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET
    ))
  ) {
    req.userId = decodedToken.userId;
  } else {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    next(error);
  }
  next();
};

exports.inputValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array({ onlyFirstError: true });
    next(error);
  }
  next();
};
