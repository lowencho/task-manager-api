const inputName = document.querySelector("#name-input");
const inputEmail = document.querySelector("#email-input");
const inputAge = document.querySelector("#age-input");
const inputPassword = document.querySelector("#password-input");
const registerForm = document.querySelector("form");

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  axios("/profile", {
    method: "GET",
    header: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
});

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  axios
    .post("/users", {
      name: inputName.value,
      email: inputEmail.value,
      age: inputAge.value,
      password: inputPassword.value
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
