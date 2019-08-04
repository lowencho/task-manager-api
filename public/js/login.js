const signinForm = document.querySelector("form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const validator = document.getElementById("custom-valid");

// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//   "token"
// )}`;

signinForm.addEventListener("submit", e => {
  e.preventDefault();
  // console.log(e);
  axios
    .post("http://localhost:3000/users/login", {
      email: emailInput.value,
      password: passwordInput.value
    })
    .then(response => {
      console.log(response);

      localStorage.setItem("token", response.data.token);
      // console.log(response.status);
      window.location = "/profile";
    })
    .catch(error => {
      // console.log(error.response);
      if (error.response.status === 400) {
        validator.classList.add("custom-show");
      }
    });
});

const token = localStorage.getItem("token");

signinForm.addEventListener("submit", e => {
  e.preventDefault();
  axios
    .get("http://localhost:3000/profile", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      // console.log(response);
    });
});
