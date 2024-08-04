class TodoList {
  constructor() {
    this.projects = [];
  }

  getUpcomingDayProjects() {
    console.log("Not implemented yet");
  }

  getUpcomingWeekProjects() {
    console.log("Not implemented yet");
  }

  getUpcomingMonthProjects() {
    console.log("Not implemented yet");
  }

  getProject(projectId) {
    return this.projects.find((project) => project.id === projectId);
  }
}

export default TodoList;
