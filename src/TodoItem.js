class TodoItem {
  constructor(title, description, dueDate, priority) {
    this.id = Date.now(); // unique id based on time
    this.title = title; // string
    this.description = description; // string
    this.dueDate = dueDate; // Date()?
    this.priority = priority; // number or string??
    this.checked = false; // boolean
  }

  isCompelete() {
    return this.checked;
  }

  checkItem() {
    this.checked = true;
  }

  unCheckItem() {
    this.checked = false;
  }
}

export default TodoItem;
