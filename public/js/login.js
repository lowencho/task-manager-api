const signinForm = document.querySelector("form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//   "token"
// )}`;

signinForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log(e);
  axios
    .post("http://localhost:3000/users/login", {
      email: emailInput.value,
      password: passwordInput.value
    })
    .then(response => {
      console.log(response);

      localStorage.setItem("token", response.data.token);

      window.location = "/profile";
    })
    .catch(error => {
      console.log(error);
    });
});

signinForm.addEventListener("submit", e => {
  e.preventDefault();
  axios("http://localhost:3000/profile", {
    method: "GET",
    header: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }).then(response => {
    console.log(response);
  });
});
