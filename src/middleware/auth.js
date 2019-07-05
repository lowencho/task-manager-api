const jwt = require("jsonwebtoken");
const user = require("../models/users.js");

//authentication
const auth = async (req, res, next) => {
  // console.log("auth middleware");
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //header that a user will provide
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    console.log(decoded._id);
    const userFind = await user.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!userFind) {
      throw new Error();
    }
    req.token = token;
    req.user = userFind;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
