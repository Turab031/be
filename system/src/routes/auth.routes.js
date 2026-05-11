const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.get("/get-me", authController.getMe);
authRouter.get("/refresh-token",authController.refreshToken)

authRouter.get("/logout",authController.logout)

module.exports = authRouter;
