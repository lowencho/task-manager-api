const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

//Define path express config
const publicDirectoryPath = path.join(__dirname, "../public");

//set up handlebars and engine
app.set("view engine", "hbs");

//Set up directory to serve
app.use(express.static(publicDirectoryPath));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(bodyParser.json());

module.exports = app;
