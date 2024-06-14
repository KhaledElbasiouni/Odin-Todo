// Import our custom CSS
import "./css/style.css";

import TodoItem from "./TodoItem";
import Project from "./Project";

// Selectors
const projectsContainer = document.querySelector("#projects-container");
const addProjectsBtn = document.querySelector("#add-projects-btn");

//Global variables
let newProjectInputFieldCreated = false;
let newProjectInputField = undefined;
let projects = [];

// Event listeners
addProjectsBtn.addEventListener("click", createNewProjectInputField);
addProjectsBtn.addEventListener("mousedown", preventDefault);

function preventDefault(event) {
  event.preventDefault();
}

function createNewProjectInputField() {
  newProjectInputFieldCreated = true;
  if (newProjectInputFieldCreated && newProjectInputField) {
    newProjectInputField.focus();
    return;
  }

  newProjectInputField = createProjectInputElement(newProjectInputField);

  projectsContainer.appendChild(newProjectInputField);
  newProjectInputField.focus();
  newProjectInputFieldCreated = true;

  attachEventListener(newProjectInputField, "focusout", abortCreateNewProject);
}

function abortCreateNewProject(event) {
  newProjectInputFieldCreated = false;
  newProjectInputField = undefined;
  removeEventListener(event.target, "focusout", abortCreateNewProject);
}

function createProjectInputElement(value = undefined) {
  let inputElement = document.createElement("input");
  attachEventListener(inputElement, "focusout", inputFieldFocusOut);
  inputElement.type = "text";
  inputElement.name = "New Project Name";
  inputElement.classList.add("project-name-input");

  if (value) {
    inputElement.value = value;
  }
  return inputElement;
}

function attachEventListener(node, event, listener) {
  node.addEventListener(event, listener);
}

function removeEventListener(node, event, listener) {
  node.removeEventListener(event, listener);
}

// Can this function be made more generic?
function inputFieldFocusOut(event) {
  removeEventListener(event.target, "focusout", inputFieldFocusOut);
  let input = event.target.value;

  event.target.parentNode.removeChild(event.target);

  if (input !== "") {
    addNewProject(input);
  }
}

function addNewProject(projectName) {
  let { projectContainerDiv, editProjectBtn } = createNewProjectComponent(projectName);

  projectsContainer.appendChild(projectContainerDiv);
  attachEventListener(editProjectBtn, "click", editProjectActive);
}

function createNewProjectComponent(projectName) {
  let projectContainerDiv = document.createElement("div");
  projectContainerDiv.classList.add("project-container");

  let projectTitle = document.createElement("div");
  projectTitle.classList.add("project-title");
  projectTitle.innerText = projectName;

  let editProjectBtn = document.createElement("button");
  editProjectBtn.classList.add("edit-project");
  editProjectBtn.innerHTML = '<span class="material-symbols-sharp"> edit </span>';

  projectContainerDiv.appendChild(projectTitle);
  projectContainerDiv.appendChild(editProjectBtn);

  return { projectContainerDiv, projectTitle, editProjectBtn };
}

function editProjectActive(event) {
  let projectContainerDiv = event.target.parentNode.parentNode;
  let projectName = projectContainerDiv.firstChild.innerText;
  let projectInputField = createProjectInputElement(projectName);

  projectsContainer.replaceChild(projectInputField, projectContainerDiv);
}
