const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const user = require("../../src/models/users.js");
const task = require("../../src/models/tasks.js");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Jayson",
  email: "jayson22@example.com",
  password: "123example",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: "Andrew",
  email: "andrew@example.com",
  password: "hello123",
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second Task",
  completed: true,
  owner: userOne._id
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third Task",
  completed: false,
  owner: userTwo._id
};

const setupDatabase = async () => {
  await user.deleteMany();
  await task.deleteMany();
  await new user(userOne).save();
  await new user(userTwo).save();
  await new task(taskOne).save();
  await new task(taskTwo).save();
  await new task(taskThree).save();
};

module.exports = {
  userOne,
  userOneId,
  setupDatabase,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree
};
