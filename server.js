require("dotenv").config();
require("express-async-errors");
//SetUp
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/connect");
const blogs = require("./routes/blogs");
// const authenticationMiddleware = require("./middleware/auth");
const path = require("path");
const errorHandler = require("./errors/errorPage");
const notFound = require("./errors//notFound");

//MiddleWares
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.limit(100000000));
// app.use(express.json());
//Home Routes
app.get("/", (req, res) => {
  res
    .status(200)
    .send('<h1>Home Page</h1><a href = "/app/v1/blogs">ReDirect</a>');
});

//Tasks Route
// app.use(authenticationMiddleware);
app.use("/app/v1/blogs", blogs);
app.use(notFound);
app.use(errorHandler);

//Port
const port = process.env.PORT || 5000;

//*******************Deployment ********************
// ... other app.use middleware
// app.use(express.static(path.join(__dirname, "..", "Frontend", "build")));
// // ...
// // Right before your app.listen(), add this:
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "Frontend", "build", "index.html"));
// });

//*******************Deployment ********************
const MONGO_URI = process.env.MONGO_URI;
// "mongodb+srv://venkateshprasad:Venku9980809652!@nodeexpressprojects.akouw.mongodb.net/BlogPosts?retryWrites=true&w=majority";

const start = async () => {
  try {
    console.log(process.env);
    await connectDB(MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
