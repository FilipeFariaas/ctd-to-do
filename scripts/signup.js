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
inputName.addEventListener(`focusout`, () => {
  const [firstName, lastName] = inputName.value.split(` `);

  if (inputName.value.length < 2) {
    msgErr.innerText = `Name must have more than 1 letter`;
    inputName.parentElement.appendChild(msgErr);
    return;
  }

  if (inputName.value.length >= 2 && inputName.parentElement.contains(msgErr)) {
    msgErr.innerText = ``;
    inputName.parentElement.removeChild(msgErr);
  }

  if (!inputName.parentElement.contains(msgErr)) {
    return (inputNameOk = true);
  }
});

// VALIDATE LASTNAME
inputLastname.addEventListener(`focusout`, () => {
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
});

// VALIDATE EMAIL
inputEmail.addEventListener(`focusout`, () => {
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
});

// VALIDATE PASSWORD INPUT
inputPass.addEventListener(`focusout`, () => {
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
});

// VALIDATE PASSWORD CONFIRMATION INPUT
inputPassConfirm.addEventListener(`focusout`, () => {
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

  window.location.href = "../pages/tasks.html";
}

btnConfirm.addEventListener(`click`, (e) => {
  e.preventDefault();

  if (
    inputNameOk &&
    inputLastnameOk &&
    inputEmailOk &&
    inputPassOk &&
    inputPassConfirmOk
  ) {
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

    fetch(`${API_URL}/users`, config)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        registerSuccessful(
          inputName.value,
          inputLastname.value,
          inputEmail.value,
          response.jwt
        );
        saveJwt(response.jwt);
        window.location.href = "../pages/tasks.html";
      })
      .catch((error) => console.log(error));
  }
});
