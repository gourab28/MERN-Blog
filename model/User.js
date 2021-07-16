const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'admin', 'superadmin'],
    },
  tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'mySecret');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hash the plain text password before save
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);

