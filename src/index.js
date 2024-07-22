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
  const projectName = inputElement.value;

  if (projectName !== "") {
    addNewProjectItem(projectName);
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

  attachEventListener(projectContainerDiv, "click", (e) =>
    mountProjectViewComponent(e.target.dataset.id)
  );

  return { projectContainerDiv, projectTitle, editProjectBtn };
}

function addNewProjectItem(projectName) {
  let projectId = createNewProjectObject(projectName).id;

  let { projectContainerDiv, editProjectBtn } = createNewProjectItemComponent(
    projectName,
    projectId
  );

  projectsContainer.appendChild(projectContainerDiv);
  attachEventListener(editProjectBtn, "click", editProjectActive);
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

function editExistingProject(id, newName) {
  let projectObj = changeProjectObjectName(id, newName);

  let { projectContainerDiv, editProjectBtn } = createNewProjectItemComponent(
    newName,
    id
  );

  projectsContainer.appendChild(projectContainerDiv);
  attachEventListener(editProjectBtn, "click", editProjectActive);
}

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

function mountProjectViewComponent(projectId) {
  console.log("Mounting project view");
  const tasksContentContainer = document.querySelector("#tasks-content-container");
  const selectedProject = projects[projectId];

  let tasksContentContainerInnerHTML = `
  <h2 id="task-owner-header">${selectedProject.name}</h2>
        <div id="tasks-container">
        </div>`;

  let tasksItems = "";

  // Move this to a separate function
  selectedProject.tasks.forEach((task) => {
    taskItems += `
          <div class="task-item">
          <div class="flex-container">
          <input type="checkbox" name="" id="" />
          <div class="task-title">${task.title}</div>
          </div>
          <button class="edit-task">
          <span class="material-symbols-sharp"> edit </span>
          </button>
          </div>`;
  });

  tasksContentContainerInnerHTML += `<div id="add-task-container">
  <button id="add-task-btn">
  <span class="material-symbols-outlined"> add </span>
  </button>
  <div id="add-task-text">Add Task</div>
  </div>`;

  tasksContentContainer.innerHTML = tasksContentContainerInnerHTML;
  const tasksContainer = tasksContentContainer.querySelector("#tasks-container");
  tasksContainer.innerHTML = tasksItems;

  attachEventListener(
    tasksContentContainer.querySelector("#add-task-container"),
    "click",
    () => console.log("Add Task")
  );
}

// TODO:
// Create input for new task

// Add event listeners to Inbox, Today, Upcoming Week, Upcoming Month elements
// Inbox vs Today vs Upcoming Week vs Specific Project
