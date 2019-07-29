const user = require("../models/users.js");
const express = require("express");
const router = express.Router();
// const router = require("express").Router(); //Create new instance
const auth = require("../middleware/auth.js");
const multer = require("multer");
const sharp = require("sharp");

//Sending emails
const {
  sendWelcomeEmail,
  cancelAccountEmail
} = require("../emails/account.js");

//Create user
router.post("/users", async (req, res) => {
  const me = new user({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password
  });

  try {
    await me.save();
    sendWelcomeEmail(me.email, me.name); // a promise also
    const token = await me.generateAuthToken();
    // res.redirect("/profile");

    res.status(201).send({ user: me, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Find/Get all the users (not applicable anymore)
//View profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Signing in - finding user by their credentials
router.post("/users/login", async (req, res) => {
  // console.log(req.body);
  try {
    const userCredentials = await user.findByCredentials(
      req.body.email,
      req.body.password
    );
    // console.log(userCredentials);
    const token = await userCredentials.generateAuthToken();
    // console.log(token);
    res.send({ user: userCredentials, token }); //short-hand mode
    // res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

//User logout in specific device
router.post("/users/logout", auth, async (req, res) => {
  try {
    //removing an item from token's array
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//User logout in all devices
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //wipe out all the tokens
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//Update user
router.patch("/users/me", auth, async (req, res) => {
  //Checking if the user's input meets the properties that allows update
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    // userId[update] === userId.[name or email and etc.]. Same goes for req.body[update]
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete user by ID (by ID is not applicable anymore)
//Refactor, add authentication
router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    await req.user.remove(); //removing a user who's authenticated
    cancelAccountEmail(req.user.email, req.user.name);
    res.send(req.user);
    // res.status(200).send(userDelete);
  } catch (error) {
    res.status(500).send(error);
  }
});

//
const upload = multer({
  // dest: "avatars",
  limits: { fileSize: 1000000 }, //=1mb ,in bytes
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image!"));
    }
    cb(undefined, true);
  }
});

//Uploading an avatar image
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //takes the buffer and converts image to png format and resize
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;

    await req.user.save();
    res.send({ avatar: req.user.avatar });
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

//Delete an avatar image
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//View avatar image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const userId = await user.findById(req.params.id);

    if (!userId || !userId.avatar) {
      throw new Error("No user/id found.");
    }
    // res.set("Content-Type", "image/jpg");
    res.set("Content-Type", "image/png");
    res.send(userId.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

//Read User profile
router.get("/profile", (req, res) => {
  res.render("profile");
});

//serving register
router.get("", (req, res) => {
  res.render("register");
});

//serving login
router.get("/signin", (req, res) => {
  res.render("login");
});

//serving tasks
// router.get("/Mytasks", (req, res) => {
//   res.render("myTasks");
// });

module.exports = router;
// module.exports = function(app) {
//   app.use("", router);
// };
