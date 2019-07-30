const express = require("express");
require("./db/mongoose.js");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

//Define path express config
const publicDirectoryPath = path.join(__dirname, "../public");

const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//set up handlebars and engine
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Set up directory to serve
app.use(express.static(publicDirectoryPath));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json());
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
