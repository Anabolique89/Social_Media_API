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
app.use(helmet());
app.use(morgan("common"));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

//connecting to localhost:4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});
