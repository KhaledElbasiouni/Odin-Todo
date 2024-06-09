class Project {
  constructor(name) {
    this.name = name;
    this.todolist = [];
  }

  addTodoItem(todoItemObj) {
    this.todolist.push(todoItemObj);
  }

  getNumberOfRemainingTasks() {
    return this.todolist.every((item) => !item.checked).length;
  }
}

export default Project;
