const express = require("express");
const { signUp, signIn } = require("../auth/signup");

const appRouter = express.Router();

appRouter.route("/signup").post(signUp);
appRouter.route("/login").post(signIn);

module.exports = {
    appRouter,
};
