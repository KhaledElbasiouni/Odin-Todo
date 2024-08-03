class Project {
  static #counter = 1;
  constructor(name) {
    this.id = Project.#counter++;
    this.name = name;
    this.tasks = [];
  }

  addTodoItem(todoItemObj) {
    this.tasks.push(todoItemObj);
  }

  removeTodoItem(todoItemId) {
    this.tasks = this.tasks.filter((todoItem) => todoItem.id !== todoItemId);
  }

  getNumberOfRemainingTasks() {
    return this.tasks.every((item) => !item.checked).length;
  }

  getTask(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }
}

export default Project;
