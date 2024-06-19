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
let projects = {};

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

  newProjectInputField = createProjectInputElement();

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

function createProjectInputElement({ value = undefined, id = undefined } = {}) {
  let inputElement = document.createElement("input");
  attachEventListener(inputElement, "focusout", inputFieldFocusOut);
  inputElement.type = "text";
  inputElement.name = "New Project Name";
  inputElement.classList.add("project-name-input");

  if (value) {
    inputElement.value = value;
  }
  if (id) {
    inputElement.dataset.id = id;
  }
  return inputElement;
}

function attachEventListener(node, event, listener) {
  node.addEventListener(event, listener);
}

function removeEventListener(node, event, listener) {
  node.removeEventListener(event, listener);
}

function inputFieldFocusOut(event) {
  removeEventListener(event.target, "focusout", inputFieldFocusOut);
  let input = event.target.value;
  let projectId = event.target.dataset.id;
  event.target.parentNode.removeChild(event.target);

  if (input !== "") {
    if (projectId) {
      editExistingProject(projectId, input);
    } else {
      addNewProject(input);
    }
  }
}

function addNewProject(projectName) {
  let projectId = createNewProjectObject(projectName).id;

  let { projectContainerDiv, editProjectBtn } = createNewProjectComponent(
    projectName,
    projectId
  );

  projectsContainer.appendChild(projectContainerDiv);
  attachEventListener(editProjectBtn, "click", editProjectActive);
}

function editExistingProject(id, newName) {
  let projectObj = changeProjectObjectName(id, newName);

  let { projectContainerDiv, editProjectBtn } = createNewProjectComponent(newName, id);

  projectsContainer.appendChild(projectContainerDiv);
  attachEventListener(editProjectBtn, "click", editProjectActive);
}

function createNewProjectComponent(projectName, projectId) {
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

  return { projectContainerDiv, projectTitle, editProjectBtn };
}

function editProjectActive(event) {
  let projectContainerDiv = event.target.parentNode.parentNode;
  let projectName = projectContainerDiv.firstChild.innerText;
  let projectInputField = createProjectInputElement({
    value: projectName,
    id: projectContainerDiv.dataset.id,
  });

  projectsContainer.replaceChild(projectInputField, projectContainerDiv);
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
