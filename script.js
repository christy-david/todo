class ToDoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || []
    this.tasks = this.tasks.map((task) => ({
      ...task,
      due_date: new Date(task.due_date),
    }))
    this.currentTaskId = null
    this.renderTasks()
  }

  openAddTaskModal() {
    document.getElementById("addTaskModal").style.display = "flex"
  }

  closeAddTaskModal() {
    document.getElementById("addTaskModal").style.display = "none"
    this.clearAddTaskFields()
  }

  openEditTaskModal(taskId) {
    this.currentTaskId = taskId
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      document.getElementById("editTaskInput").value = task.task
      document.getElementById("editTaskDate").value = task.due_date
        .toISOString()
        .split("T")[0]
      document.getElementById("editTaskModal").style.display = "flex"
    }
  }

  closeEditTaskModal() {
    document.getElementById("editTaskModal").style.display = "none"
    this.clearEditTaskFields()
  }

  openDeleteTaskModal(taskId) {
    this.currentTaskId = taskId
    document.getElementById("deleteTaskModal").style.display = "flex"
  }

  closeDeleteTaskModal() {
    document.getElementById("deleteTaskModal").style.display = "none"
  }

  addTask() {
    const taskInput = document.getElementById("newTaskInput")
    const dateInput = document.getElementById("newTaskDate")
    const warningMessage = document.getElementById("addTaskWarning")

    if (!taskInput.value || !dateInput.value) {
      this.displayWarning(warningMessage, "Please fill in all fields.")
      return
    }

    const dueDate = new Date(dateInput.value)
    if (dueDate < new Date()) {
      this.displayWarning(warningMessage, "Please select a future date.")
      return
    }

    const task = {
      id: Date.now(),
      task: taskInput.value,
      completed: false,
      due_date: dueDate,
    }

    this.tasks.push(task)
    this.saveTasks()
    this.renderTasks()
    this.closeAddTaskModal()
  }

  updateTask() {
    const taskInput = document.getElementById("editTaskInput")
    const dateInput = document.getElementById("editTaskDate")
    const warningMessage = document.getElementById("editTaskWarning")

    if (!taskInput.value || !dateInput.value) {
      this.displayWarning(warningMessage, "Please fill in all fields.")
      return
    }

    const dueDate = new Date(dateInput.value)
    if (dueDate < new Date()) {
      this.displayWarning(warningMessage, "Please select a future date.")
      return
    }

    const task = this.tasks.find((t) => t.id === this.currentTaskId)
    if (task) {
      task.task = taskInput.value
      task.due_date = dueDate
      this.saveTasks()
      this.renderTasks()
      this.closeEditTaskModal()
    }
  }

  deleteTask() {
    this.tasks = this.tasks.filter((task) => task.id !== this.currentTaskId)
    this.saveTasks()
    this.renderTasks()
    this.closeDeleteTaskModal()
  }

  toggleComplete(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
      this.renderTasks()
    }
  }

  renderTasks() {
    const taskList = document.getElementById("taskList")
    taskList.innerHTML = ""

    if (this.tasks.length === 0) {
      taskList.innerHTML = "<li>No tasks yet</li>"
      return
    }

    this.tasks.forEach((task, i) => {
      const listItem = document.createElement("li")
      listItem.className = task.completed ? "completed" : ""
      if (new Date(task.due_date) < new Date() && !task.completed) {
        listItem.classList.add("overdue")
      }

      listItem.innerHTML = `
        <div class="task-item">
          <p>${i + 1}. ${task.task}</p>
          <p class='due-date'>${new Date(
            task.due_date
          ).toLocaleDateString()}</p>
        </div>
       
        <div class="task-actions"> 
          <input type="checkbox" ${
            task.completed ? "checked" : ""
          } onchange="app.toggleComplete(${task.id})">
          <button class="edit-btn" onclick="app.openEditTaskModal(${task.id})">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button class="delete-btn" onclick="app.openDeleteTaskModal(${
            task.id
          })">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </button>
        </div>
      `
      taskList.appendChild(listItem)
    })
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }

  displayWarning(element, message) {
    element.textContent = message
    element.style.display = "block"
    setTimeout(() => {
      element.style.display = "none"
    }, 3000)
  }

  clearAddTaskFields() {
    document.getElementById("newTaskInput").value = ""
    document.getElementById("newTaskDate").value = ""
  }

  clearEditTaskFields() {
    document.getElementById("editTaskInput").value = ""
    document.getElementById("editTaskDate").value = ""
  }
}

const app = new ToDoApp()
