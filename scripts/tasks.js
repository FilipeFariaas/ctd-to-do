"use-strict";

const btnEndSession = document.querySelector(`#closeApp`);
const inputNewTask = document.querySelector(`#novaTarefa`);
const btnAddTask = document.querySelector(`#addTask`);
const tasksPending = document.querySelector(`.tarefas-pendentes`);
const tasksCompleted = document.querySelector(`.tarefas-terminadas`);

const loggedUser = localStorage.getItem("jwt");

const API_URL = `https://ctd-todo-api.herokuapp.com/v1`;

const closeEditModal = (parent, child) => parent.removeChild(child);

const deleteTask = (id) => {
  console.log(id);
  let config = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: loggedUser
    }
  };

  fetch(`${API_URL}/tasks/${id}`, config)
    .then((response) => {
      //return response.json();
      let cbtb = document.querySelector(`#_${id}`);
      cbtb.remove();
    })
    .catch((err) => console.log(err));
    
};

const saveChanges = (id, newTitle) => {
  const config = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: loggedUser
    },
    body: JSON.stringify({
      description: newTitle,
      completed: false
    })
  };

  fetch(`${API_URL}/tasks/${id}`, config)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

const getTaskData = (id) => {
  const config = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: loggedUser
    }
  };

  fetch(`${API_URL}/tasks/${id}`, config)
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      console.log(data)
      const { id } = data;
      const { description } = data;

      editTask(id, description);

      return data;
    })
    .catch((err) => console.log(err));
};

const editTask = (id, taskTitle) => {
  const currentTaskTitle = document.querySelector(`#_${id} .nome`)
  const container = document.querySelector(`.container`);
  const editTaskModal = document.createElement(`div`);
  editTaskModal.classList.add(`edit-task-modal`);
  editTaskModal.innerHTML += `
  <form class="edit-task">
    <button id="close-edit-modal" class="btn-close">
      <span class="lnr lnr-cross"></span>
    </button>
    <div class="edit-task--input-wrapper">
      <label>Título</label>
      <input id="edit-task-input" type="text" value="${taskTitle}" />
    </div>
    <div class="edit-task-buttons">
      <button id="save-change">Save</button>
      <button id="cancel-change">Cancel</button>
    </div>
  </form>
  `;

  container.appendChild(editTaskModal);

  const btnCloseModal = document.querySelector(`#close-edit-modal`);
  btnCloseModal.addEventListener(`click`, (e) => {
    e.preventDefault();

    container.removeChild(editTaskModal);
  });

  // const currentTaskTitle = document.querySelector(`#_${id} .nome`);
  const inputEditTask = document.querySelector(`#edit-task-input`);
  const btnSaveEdit = document.querySelector(`#save-change`);
  const btnCancelEdit = document.querySelector(`#cancel-change`);

  inputEditTask.addEventListener(`keypress`, (key) => {
    if (key.key === `Enter`) {
      const newTitle = inputEditTask.value;
      currentTaskTitle.innerText = newTitle;

      saveChanges(id, newTitle);
      // closeEditModal(container, editTaskModal);
    }
  });

  btnSaveEdit.addEventListener(`click`, (e) => {
    e.preventDefault();

    const newTitle = inputEditTask.value;
    currentTaskTitle.innerText = newTitle;

    saveChanges(id, newTitle);
    closeEditModal(container, editTaskModal);
  });

  btnCancelEdit.addEventListener(`click`, (e) => {
    e.preventDefault();

    closeEditModal(container, editTaskModal);
  });
};

const completeTask = (id) => {
    console.log(id);

    const task = document.querySelector(`#_${id}`);
    const taskId = id;
    const taskTitle = document.querySelector(`#_${id} .nome`).innerText;
    const taskCreation = document.querySelector(`#_${id} .timestamp`).innerText;

    task.classList.toggle(`tarefa--pendente`);
    task.classList.toggle(`tarefa--concluida`);

    const taskIsComplete = task.classList.contains(`tarefa--concluida`);

    const taskObj = {
      id: taskId,
      description: taskTitle,
      createdAt: new Date(),
      completed: taskIsComplete
    };

    console.log(taskObj);

    task.remove();

    renderTask(taskObj);

    const config = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: loggedUser
      },
      body: JSON.stringify({
        description: taskTitle,
        completed: taskIsComplete ? true : false
      })
    };

    fetch(`${API_URL}/tasks/${taskId}`, config)
      .then((response) => {
        return response.json();
      })
      // .then((response) => {
      //   console.log(response);
      // })
      .catch((err) => console.log(err));
}

const createTaskTemplate = (id, title, creation, completed) => {
  const taskTemplate = `
  <li id=_${id} class="tarefa tarefa--${completed ? "concluida" : "pendente"
      }">
    <button id="edit-task" onclick="getTaskData(${id})">
      <span class="lnr lnr-pencil"></span>
    </button>
    <button id="deleteTask" onclick="deleteTask(${id})">
      <span class="lnr lnr-cross"></span>
    </button>
    <div class="not-done" onclick="completeTask(${id})"></div>
    <div class="descricao">
      <p class="nome">${title}</p>
      <p class="timestamp">${new Date(creation).toLocaleString()}</p>
    </div>
  </li>
  `;

  return taskTemplate;
};

const renderTask = (task) => {
  console.log(task)
  const { completed } = task;

  if (completed) {
    tasksCompleted.innerHTML += createTaskTemplate(
      task.id,
      task.description,
      task.createdAt,
      task.completed
    );
  } else {
    tasksPending.innerHTML += createTaskTemplate(
      task.id,
      task.description,
      task.createdAt,
      task.completed
    );
  }

  inputNewTask.value = "";
};

const loadUserTasks = () => {
  tasksPending.innerHTML = `<div class="skeletonLoading">${createTaskTemplate('XXXX','Em progresso','1/1/1970','1/1/1970')}</div>`;
  tasksCompleted.innerHTML = `<div class="skeletonLoading">${createTaskTemplate('XXXX','Finalizada','1/1/1970','1/1/1970')}</div>`;
  spinner(true)
  let config = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: loggedUser
    }
  };

  fetch(`${API_URL}/tasks`, config)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setTimeout(()=>{
        tasksPending.innerHTML = "";
        tasksCompleted.innerHTML = "";
        spinner(false)
        response.forEach((task) => {
          renderTask(task)
        });
      },4000);
      
    })
    .catch((err) => console.log(err));
};

const validateAccess = () => {
  if (localStorage.getItem(`jwt`)) {
    loadUserTasks();
  } else {
    window.location = "../index.html";
  }
};

btnEndSession.addEventListener(`click`, (e) => {
  e.preventDefault();

  // localStorage.removeItem(`jwt`);
  localStorage.clear()
  window.location = "../index.html";
  //console.log(`clicked`);
});

btnAddTask.addEventListener(`click`, (e) => {
  e.preventDefault();

  let config = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: loggedUser
    },
    body: JSON.stringify({
      description: inputNewTask.value,
      completed: false
    })
  };

  fetch(`${API_URL}/tasks`, config)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      renderTask(response);
    })
    .catch((err) => console.log(err));
});

function spinner (ativo){
  if(ativo){
    let divSpinner = document.createElement('div');
    divSpinner.id = 'spinner'
    divSpinner.innerHTML = '<img id="spinnerImg" src="../assets/spinner.png" alt="">'
    document.body.append(divSpinner)

  }
  else{
    let divSpinner = document.querySelector('#spinner');
    divSpinner.remove();
  }
  
}

window.onload = validateAccess();