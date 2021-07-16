const express = require("express");
const { check, validationResult } = require("express-validator");
const {simple, enhance } = require("../middleware/auth");
const User = require("../model/User");
const Setting = require("../model/Setting");
const settingRouter = express.Router();

// POST WEBSITE SETTINGS
settingRouter.post("/setting/new", simple, async(req, res) => {
  
  const {title, description, keyword, favicon, logo} = req.body;
  
  const setting = new Setting ({
    title,
    description,
    keyword,
    favicon,
  })
  try {
    const newSetting = await setting.save();
    res.status(201).json(newSetting);
  } catch (e) {
    res.status.json({"msg":"this is server side error"})
  }
  
});

settingRouter.get("/settings", simple, async (req, res) => {
  const allsettings = await Setting.findOne({});
  try {
    res.status(201).json(allsettings);
  } catch (e) {
    res.status(401).json({"msg":"this is server error"});
  }
});

settingRouter.patch("/setting/:id", simple, async(req, res) => {
  const _id = req.params.id;
  const {title, description, keyword, favicon, logo} = req.body;
  const setting = await Setting.findOne({ _id });
  
  try {
   setting.title = req.body.title;
   setting.description = req.body.description;
   setting.keyword = req.body.keyword;
   setting.favicon = req.body.favicon;
   setting.logo = req.body.logo;
   await setting.save();
  res.status(201).json({"msg":"changes apply successfully"});
  } catch (e) {
    res.status(401).json(e)
  }
});

module.exports = settingRouter;