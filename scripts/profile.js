"use-strict";

const container = document.querySelector(`.container`);
const userName = document.querySelector(`#username`);
const userAvatar = document.querySelector(`.user-image`);

if (!localStorage.getItem("userAvatar")) {
  // userAvatar.style.backgroundImage = localStorage.getItem("userAvatar");
  avatarsModal();
} else {
  // avatarsModal();
  userAvatar.style.backgroundImage = localStorage.getItem("userAvatar");
}

// const loggedUser = localStorage.getItem("jwt");

// const API_URL = `https://ctd-todo-api.herokuapp.com/v1`;

const setAvatar = (avatar) => {
  const newAvatar = localStorage.setItem(
    "userAvatar",
    `url("${avatar.children[0].getAttribute(`src`)}")`
  );
  // return userAvatar.style.backgroundImage = `url("${avatar.children[0].getAttribute(`src`)}")`;
  userAvatar.style.backgroundImage = localStorage.getItem("userAvatar");
};

const closeModal = (element) => container.removeChild(element);

function avatarsModal() {
  let avatarsModal = document.createElement(`div`);
  avatarsModal.classList.add(`avatars-wrapper`);
  avatarsModal.innerHTML += `
    <ul class="avatars">
      <button class="close-modal btn-close">
        <span class="lnr lnr-cross"></span>
      </button>
      <li class="avatar">
        <img src="../assets/avatars/man-1.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/man-2.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/man-3.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/man-4.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/women-1.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/women-2.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/women-3.png" />
      </li>
      <li class="avatar">
        <img src="../assets/avatars/women-4.png" />
      </li>
    </ul>
  `;

  container.appendChild(avatarsModal);

  let btnCloseModal = document.querySelector(`.close-modal`);

  btnCloseModal.addEventListener(`click`, (e) => {
    e.preventDefault();

    closeModal(avatarsModal);
  });

  let avatars = document.querySelectorAll(`.avatar`);

  avatars.forEach((avatar) => {
    avatar.addEventListener(`click`, (e) => {
      setAvatar(avatar);
      closeModal(avatarsModal);
    });
  });
}

const loadUserData = () => {
  let config = {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("jwt")
    }
  };

  fetch(`https://ctd-todo-api.herokuapp.com/v1/users/getMe`, config)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { firstName } = data;
      const { lastName } = data;
      userName.innerText = `${firstName} ${lastName}`;

      return data;
    })
    .catch((error) => console.log(error));
};

const verifyUser = () => {
  if (localStorage.getItem(`jwt`)) {
    loadUserData();
  } else {
    window.location = "../index.html";
  }
};

userAvatar.addEventListener(`click`, (e) => {
  avatarsModal();
});

window.onload = verifyUser();
