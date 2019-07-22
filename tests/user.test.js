const request = require("supertest");
const app = require("../src/app.js");
const user = require("../src/models/users.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db.js");

// const userOneId = new mongoose.Types.ObjectId();
//
// const userOne = {
//   _id: userOneId,
//   name: "Mike",
//   email: "mike@example.com",
//   password: "123example",
//   tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
// };

// beforeEach(async () => {
//   await user.deleteMany();
//   await new user(userOne).save();
// });

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Lowencho",
      email: "lowencholawliet@gmail.com",
      password: "lowencho22"
    })
    .expect(201);

  //Assert that the database was changed correctly
  const userId = await user.findById(response.body.user._id);

  expect(userId).not.toBeNull();

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Lowencho"
    },
    token: userId.tokens[0].token
  });

  expect(userId.password).not.toBe("password");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);
  const userId = await user.findById(userOneId);
  //Assert that the token in response matches users second token
  expect(response.body.token).toBe(userId.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "renzo.leynes22@gmail.com", password: userOne.password })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unathenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert that user is no where be found
  const userId = await user.findById(userOneId);
  expect(userId).toBeNull();
});

test("Should not delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const userId = await user.findById(userOneId);
  expect(userId.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Jess" })
    .expect(200);
  const userId = await user.findById(userOneId);
  expect(userId.name).toEqual("Jess");
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "USA" })
    .expect(400);
});
