// Import our custom CSS
import "./css/style.css";

import TodoItem from "./TodoItem";
import Project from "./Project";

// Selectors
const projectsContainer = document.querySelector("#projects-container");
const addProjectsBtn = document.querySelector("#add-projects-btn");

//Global variables
let newProjectInputFieldCreated = false;
let newProjectInputContainer = undefined;
let currentProjectInView = {};
let currentTaskUnderEdit = undefined;
let projects = {};

// Event listeners
addProjectsBtn.addEventListener("click", appendNewProjectInputComponent);
addProjectsBtn.addEventListener("mousedown", preventDefault);

function preventDefault(event) {
  event.preventDefault();
}

function appendNewProjectInputComponent() {
  newProjectInputFieldCreated = true;
  if (newProjectInputFieldCreated && newProjectInputContainer) {
    newProjectInputContainer.firstElementChild.focus();
    return;
  }

  newProjectInputContainer = createProjectInputComponent();

  projectsContainer.appendChild(newProjectInputContainer);
  newProjectInputContainer.focus();
  newProjectInputFieldCreated = true;

  const cancelBtn = newProjectInputContainer.querySelector(".cancel-btn");

  attachEventListener(cancelBtn, "click", cancelNewProjectInputComponent);

  const confirmBtn = newProjectInputContainer.querySelector(".confirm-btn");

  attachEventListener(confirmBtn, "click", confirmNewProject);
}

function cancelNewProjectInputComponent(event) {
  newProjectInputFieldCreated = false;
  newProjectInputContainer = undefined;
  removeEventListener(event.target, "click", cancelNewProjectInputComponent);

  event.target.parentElement.remove();
}

function confirmNewProject(event) {
  const newProjectContainer = event.target.parentElement;
  const inputElement = newProjectContainer.firstElementChild;

  if (inputElement.value !== "") {
    addNewProjectItem(inputElement.value);
    removeEventListener(event.target, "click", confirmNewProject);

    newProjectContainer.remove();
  } else {
    // prompt the user to enter a name
  }

  newProjectInputFieldCreated = false;
  newProjectInputContainer = undefined;
}

function createNewProjectItemComponent(projectName, projectId) {
  let projectContainerDiv = document.createElement("div");
  projectContainerDiv.classList.add("project-container");
  projectContainerDiv.dataset.id = projectId;

  let projectTitle = document.createElement("div");
  projectTitle.classList.add("project-title");
  projectTitle.innerText = projectName;

  let editProjectBtn = document.createElement("button");
  editProjectBtn.classList.add("edit-project");
  editProjectBtn.innerHTML = '<span class="material-symbols-sharp"> edit </span>';

  projectContainerDiv.appendChild(projectTitle);
  projectContainerDiv.appendChild(editProjectBtn);

  attachEventListener(projectContainerDiv, "click", mountProjectViewComponent);

  attachEventListener(editProjectBtn, "click", editProjectActive);

  return { projectContainerDiv };
}

function addNewProjectItem(projectName) {
  let projectId = createNewProjectObject(projectName).id;

  let { projectContainerDiv } = createNewProjectItemComponent(projectName, projectId);

  projectsContainer.appendChild(projectContainerDiv);
}

function createProjectInputComponent({ value = undefined, id = undefined } = {}) {
  let inputElementContainer = document.createElement("div");
  inputElementContainer.classList.add("project-name-input");
  inputElementContainer.innerHTML = `
            <input type="text" name="" id="" />
            <span class="material-symbols-outlined confirm-btn"> check </span>
            <span class="material-symbols-outlined cancel-btn"> close </span>`;

  const inputElement = inputElementContainer.firstElementChild;
  if (value) {
    inputElement.value = value;
  }
  if (id) {
    inputElementContainer.dataset.id = id;
  }
  return inputElementContainer;
}

function attachEventListener(node, event, listener) {
  node.addEventListener(event, listener);
}

function removeEventListener(node, event, listener) {
  node.removeEventListener(event, listener);
}

// Is this even used?
// function editExistingProject(id, newName) {
//   let projectObj = changeProjectObjectName(id, newName);

//   let { projectContainerDiv } = createNewProjectItemComponent(newName, id);

//   projectsContainer.appendChild(projectContainerDiv);
//   attachEventListener(editProjectBtn, "click", editProjectActive);
// }

function editProjectActive(event) {
  let projectContainerDiv = event.target.parentNode.parentNode;
  let projectName = projectContainerDiv.firstElementChild.innerText;
  let projectInputContainer = createProjectInputComponent({
    value: projectName,
    id: projectContainerDiv.dataset.id,
  });

  const cancelBtn = projectInputContainer.querySelector(".cancel-btn");

  attachEventListener(cancelBtn, "click", cancelNewProjectInputComponent);

  const confirmBtn = projectInputContainer.querySelector(".confirm-btn");

  attachEventListener(confirmBtn, "click", confirmNewProject);

  projectsContainer.replaceChild(projectInputContainer, projectContainerDiv);
}

function createNewProjectObject(projectName) {
  let newProject = new Project(projectName);
  projects[newProject.id] = newProject;

  return newProject;
}

function changeProjectObjectName(id, newName) {
  projects[id].name = newName;

  return projects[id];
}

function mountProjectViewComponent(event) {
  if (event.target.textContent.trim() === "edit") {
    event.stopPropagation();
    return;
  }
  const projectId = event.currentTarget.dataset.id;
  const tasksContentContainer = document.querySelector("#tasks-content-container");
  currentProjectInView = projects[projectId];

  tasksContentContainer.innerHTML = `
    <h2 id="task-owner-header">${currentProjectInView.name}</h2>
    <div id="tasks-container"></div>`;

  appendAddTaskBtn();
  renderTasks(currentProjectInView.tasks);
}

function appendAddTaskBtn() {
  const tasksContentContainer = document.querySelector("#tasks-content-container");
  const addTaskContainer = document.createElement("div");
  addTaskContainer.id = "add-task-container";
  addTaskContainer.innerHTML = `
  <button id="add-task-btn">
    <span class="material-symbols-outlined">add</span>
  </button>
  <div id="add-task-text">Add Task</div>`;
  tasksContentContainer.append(addTaskContainer);

  attachEventListener(
    tasksContentContainer.querySelector("#add-task-container"),
    "click",
    (event) => addNewTaskActive(event.target)
  );
}

function renderTasks(tasks) {
  if (tasks.length === 0) {
    return;
  }

  const tasksContainer = document.querySelector("#tasks-container");
  let taskItems = "";
  tasks.forEach((task) => {
    taskItems += `
          <div class="task-item" data-taskid=${task.id}>
            <div class="flex-container">
              <input type="checkbox" name="" id="" />
              <div class="task-title">${task.title}</div>
            </div>
            <button class="edit-task">
              <span class="material-symbols-sharp">edit</span>
            </button>
          </div>`;
  });
  tasksContainer.innerHTML = taskItems;
  activateTaskEditButtons();
}

function activateTaskEditButtons() {
  const tasksContentContainer = document.querySelector("#tasks-content-container");
  const editBtns = tasksContentContainer.querySelectorAll(".edit-task");

  editBtns.forEach((editBtn) =>
    attachEventListener(editBtn, "click", (e) =>
      editTask(e.currentTarget.parentElement.dataset.taskid)
    )
  );
}

function createTaskInputComponent() {
  const taskInputContainer = document.createElement("div");
  taskInputContainer.classList.add("task-input-container");
  taskInputContainer.innerHTML = `
  <input type="text" name="" id="" />
  <span class="material-symbols-outlined confirm-btn">check</span>
  <span class="material-symbols-outlined cancel-btn">close</span>
  `;
  if (currentTaskUnderEdit !== undefined) {
    taskInputContainer.dataset.taskid = currentTaskUnderEdit.id;
  }

  attachEventListener(
    taskInputContainer.querySelector(".confirm-btn"),
    "click",
    confirmTask
  );

  attachEventListener(
    taskInputContainer.querySelector(".cancel-btn"),
    "click",
    cancelTaskInput
  );

  return taskInputContainer;
}

function addNewTaskActive() {
  const taskInputContainer = createTaskInputComponent();
  taskInputContainer.id = "add-new-task-container";
  const addTaskContainer = document.querySelector("#add-task-container");

  addTaskContainer.replaceWith(taskInputContainer);
  taskInputContainer.firstElementChild.focus();
}

function confirmTask(event) {
  const taskInputContainer = event.target.parentElement;
  const inputField = taskInputContainer.firstElementChild;

  if (inputField.value === "") {
    // prompt the user to enter a title
    return;
  }

  if (currentTaskUnderEdit) {
    currentTaskUnderEdit.title = inputField.value;
  } else {
    createNewTaskObject(inputField.value);
    taskInputContainer.remove();
    appendAddTaskBtn();
  }
  renderTasks(currentProjectInView.tasks);
}

function cancelTaskInput() {
  if (currentTaskUnderEdit) {
    renderTasks(currentProjectInView.tasks);
    currentTaskUnderEdit = undefined;
  } else {
    document.querySelector("#add-new-task-container").remove();
    appendAddTaskBtn();
  }
}

function createNewTaskObject(taskTitle) {
  let newTask = new TodoItem(taskTitle, "", "", "");
  currentProjectInView.tasks.push(newTask);

  return newTask;
}

function editTask(taskId) {
  renderTasks(currentProjectInView.tasks); // reset any other tasks being edited

  currentTaskUnderEdit = currentProjectInView.getTask(taskId);
  const taskInputContainer = createTaskInputComponent();
  taskInputContainer.firstElementChild.value = currentTaskUnderEdit.title;

  document
    .querySelector(`.task-item[data-taskid="${taskId}"]`)
    .replaceWith(taskInputContainer);

  taskInputContainer.firstElementChild.focus();
}
// TODO:
//

// Add event listeners to Inbox, Today, Upcoming Week, Upcoming Month elements
// Inbox vs Today vs Upcoming Week vs Specific Project
