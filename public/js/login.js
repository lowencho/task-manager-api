const signinForm = document.querySelector("form");

// const getToken = () => {
//   fetch("http://localhost:3000/users/login", {
//     method: "POST"
//   }).then(response => {
//     response.json().then(data => {
//       return data.token;
//     });
//   });
// };
//
// signinForm.addEventListener("submit", e => {
//   e.preventDefault();
//   fetch("http://localhost:3000/profile", {
//     method: "GET",
//     header: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`
//     }
//   });
// });
signinForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log(e);
  axios
    .post("/users/login", {
      email: "Fred",
      password: "Flintstone"
    })
    .then(response => {
      console.log(response);
    });
});

// signinForm.addEventListener("submit", e => {
//   e.preventDefault();
//   fetch("http://localhost:3000/users/login", {
//     method: "POST"
//   }).then(response => {
//     response.json().then(data => {
//       console.log(data.token);
//     });
//   });
// });

//
// signinForm.addEventListener("submit", e => {
//   e.preventDefault();
//   window.location = "/profile";
// });
