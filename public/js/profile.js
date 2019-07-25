const createForm = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");
const tasks = document.querySelector("#tasks");

const token = localStorage.getItem("token");

createForm.addEventListener("submit", e => {
  e.preventDefault();

  axios
    .post(
      "http://localhost:3000/tasks",
      {
        description: inputDesc.value,
        completed: inputComp.value
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
});

window.addEventListener("load", e => {
  axios
    .get("http://localhost:3000/tasks", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response.data);
      const allTask = response.data;
      allTask.forEach(task => {
        console.log(task.description);
      });
    })
    .catch(error => {
      console.log(error);
    });
});
