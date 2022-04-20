"use-strict";

const inputName = document.querySelector(`#name`);
const inputLastname = document.querySelector(`#lastname`);
const inputEmail = document.querySelector(`#email`);
const inputPass = document.querySelector(`#pass`);
const inputPassConfirm = document.querySelector(`#pass--confirm`);
const btnConfirm = document.querySelector(`.btn-confirm`);

const API_URL = `https://ctd-todo-api.herokuapp.com/v1`;

const storedRegisteredUsers = JSON.parse(
  localStorage.getItem(`registeredUsers`)
);

const saveJwt = (jwt) => {
  return localStorage.setItem("jwt", jwt);
};

const passRequirements = /^(?=.*\d)(?=.*[!@*#])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
const emailRequirements = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const msgErr = document.createElement(`p`);
msgErr.classList.add(`error`);

let inputNameOk = false;
let inputLastnameOk = false;
let inputEmailOk = false;
let inputPassOk = false;
let inputPassConfirmOk = false;

// VALIDATE NAME INPUT
const validateInputName = () => {
  // const [firstName, lastName] = inputName.value.split(` `);

  let error = msgErr

  if (inputName.value.length < 2) {
    error.innerText = `Name must have more than 1 letter`;
    return inputName.parentElement.appendChild(error);
    // return;
  }

  if (inputName.value.length >= 2 && inputName.parentElement.contains(msgErr)) {
    error.innerText = ``;
    return inputName.parentElement.removeChild(error);
  }

  if (!inputName.parentElement.contains(error)) {
    return (inputNameOk = true);
  }
}

inputName.addEventListener(`focusout`, () => {
  validateInputName()
});

// VALIDATE LASTNAME
const validateInputLastName = () => {
  if (inputLastname.value.length <= 1) {
    msgErr.innerText = `Lastname must have more than 1 characters`;
    inputLastname.parentElement.appendChild(msgErr);
    return;
  }

  if (
    inputLastname.value.length >= 2 &&
    inputLastname.parentElement.contains(msgErr)
  ) {
    msgErr.innerText = ``;
    inputLastname.parentElement.removeChild(msgErr);
  }

  if (!inputLastname.parentElement.contains(msgErr)) {
    return (inputLastnameOk = true);
  }
}

inputLastname.addEventListener(`focusout`, () => {
  validateInputLastName()
});

// VALIDATE EMAIL
const validateInputEmail = () => {
  if (!inputEmail.value.match(emailRequirements)) {
    msgErr.innerText = `Invalid email`;
    inputEmail.parentElement.appendChild(msgErr);
  } else {
    if (inputEmail.parentElement.contains(msgErr)) {
      msgErr.innerText = ``;
      inputEmail.parentElement.removeChild(msgErr);
    }
  }

  if (!inputEmail.parentElement.contains(msgErr)) {
    return (inputEmailOk = true);
  }
}

inputEmail.addEventListener(`focusout`, () => {
  validateInputEmail()
});

// VALIDATE PASSWORD INPUT
const validateInputPassword = () => {
  if (inputPass.value.length < 8) {
    msgErr.innerText = `Password must have at least 8 letters`;
    inputPass.parentElement.appendChild(msgErr);
  }

  if (inputPass.value.length >= 8) {
    if (inputPass.parentElement.contains(msgErr)) {
      msgErr.innerText = ``;
      inputPass.parentElement.removeChild(msgErr);
    }

    if (!inputPass.value.match(passRequirements)) {
      msgErr.innerText = `Password must have: 1 special character, upper and lowercase letters and numbers`;
      inputPass.parentElement.appendChild(msgErr);
    } else {
      if (inputPass.parentElement.contains(msgErr)) {
        msgErr.innerText = ``;
        inputPass.parentElement.removeChild(msgErr);
      }
    }
  }

  if (!inputPass.parentElement.contains(msgErr)) {
    inputPassOk = true;
  }
}

inputPass.addEventListener(`focusout`, () => {
  validateInputPassword()
});

// VALIDATE PASSWORD CONFIRMATION INPUT
const validateInputPasswordConfirmation = () => {
  if (inputPassConfirm.value !== inputPass.value) {
    msgErr.innerText = `Password doesn't match`;
    inputPassConfirm.parentElement.appendChild(msgErr);
  } else {
    if (inputPassConfirm.parentElement.contains(msgErr)) {
      msgErr.innerText = ``;
      inputPassConfirm.parentElement.removeChild(msgErr);
    }

    if (!inputPassConfirm.parentElement.contains(msgErr)) {
      return (inputPassConfirmOk = true);
    }
  }
}

inputPassConfirm.addEventListener(`focusout`, () => {
  validateInputPasswordConfirmation()
});

// REGISTER USER
function registerSuccessful(name, lastname, email, jsonReceived) {
  const newUser = {
    name: name,
    lastname: lastname,
    email: email,
    token: jsonReceived
  };

  storedRegisteredUsers.push(newUser);

  localStorage.setItem(
    `registeredUsers`,
    JSON.stringify(storedRegisteredUsers)
  );

  //window.location.href = "../pages/tasks.html";
}

btnConfirm.addEventListener(`click`, async (e) => {
  e.preventDefault();


  validateInputName()
  validateInputLastName()
  validateInputEmail()
  validateInputPassword()
  validateInputPasswordConfirmation()

  if (
    inputNameOk &&
    inputLastnameOk &&
    inputEmailOk &&
    inputPassOk &&
    inputPassConfirmOk
  ) {
    spinner(true)
    let config = {
      method: "POST",
      body: JSON.stringify({
        firstName: inputName.value,
        lastName: inputLastname.value,
        email: inputEmail.value,
        password: inputPass.value
      }),
      headers: {
        "Content-type": "application/json"
      }
    };

    let result = await fetch(`${API_URL}/users`, config)
      .then((response) => {
        console.log(response);
        return response;
      }).catch((error) => { spinner(false); alert(error); });

    switch (result.status) {
      case 500:
        msgErr.innerText = 'Erro do servidor, envie novamente.';
        inputPassConfirm.parentElement.appendChild(msgErr);
        setTimeout(() => spinner(false), 1500);
        break;
      case 400:
        msgErr.innerText = 'Usuario ja cadastrado. verifique os dados.';
        inputPassConfirm.parentElement.appendChild(msgErr);
        setTimeout(() => spinner(false), 1500);
        break;
      case 201:
        result.json().then((response) => {
          console.log(response);
          registerSuccessful(
            inputName.value,
            inputLastname.value,
            inputEmail.value,
            response.jwt
          );
          saveJwt(response.jwt);
          window.location.href = "../pages/tasks.html";
        }).catch((response) => {
          msgErr.innerText = 'Erro do servidor, envie novamente.';
          inputPassConfirm.parentElement.appendChild(msgErr);
          setTimeout(() => spinner(false), 1500);
        })
        break;
      default:
        console.log(await result.json().then((response)=>{return response}))
        msgErr.innerText = 'Erro do servidor, envie novamente.';
        inputPassConfirm.parentElement.appendChild(msgErr);
        setTimeout(() => spinner(false), 1500);
        break;
    }
  }
})

function spinner(ativo) {
  if (ativo) {
    let divSpinner = document.createElement('div');
    divSpinner.id = 'spinner'
    divSpinner.innerHTML = '<img id="spinnerImg" src="../assets/spinner.png" alt="">'
    document.body.append(divSpinner)

  }
  else {
    let divSpinner = document.querySelector('#spinner');
    divSpinner.remove();
  }

}