const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {simple, enhance } = require("../middleware/auth");

const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const token = await user.generateAuthToken();

    res.status(201).send({ token });
  } catch (e) {
    res.status(400).send(e);
  }
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
        email
      });
    if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });
    const token = await user.generateAuthToken();
    res.send({ token });
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid username or password' },
    });
  }
});
/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", simple, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.patch('/changepass', simple, async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = ['password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const { user } = req;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/logout', simple, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
