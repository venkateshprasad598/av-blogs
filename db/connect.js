const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log("Connecting DB...");
  return mongoose
    .connect("mongodb+srv://venkateshprasad:Venku9980809652!@nodeexpressprojects.akouw.mongodb.net/BlogPosts?retryWrites=true&w=majority")
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
