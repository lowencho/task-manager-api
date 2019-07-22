// const express = require("express");
// require("./db/mongoose.js");
// const user = require("./models/users.js");
// const task = require("./models/tasks.js");
// const userRouter = require("./routers/user.js");
// const taskRouter = require("./routers/task.js");
//
// const app = express();
const app = require("./app.js");
const port = process.env.PORT; //process.env = where environment variable are stored /PORT=provided by heroku

// app.use(express.json());
// app.use(userRouter);
// app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port!" + port);
});
