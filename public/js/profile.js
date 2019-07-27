const createTask = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");
const tasks = document.querySelector("#tasks");
const deleteTask = document.querySelector("#delete");
const updateTask = document.querySelector("#update");
const inputID = document.querySelector("#id");

const token = localStorage.getItem("token");

//View
const taskUl = document.querySelector("#ul");
const taskComp = document.querySelector("span");

//Logout
const logoutButton = document.querySelector("#logout");

//Create Task
createTask.addEventListener("submit", e => {
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

      const data = response.data.description + " " + response.data.completed;
      taskUl.insertAdjacentHTML("beforeend", `<li>${data}</li>`);
    })
    .catch(error => {
      console.log(error);
    });
});

//Delete Task
deleteTask.addEventListener("click", e => {
  axios.delete(
    "http://localhost:3000/tasks/" + encodeURIComponent(inputID.value),
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );
});

//Update Task
deleteTask.addEventListener("click", e => {
  axios.patch(
    "http://localhost:3000/tasks/" + encodeURIComponent(inputID.value),
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );
});

//Read Task
window.addEventListener("load", e => {
  axios
    .get("http://localhost:3000/tasks", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response.data);
      const allTask = response.data; //Array of the task

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

//Logout User
logoutButton.addEventListener("click", e => {
  console.log("Clicked");
  axios
    .post("http://localhost:3000/users/logout", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response);
      window.location = "/signin";
    })
    .catch(error => {
      console.log(error);
    });
});
