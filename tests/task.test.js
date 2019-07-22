const request = require("supertest");
const app = require("../src/app.js");
const task = require("../src/models/tasks.js");
const {
  userOneId,
  userOne,
  setupDatabase,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree
} = require("./fixtures/db.js");

beforeEach(setupDatabase);
test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my test"
    })
    .expect(201);
  const taskId = await task.findById(response.body._id);
  expect(taskId).not.toBeNull();
  expect(taskId.completed).toEqual(false);
});

test("Should get all the task of userOne", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    // const taskId = await task.find(response.body.owner);
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Second user should not delete the first task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const taskId = task.findById(taskOne._id);
  expect(taskId).not.toBeNull();
});
