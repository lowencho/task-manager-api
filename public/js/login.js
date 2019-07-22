const signinButton = document.querySelector("#input-submit");
const signinForm = document.querySelector("form");

signinForm.addEventListener("submit", e => {
  e.preventDefault();
  fetch("http://localhost:3000/users/login", { method: "POST" }).then(
    response => {
      response.json().then(data => {
        console.log(data.token);
      });
    }
  );
});
