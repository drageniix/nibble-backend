const express = require("express");

const menuController = require("../controllers/menu");
const menuMiddleware = require("../middleware/menu");
const commonMiddleware = require("../middleware/common");

const router = express.Router();

router.get("/", commonMiddleware.isAuth, menuController.getMenu);

router.put(
  "/",
  commonMiddleware.isAuth,
  menuMiddleware.validateMenu,
  menuController.updateMenu
);
module.exports = router;
