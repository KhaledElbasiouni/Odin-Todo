// Import our custom CSS
import "./css/style.css";

import TodoItem from "./TodoItem";
import Project from "./Project";
import TodoList from "./TodoList";

// Selectors
const projectsContainer = document.querySelector("#projects-container");
const addProjectsBtn = document.querySelector("#add-projects-btn");

//Global variables
let newProjectInputContainer = undefined;
let currentProjectInView = {};
let currentTaskUnderEdit = undefined;
let currentProjectUnderEdit = undefined;

let todoList = new TodoList();

// Event listeners
addProjectsBtn.addEventListener("click", addNewProjectActive);
addProjectsBtn.addEventListener("mousedown", preventDefault);

function preventDefault(event) {
  event.preventDefault();
}

function addNewProjectActive() {
  if (newProjectInputContainer) {
    newProjectInputContainer.firstElementChild.focus();
    return;
  }
  renderProjects(); // Reset any projects being edited

  newProjectInputContainer = createProjectInputComponent();

  projectsContainer.appendChild(newProjectInputContainer);
  newProjectInputContainer.firstElementChild.focus();
}

function confirmProject(event) {
  const newProjectContainer = event.target.parentElement;
  const projectName = newProjectContainer.firstElementChild.value;

  if (projectName === "") {
    // prompt the user to enter a title
    return;
  }

  if (currentProjectUnderEdit) {
    currentProjectUnderEdit.name = projectName;
  } else {
    createNewProjectObject(projectName);
  }

  renderProjects();
}

function renderProjects() {
  currentProjectUnderEdit = undefined;
  newProjectInputContainer = undefined;
  if (todoList.projects.length === 0) {
    return;
  }
  const projectsContainer = document.querySelector("#projects-container");

  let projectsContainerInnerHTML = "";
  todoList.projects.forEach((project) => {
    projectsContainerInnerHTML += `
    <div class="project-item" data-projectid=${project.id}>
            <div class="project-title">${project.name}</div>
            <button class="edit-project">
              <span class="material-symbols-sharp">edit</span>
            </button>
          </div>
    `;
  });

  projectsContainer.innerHTML = projectsContainerInnerHTML;
  attachProjectItemsListeners();
}

function attachProjectItemsListeners() {
  const projectItems = document.querySelectorAll(".project-item");

  projectItems.forEach((project) => {
    attachEventListener(project, "click", onProjectClick);

    const editBtn = project.querySelector(".edit-project");
    attachEventListener(editBtn, "click", (e) =>
      editProjectActive(e.target.parentNode.parentNode.dataset.projectid)
    );
  });
}

function createProjectInputComponent() {
  let inputElementContainer = document.createElement("div");
  inputElementContainer.classList.add("project-name-input");
  inputElementContainer.innerHTML = `
            <input type="text" name="" id="" />
            <span class="material-symbols-outlined confirm-btn"> check </span>
            <span class="material-symbols-outlined cancel-btn"> close </span>`;

  if (currentProjectUnderEdit !== undefined) {
    inputElementContainer.dataset.projectid = currentProjectUnderEdit.id;
    inputElementContainer.firstElementChild.value = currentProjectUnderEdit.name;
  }

  attachEventListener(
    inputElementContainer.querySelector(".confirm-btn"),
    "click",
    confirmProject
  );

  attachEventListener(
    inputElementContainer.querySelector(".cancel-btn"),
    "click",
    renderProjects
  );

  return inputElementContainer;
}

function attachEventListener(node, event, listener) {
  node.addEventListener(event, listener);
}

function removeEventListener(node, event, listener) {
  node.removeEventListener(event, listener);
}

function editProjectActive(projectId) {
  renderProjects(); // Reset any other projects being edited

  currentProjectUnderEdit = todoList.getProject(projectId);

  let projectInputContainer = createProjectInputComponent();
  projectInputContainer.firstElementChild.innerText = currentProjectUnderEdit.name;

  document
    .querySelector(`.project-item[data-projectid="${projectId}"]`)
    .replaceWith(projectInputContainer);
}

function createNewProjectObject(projectName) {
  let newProject = new Project(projectName);
  todoList.projects.push(newProject);

  return newProject;
}

function mountProjectViewComponent(projectId) {
  const tasksContentContainer = document.querySelector("#tasks-content-container");
  currentProjectInView = todoList.getProject(projectId);

  tasksContentContainer.innerHTML = `
    <h2 id="task-owner-header">${currentProjectInView.name}</h2>
    <div id="tasks-container"></div>`;

  appendAddTaskBtn();
  renderTasks(currentProjectInView.tasks);
}

function onProjectClick(event) {
  if (event.target.textContent.trim() === "edit") {
    event.stopPropagation();
    return;
  }
  const projectId = event.currentTarget.dataset.projectid;

  mountProjectViewComponent(projectId);
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
  currentTaskUnderEdit = undefined;
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

function attachTaskEditListeners() {
  const editBtns = document.querySelectorAll(".edit-task");

  editBtns.forEach((editBtn) =>
    attachEventListener(editBtn, "click", (e) =>
      editTask(e.currentTarget.parentElement.dataset.taskid)
    )
  );
}

function createTaskInputComponent() {
  const taskInputContainer = document.createElement("div");
  taskInputContainer.id = "task-input-container";
  taskInputContainer.innerHTML = `
  <input type="text" name="" id="" />
  <span class="material-symbols-outlined confirm-btn">check</span>
  <span class="material-symbols-outlined cancel-btn">close</span>
  `;
  if (currentTaskUnderEdit !== undefined) {
    taskInputContainer.dataset.taskid = currentTaskUnderEdit.id;
    taskInputContainer.firstElementChild.value = currentTaskUnderEdit.title;
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
  renderTasks(currentProjectInView.tasks); // Reset any tasks being edited

  const taskInputContainer = createTaskInputComponent();
  const addTaskContainer = document.querySelector("#add-task-container");

  addTaskContainer.replaceWith(taskInputContainer);
  taskInputContainer.firstElementChild.focus();
}

function confirmTask(event) {
  const taskInputContainer = event.target.parentElement;
  const taskTitle = taskInputContainer.firstElementChild.value;

  if (taskTitle === "") {
    // prompt the user to enter a title
    return;
  }

  if (currentTaskUnderEdit) {
    currentTaskUnderEdit.title = taskTitle;
  } else {
    createNewTaskObject(taskTitle);
    taskInputContainer.remove();
    appendAddTaskBtn();
  }
  renderTasks(currentProjectInView.tasks);
}

function cancelTaskInput() {
  if (currentTaskUnderEdit) {
    renderTasks(currentProjectInView.tasks);
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

  document
    .querySelector(`.task-item[data-taskid="${taskId}"]`)
    .replaceWith(taskInputContainer);

  taskInputContainer.firstElementChild.focus();
}
// TODO:
// Refactor projects code to be more similar to tasks

// Add event listeners to Inbox, Today, Upcoming Week, Upcoming Month elements
// Inbox vs Today vs Upcoming Week vs Specific Project
