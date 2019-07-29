const createTask = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");
const tasks = document.querySelector("#tasks");
const deleteTask = document.querySelector("#delete");
const updateTask = document.querySelector("#update");
const inputID = document.querySelector("#id");
const deleteAccount = document.querySelector("#delete-account");

//Avatar menus
const profilePhoto = document.querySelector("#profile-photo");
const choosePhoto = document.querySelector("#choose-image-upload");
const uploadPhoto = document.querySelector("#image-upload");
const deletePhoto = document.querySelector("#image-delete");
const updatePhoto = document.querySelector("#update-avatar");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-button");
const imagePreview = document.querySelector("#image-preview");

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

//Upload image to db
uploadPhoto.addEventListener("click", e => {
  const formData = new FormData();
  formData.append("avatar", choosePhoto.files[0]);
  axios
    .post("http://localhost:3000/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response);
      const imageBuffer = response.data.avatar.data;
    })
    .catch(error => {
      console.log(error);
    });
});

//Delete image
deletePhoto.addEventListener("click", e => {
  axios.delete("http://localhost:3000/users/me/avatar", {
    headers: { Authorization: "Bearer " + token }
  });
});

//Update Photo modal
updatePhoto.addEventListener("click", () => {
  modal.style.display = "block";
});

window.onclick = () => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

//Image preview
choosePhoto.addEventListener("change", () => {
  const reader = new FileReader();
  const photo = choosePhoto.files[0];

  reader.addEventListener(
    "load",
    () => {
      imagePreview.src = reader.result;
    },
    false
  );
  if (photo) {
    reader.readAsDataURL(photo);
  }
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
