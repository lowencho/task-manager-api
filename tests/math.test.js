const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add
} = require("../src/math.js");

test("Should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
  // if (total !== 13) {
  //   throw new Error("Total should be 13. Got " + total);
  // }
});

test("Should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

//TESTING ASYNC CODE
// test("Async test demo", done => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done(); //can be called whatever you wanted
//   }, 2000);
// });

test("Should add two numbers", done => {
  add(2, 3).then(sum => {
    expect(sum).toBe(5);
    done();
  });
});

test("Should add two number async/await", async done => {
  const sum = await add(2, 3);
  expect(sum).toBe(5);
  done();
});

// test("Hello World", () => {});
//
// test("This should fail", () => {
//   throw new Error("Failure");
// });
