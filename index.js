const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./router/user");
const blog = require("./router/blog");
const setting = require("./router/setting");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/api", user);
app.use("/api", blog);
app.use("/api", setting);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});