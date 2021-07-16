const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { auth } = require("../middleware/auth");

async function signUp(req, res) {
  const { username, 
          email, 
          password } = req.body;
    // creating new user with above values.
 {/*   const user = new User({
        username,
        email,
        password,
    }); */}

    try {
      let user = await User.findOne({ email });
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
         
       // const newUser = await user.save();
        res.status(201);
        res.json({"message": "Registration Successfully"});
        // res.json(newUser);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

async function signIn(req, res) {
  const {email , password } = req.body;
  
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
          message: "Incorrect Email or Password !"
        });
      res.status(201);
     res.json({"username": user.username,"email": user.email});
  } catch (error) {
        res.status(500);
        res.json(error);
    }
}

module.exports = { signUp, signIn, };