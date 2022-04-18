"use-strict";

const container = document.querySelector(`.container`);
const userName = document.querySelector(`#username`);
// const userAvatar = document.querySelector(`.user-image`);
const userAvatar = document.querySelector(`#user-image--img`);

if (!localStorage.getItem("userAvatar")) {
  // userAvatar.style.backgroundImage = localStorage.getItem("userAvatar");
  avatarsModal();
} else {
  // avatarsModal();
  // userAvatar.style.backgroundImage = localStorage.getItem("userAvatar");
  userAvatar.src = localStorage.getItem("userAvatar");
}

let uploadedImg
// const loggedUser = localStorage.getItem("jwt");

// const API_URL = `https://ctd-todo-api.herokuapp.com/v1`;

function readImage() {
    if (this.files && this.files[0]) {
        const file = new FileReader();
        file.onload = (e) => {
          uploadedImg = e.target.result
          localStorage.setItem("userAvatar", uploadedImg)
          userAvatar.src = localStorage.getItem("userAvatar");
          return uploadedImg
        };       
        file.readAsDataURL(this.files[0]);
    }
}

const setAvatar = (avatar) => {
  const newAvatar = localStorage.setItem(
    "userAvatar",
    `${avatar.children[0].getAttribute(`src`)}`
  );
  // return userAvatar.style.backgroundImage = `url("${avatar.children[0].getAttribute(`src`)}")`;
  return userAvatar.src = `${avatar.children[0].getAttribute(`src`)}`;
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
      <header class="avatars--header">
        <div class="upload-img">
          <input id="upload-img--input" type="file" name="image" />
          <button id="upload-img--button" >Salvar</button>
        </div>
        <h2>Ou selecione um avatar:</h2>
      </header>
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

  const avatars = document.querySelectorAll(`.avatar`);
  const btnCloseModal = document.querySelector(`.close-modal`);
  const btnSaveUploadedImg = document.querySelector('#upload-img--button')
  const inputUploadImage = document.querySelector('#upload-img--input')

  inputUploadImage.addEventListener("change", readImage, false);

  btnSaveUploadedImg.addEventListener(`click`, e => {
    e.preventDefault()
    localStorage.setItem("userAvatar", uploadedImg)
    userAvatar.src = uploadedImg
    // setAvatar(uploadedImg)
    closeModal(avatarsModal);
  })

  btnCloseModal.addEventListener(`click`, (e) => {
    e.preventDefault();

    closeModal(avatarsModal);
  });

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
