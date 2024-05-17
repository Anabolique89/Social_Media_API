const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const collection = require("./config.js");
const bcrypt = require("bcrypt");

require("dotenv").config();

//routes
app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome to the madness" });
});

//connecting to Mongo DB

mongoose
  .connect(process.env.DBHOST)
  .catch((error) => console.log("Error connecting to MongoDB:" + error));

mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

// dotenv.config();

// mongoose.connect(process.env.MONGO_URL);
// console.log("Connected to MongoDB");

// app.listen(8800, () => {
//   console.log("Backend server is running");
// });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("common"));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//connecting to localhost:4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});

//register Users2

app.post("/signup", async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  //check if user already exists
  const existingUser = await collection.findOne({ username: data.username });
  if (existingUser) {
    res.send("User already exists. Please choose another username.");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; //replace hashed pass with original pass

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

//Login users2

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ username: req.body.username });
    if (!check) {
      res.send("Username cannot be found.");
    }
    //compare
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      req.send("wrong passWord");
    }
  } catch {
    res.send("wrong Details");
  }
});
