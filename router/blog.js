const express = require("express");
const { check, validationResult } = require("express-validator");
const {simple, enhance } = require("../middleware/auth");
const slugify = require('slugify');
const Blog = require("../model/Blog");
const User = require("../model/User");
const { nanoid } = require('nanoid');
const blogRouter = express.Router();
/**
 * Add New blog
*/

/* 
Admin Get All Blog 
*/
blogRouter.get("/blog", simple, async (req, res) => {
  const allblogs = await Blog.find({}).sort({ _id: -1 });
  try {
      res.status(201).json(allblogs);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
/* Admin Post Blog */
blogRouter.post("/blog", simple, async (req, res) => {
  const user = await User.findById(req.user.id);
  const { title, body, tags, image } = req.body;
  
  const blog = new Blog({
        title,
        body,
        slug: slugify(title, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: false
        })+"-"+nanoid(6),
        source: user.username,
        tags,
        image
    });
  try {
    
    const newBlog = await blog.save();
    res.status(201).json({"id": newBlog._id});
  } catch (e) {
    res.status(401).json({"error":"server side error"});
  }
});

blogRouter.delete("/blog/all", simple, async (req,res) => {
    try {
      await Blog.remove({})
      res.status(201).json({"msg":"all blog deleted"});
    } catch (e) {
      res.status(400).json({"error": "Server Side Error"});
    }
});
/* Admin Change Blog View */
blogRouter.patch("/blog", simple, async (req, res) => {
  const {slug} = req.body;
  const blog = await Blog.findOne({ slug: req.body.slug});
   blog.pub = 'publish';
   await blog.save();
  try {
      res.status(201).json(blog);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/* User Get Publish blog */
blogRouter.get("/v1/blog", async (req, res) => {
  const allblogs = await Blog.find({ pub: "publish"}).sort({ _id: -1 });
  try {
      res.status(201).json(allblogs);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/* Read Blog */
blogRouter.get("/v1/blog/:slug", async (req, res) => {
  const reqslug = req.params.slug;
  const readBlog = await Blog.find({ slug: reqslug});
  try {
      res.status(201).json(readBlog);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
/* User Search */
blogRouter.post("/v1/search", async (req, res) => {
   const {ser} = req.body;
   const allblogs = await Blog.find({ title: { $regex: req.body.ser, $options: "i" } , pub: "publish"});
   try {
     res.status(201).json(allblogs);
   } catch (e) {
     res.status(401).json({"msg":"error server side"});
   }
});
module.exports = blogRouter;
