const createTask = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");
const tasks = document.querySelector("#tasks");
const deleteTask = document.querySelector("#delete");
const updateTask = document.querySelector("#update");
const inputID = document.querySelector("#id");
const deleteAccount = document.querySelector("#delete-account");

const token = localStorage.getItem("token");

//View
const taskUl = document.querySelector("#ul");

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

      // const data = response.data.description + " " + response.data.completed;
      if (response.data.completed === true) {
        data = response.data.description + " " + "✔";
      } else {
        data = response.data.description + " " + "✖";
      }

      taskUl.insertAdjacentHTML("beforeend", `<li>${data}</li>`);
      inputDesc.value = "";
      inputComp.value = "";
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
updateTask.addEventListener("click", e => {
  const dataBody = {
    description: inputDesc.value,
    completed: inputComp.value
  };

  axios
    .patch(
      "http://localhost:3000/tasks/" + encodeURIComponent(inputID.value),
      dataBody,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then(response => {});
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
      // console.log(response);
      // console.log(response.data);
      const allTask = response.data; //Array of the task

      // profilePhoto.src = "data:image/jpg;base64,";

      allTask.forEach(task => {
        // console.log(task.description + " " + task.completed);
        const taskList = document.createElement("li");

        // taskList.textContent = task.description + " " + task.completed;

        if (task.completed === true) {
          taskList.textContent = task.description + " " + "✔";
        } else {
          taskList.textContent = task.description + " " + "✖";
        }
        taskUl.appendChild(taskList);
      });
    })
    .catch(error => {
      console.log(error);
    });
});

//Logout User
logoutButton.addEventListener("click", e => {
  const dataBody = {};
  console.log("Clicked");
  axios
    .post("http://localhost:3000/users/logout", dataBody, {
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

//Delete Account
deleteAccount.addEventListener("click", () => {
  // const data = {};
  axios
    .delete("http://localhost:3000/users/me", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(response => {
      console.log(response);
      window.location = "/";
    });
});
