// Import our custom CSS
import "./style.scss";
// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

// // or, specify which plugins you need:
// import { Tooltip, Toast, Popover } from "bootstrap";

import TodoItem from "./TodoItem";
import Project from "./Project";

for (let x = 1; x < 10; x++) {
  console.log(new TodoItem("Do work", "desc", "2020-20-01", 1));
}

function createNewTodoItem(title, description, dueDate, priority) {
  return new TodoItem(title, description, dueDate, priority);
}

function createNewProject(name) {
  return new Project(name);
}
