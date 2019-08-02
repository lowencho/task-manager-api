//Avatar menus
const profilePhoto = document.querySelector("#profile-photo");
const choosePhoto = document.querySelector("#choose-image-upload");
const uploadPhoto = document.querySelector("#image-upload");
const deletePhoto = document.querySelector("#image-delete");
const updatePhoto = document.querySelector("#update-avatar");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-button");
const imagePreview = document.querySelector("#image-preview");

//User info
const userName = document.querySelector("#user-name");
const userId = document.querySelector("#user-id");
const userEmail = document.querySelector("#user-email");
const userAge = document.querySelector("#user-age");

const token = localStorage.getItem("token");

//Upload image to db
uploadPhoto.addEventListener("click", e => {
  const formData = new FormData();
  formData.append("avatar", choosePhoto.files[0]);
  console.log(choosePhoto.files[0]);
  axios
    .post("http://localhost:3000/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response);
      // const imageBuffer = response.data.avatar.data;
      var imageBuffer = btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(response.data.avatar.data)
        )
      );
      // console.log(base64String);
      profilePhoto.src = "data:image/jpg;base64," + imageBuffer;
      localStorage.setItem("imageBuffer", imageBuffer);
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

//Read user profile
window.addEventListener("load", () => {
  axios
    .get("http://localhost:3000/users/me", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      console.log(response);
      userName.textContent = "Name: " + response.data.name;
      userId.textContent = "ID: " + response.data._id;
      userEmail.textContent = "Email: " + response.data.email;
      userAge.textContent = "Age: " + response.data.age;

      //Read Avatar
      axios
        .get(
          "http://localhost:3000/users/" +
            encodeURIComponent(response.data._id) +
            "/avatar"
        )
        .then(response => {
          console.log(response);
          profilePhoto.src = "data:image/jpg;base64,";
        });
      // const imageBuffers = btoa(
      //   String.fromCharCode.apply(null, new Uint8Array(response.data))
      // );
      // const myAvatar = localStorage.getItem("imageBuffer");
      // profilePhoto.src = "data:image/jpg;base64," + myAvatar;
    })

    .catch(error => {
      console.log(error);
    });
});
