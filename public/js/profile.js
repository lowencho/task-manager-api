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
      const taskUl = document.querySelector("ul");
      allTask.forEach(task => {
        console.log(task.description + " " + task.completed);
        const taskList = document.createElement("li");
        taskList.textContent = task.description + " " + task.completed;
        taskUl.appendChild(taskList);
      });
    })
    .catch(error => {
      console.log(error);
    });
});
