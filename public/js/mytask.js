const createTask = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");
const tasks = document.querySelector("#tasks");
const deleteTask = document.querySelector("#delete");
const updateTask = document.querySelector("#update");
const inputPosition = document.querySelector("#position");
const sortByCompleted = document.querySelector("#sort-input");
const sort = document.querySelector("#sort");

const token = localStorage.getItem("token");

//View
const taskUl = document.querySelector("#ul");

//Logout
const logoutButton = document.querySelector("#logout");
const deleteAccount = document.querySelector("#delete-account");
const profileSetting = document.querySelector("#profile-setting");
const dropdownCon = document.getElementById("dropdown-setting");

var taskArray = [];
// console.log(taskArray);

const view = {
  display() {
    taskUl.innerHTML = "";
    taskArray.forEach(task => {
      const taskList = document.createElement("li");

      if (task.completed === true) {
        taskList.textContent = task.description + " " + "✔";
      } else {
        taskList.textContent = task.description + " " + "✖";
      }
      taskUl.appendChild(taskList);
    });
  }
};

//Create Task
createTask.addEventListener("submit", e => {
  e.preventDefault();
  axios
    .post(
      "/tasks",
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
      console.log(response.data);
      const task = response.data;
      taskArray.push(task);
      view.display();

      // const data = response.data.description + " " + response.data.completed;
      // if (task.completed === true) {
      //   data = task.description + " " + "✔";
      // } else {
      //   data = task.description + " " + "✖";
      // }
      //
      // taskUl.insertAdjacentHTML("beforeend", `<li>${data}</li>`);

      inputDesc.value = "";
      inputComp.value = "";
    })
    .catch(error => {
      console.log(error);
    });
});

//Delete Task
deleteTask.addEventListener("click", e => {
  axios
    .delete(
      "/tasks/" + encodeURIComponent(taskArray[inputPosition.value]._id),
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then(response => {
      taskArray.splice(inputPosition.value, 1);
      view.display();
    });
});

//Update Task
updateTask.addEventListener("click", e => {
  const dataBody = {
    description: inputDesc.value,
    completed: inputComp.value
  };

  axios
    .patch(
      "/tasks/" + encodeURIComponent(taskArray[inputPosition.value]._id),
      dataBody,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then(response => {
      taskArray[inputPosition.value].description = inputDesc.value;
      taskArray[inputPosition.value].completed = inputComp.value;
      view.display();

      inputDesc.value = "";
      inputComp.value = "";
    });
});

//Read Task
window.addEventListener("load", e => {
  axios
    .get("/tasks", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      const allTask = response.data; //Array of the task

      // taskUl.innerHTML = "";
      allTask.forEach(task => {
        taskArray.push(task);
        // console.log(task.description + " " + task.completed);
        // const taskList = document.createElement("li");
        // // taskList.textContent = task.description + " " + task.completed;
        //
        // if (task.completed === true) {
        //   taskList.textContent = task.description + " " + "✔";
        // } else {
        //   taskList.textContent = task.description + " " + "✖";
        // }
        // taskUl.appendChild(taskList);
      });
      view.display();
    })
    .catch(error => {
      console.log(error);
    });
});

//Dropdown for logging out / Delete account
profileSetting.addEventListener("click", () => {
  dropdownCon.classList.toggle("show");
});

//Close dropdown if the user click outside
window.addEventListener("click", e => {
  // console.log(e);
  const dropdown = document.getElementsByClassName("dropdown-content");
  //!matches button
  if (!e.target.matches(".profile-set")) {
    //div dropdown
    for (var i = 0; i < dropdown.length; i++) {
      if (dropdown[i].classList.contains("show")) {
        dropdown[i].classList.remove("show");
      }
    }
  }
});

//Logout User
logoutButton.addEventListener("click", e => {
  const dataBody = {};
  console.log("Clicked");
  axios
    .post("/users/logout", dataBody, {
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
  axios
    .delete("/users/me", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(response => {
      console.log(response);
      window.location = "/";
    });
});

//Sort by Completed
sortByCompleted.addEventListener("change", () => {
  console.log("changed");
  if (sortByCompleted.value === "true") {
    axios
      .get("/tasks?completed=true", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(response => {
        console.log(response.data);
        const taskComplete = response.data;
        taskUl.innerHTML = "";
        // view.display();
        taskComplete.forEach(task => {
          const taskList = document.createElement("li");

          taskList.textContent = task.description + " " + "✔";

          taskUl.appendChild(taskList);
        });
      });
  } else if (sortByCompleted.value === "false") {
    axios
      .get("/tasks?completed=false", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(response => {
        console.log(response.data);
        const taskComplete = response.data;
        taskUl.innerHTML = "";
        // view.display();
        taskComplete.forEach(task => {
          const taskList = document.createElement("li");

          taskList.textContent = task.description + " " + "✖";

          taskUl.appendChild(taskList);
        });
      });
  } else {
    view.display();
  }
});

//Read first char
window.addEventListener("load", () => {
  axios
    .get("/users/me", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      const getFirstChar = () => {
        const char = response.data.name;
        return char.charAt(0);
      };

      profileSetting.textContent = getFirstChar();
    });
});
