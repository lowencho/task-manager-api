const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const task = require("./tasks.js");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("The email is invalid!");
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      }
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must not contain 'password' keyword");
        }
      }
    },
    avatar: {
      type: Buffer
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true } //false by default
);

//create a virtual(not stored in database)
//relation
userSchema.virtual("tasks", {
  ref: "Tasks", //reference to tasks model
  localField: "_id", //user id
  foreignField: "owner"
});

//instance methods
//hide tokens and password, and avatar data from user
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//instances method
//Generating tokens
userSchema.methods.generateAuthToken = async function() {
  //for 'this' binding problems
  const user = this; // the document
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); //Create token
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// models method
//Sign in checking
userSchema.statics.findByCredentials = async (email, password) => {
  // console.log({ email, password });
  const userEmail = await user.findOne({ email: email });
  // console.log(userEmail);
  if (!userEmail) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, userEmail.password);
  // console.log(isMatch);
  // console.log(userEmail.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return userEmail;
};

//Hash the plain text password before saving
userSchema.pre("save", async function(next) {
  //pre = before the event(save), post = after the event (save)
  const user = this; //this = document being saved

  if (user.isModified("password")) {
    //true to updating and creating an account
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); // To determine when the function is over/done.
});

//Delete user's task when the user is removed/deleted
userSchema.pre("remove", async function(next) {
  const user = this;
  await task.deleteMany({ owner: user._id });
  next();
});

const user = mongoose.model("User", userSchema);

module.exports = user;
