class Project {
  constructor(name) {
    this.name = name;
    this.todolist = [];
  }

  addTodoItem(todoItemObj) {
    this.todolist.push(todoItemObj);
  }

  removeTodoItem(todoItemId) {
    this.todolist = this.todolist.filter((todoItem) => todoItem.id !== todoItemId);
  }

  getNumberOfRemainingTasks() {
    return this.todolist.every((item) => !item.checked).length;
  }
}

export default Project;
