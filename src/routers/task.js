const express = require("express");
const router = new express.Router();
const task = require("../models/tasks.js");
const auth = require("../middleware/auth.js");

//create task
router.post("/tasks", auth, async (req, res) => {
  // const me = new task(req.body);
  const me = new task({ ...req.body, owner: req.user._id });
  try {
    await me.save();
    res.status(201).send(me);
  } catch (error) {
    res.status(400).send(error);
  }

  // me.save()
  //   .then(result => {
  //     res.status(201).send(me);
  //   })
  //   .catch(error => {
  //     res.status(400).send(error);
  //   });
});

//find all the task
//GET /tasks?completed=true/false
//GET /tasks?limit=2&skip=2
//GET /tasks?sortBy=createdAt_desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true"; // returns boolean
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // if (req.query.completed) {
    //   const taskFind = await task.findOne({
    //     owner: req.user._id,
    //     completed: req.query.completed
    //   });
    //   res.send(taskFind);
    // } else {
    //   const taskFind = await task.find({ owner: req.user._id });
    //   res.send(taskFind);
    // }
    // await req.user.populate("tasks").execPopulate();
    console.log(req.user);
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit), //&
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }

  // task
  //   .find({})
  //   .then(result => {
  //     res.send(result);
  //   })
  //   .catch(error => {
  //     res.status(500).send();
  //   });
});

//Find task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const taskId = await task.findById(_id);
    const taskId = await task.findOne({ _id, owner: req.user._id });
    if (!taskId) {
      return res.status(404).send();
    }
    res.send(taskId);
  } catch (error) {
    res.status(500).send();
  }
  // task
  //   .findById(_id)
  //   .then(result => {
  //     if (!result) {
  //       return res.status(404).send();
  //     }
  //     res.send(result);
  //   })
  //   .catch(error => {
  //     res.status(500).send();
  //   });
});

//update the task
router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body); //returns an array of a given object's own property names
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  console.log(isValidOperation);
  if (!isValidOperation) {
    return res.status(400).send({ Error: "Invalid Updates!" });
  }

  const _id = req.params.id;

  try {
    // const userId = await task.findById(_id);
    const taskId = await task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!taskId) {
      return res.status(404).send();
    }
    updates.forEach(update => (taskId[update] = req.body[update]));
    taskId.save();
    // const findById = await task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    res.status(200).send(taskId);
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    // const taskDelete = await task.findByIdAndDelete(_id);
    const taskDelete = await task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!taskDelete) {
      return res.status(404).send();
    }
    res.send(taskDelete);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
