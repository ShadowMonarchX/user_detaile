const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const postsRoutes = require("./route/posts");
const userRoutes = require("./route/user");

const bodyParser = require("body-parser");
const urlencoded = require("body-parser/lib/types/urlencoded");

mongoose.set("strictQuery", false);
const URL =
  "mongodb+srv://max:FFUvJmnJBbEvuTCW@datenics.7a5fo.mongodb.net/userinformation";

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Conection failed");
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json(urlencoded({ extended: false })));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE, OPTIONS",
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/posts", userRoutes);

module.exports = app;
