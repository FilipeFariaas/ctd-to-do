"use-strict";
const saveJwt = (jwt) => {
  return localStorage.setItem("jwt", jwt);
};

if(localStorage.getItem("jwt")) {
  window.location.href = "./pages/tasks.html";
}

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
    spinner(true)
    fetch(`${API_URL}/users/login`, config)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        //console.log('start')
        
        try{
         if(response.jwt){
            saveJwt(response.jwt);
            window.location.href = "./pages/tasks.html";
          
          }
        else{
            setTimeout(()=>{spinner(false)
              msgErr.innerText = "Falha na autenticacão, verifique usuário e senha.";
              inputPass.parentElement.appendChild(msgErr);
            },3000);
          }
        }
        catch{
          setTimeout(()=>{spinner(false)
            msgErr.innerText = "Falha na autenticacão, verifique usuário e senha.";
            inputPass.parentElement.appendChild(msgErr);
          },3000);
        }
        
      })
      .catch((error) => {
        console.log(error);
        msgErr.innerText = "Falha na autenticacão, verifique usuário e senha."
        inputPass.parentElement.appendChild(msgErr);});
  }
});

function spinner (ativo){
  if(ativo){
    let divSpinner = document.createElement('div');
    divSpinner.id = 'spinner'
    divSpinner.innerHTML = '<img id="spinnerImg" src="assets/spinner.png" alt="">'
    document.body.append(divSpinner)

  }
  else{
    let divSpinner = document.querySelector('#spinner');
    divSpinner.remove();
  }
  
}