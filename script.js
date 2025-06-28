// Select elements
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Add new task
addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        createTask(taskText);
        saveTask(taskText);
        taskInput.value = "";
    }
});

// Create task element
function createTask(taskText, completed = false) {
    const li = document.createElement("li");

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = completed;

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        updateTaskStatus(taskText, checkbox.checked);
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    li.appendChild(taskContent);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => {
        li.remove();
        removeTask(taskText);
    });

    li.appendChild(removeBtn);

    if (completed) li.classList.add("completed");

    taskList.appendChild(li);
}

// Save task to localStorage
function saveTask(taskText) {
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => createTask(task.text, task.completed));
}

// Remove task from localStorage
function removeTask(taskText) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task status in localStorage
function updateTaskStatus(taskText, isCompleted) {
    const tasks = getTasks();
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = isCompleted;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}
