const mongoose = require("mongoose");

const SettingSchema = mongoose.Schema({
  title: {
    type: String,
    default: 'Welcome To My Blog',
    trim: true,
  },
  description: {
    type: String,
    default: 'Welcome To My Blog',
    trim: true,
  },
  keyword: {
    type: String,
    default: 'Welcome To My Blog',
    trim: true,
  },
  favicon: {
    type: String,
    default: 'Welcome To My Blog',
    trim: true,
  },
  logo: {
    type: String,
    default: 'Welcome To My Blog',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
  
});

// export model Setting with SettingSchema
module.exports = mongoose.model("Setting", SettingSchema);

