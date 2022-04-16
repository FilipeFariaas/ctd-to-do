"use-strict";
const saveJwt = (jwt) => {
  return localStorage.setItem("jwt", jwt);
};

const form = document.querySelector(`form`);
const inputEmail = document.querySelector(`#inputEmail`);
const inputPass = document.querySelector(`#inputPassword`);
const btnSubmit = document.querySelector(`.submit`);

const msgErr = document.createElement(`p`);
msgErr.classList.add(`error`);

const rootUser = {
  email: `root@email.com`,
  password: `myPassword!123`,
};

const API_URL = `https://ctd-todo-api.herokuapp.com/v1`;

if (!localStorage.getItem(`registeredUsers`)) {
  localStorage.setItem(`registeredUsers`, JSON.stringify([rootUser]));
}

const storedRegisteredUsers = JSON.parse(
  localStorage.getItem(`registeredUsers`)
);

form.addEventListener(`submit`, (e) => {
  e.preventDefault();

  if (inputEmail.value === "" || inputPass.value === "") {
    alert(`Please inform an email and password to login`);
  }
});

btnSubmit.addEventListener(`click`, (e) => {
  e.preventDefault();

  let config = {
    method: "POST",
    body: JSON.stringify({
      email: inputEmail.value,
      password: inputPass.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  };

  if (inputEmail.value === "" || inputPass.value === "") {
    msgErr.innerText = `Please insert your credentials`;
    inputPass.parentElement.appendChild(msgErr);
  } else {
    fetch(`${API_URL}/users/login`, config)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        try{
          if(response.jwt){
            saveJwt(response.jwt);
            window.location.href = "./pages/tasks.html";
          
          }
          else{
            //alert("Falha na autenticacão, verifique usuário e senha.")
            msgErr.innerText = "Falha na autenticacão, verifique usuário e senha."
            inputPass.parentElement.appendChild(msgErr);
          }

        }
        catch{
            //alert("Falha na autenticacão, verifique usuário e senha.")
            msgErr.innerText = "Falha na autenticacão, verifique usuário e senha."
            inputPass.parentElement.appendChild(msgErr);
        }
        
      })
      .catch((error) => console.log(error));
  }
});
