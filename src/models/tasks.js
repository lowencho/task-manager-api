const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, //id of the user who created it
      required: true,
      ref: "User" // reference to user model
    }
  },
  { timestamps: true } //false by default
);

const task = mongoose.model("Tasks", taskSchema);

module.exports = task;
