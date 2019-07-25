const createForm = document.querySelector("form");
const inputDesc = document.querySelector("#desc-input");
const inputComp = document.querySelector("#comp-input");

// const readTask = () => {
//   axios.get("http://localhost:3000/tasks");
// };

// const headers = {
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
// };
// var headers = {
//   Authorization: "Bearer " + localStorage.getItem("token"),
//   Accept: "application/json, text/plain, */*",
//   "Content-Type": "application/x-www-form-urlencoded"
// };
// const token = JSON.parse(localStorage.getItem("token"));
// const objHeader = { Authorization: "Bearer " };
// const authentication = JSON.stringify(objHeader);
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
          Authorization: "Bearer "`${token}`
        },
        withCredentials: true
      }
    )
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });

//   const formData = {
//     description: inputDesc.value,
//     completed: inputComp.value
//   };
//   axios({
//     method: "POST",
//     url: "http://localhost:3000/tasks",{
//     headers: {
//       "Content-Type": "multipart/form-data",
//       'Authorization': `Bearer ${token}`
//     },withCredentials:true},
//     data: formData
//   });
// });
