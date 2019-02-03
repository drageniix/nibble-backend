const { body } = require("express-validator/check");
const commonMiddleware = require("./common");

exports.validateMenu = [commonMiddleware.inputValidation];
