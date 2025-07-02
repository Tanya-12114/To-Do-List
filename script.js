document.addEventListener("DOMContentLoaded", function () {
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }

    function loadTasksFromLocalStorage() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            allTasks = JSON.parse(stored);
        }
    }

    const addBtn = document.getElementById("add-btn");
    const clearBtn = document.getElementById("clear-btn");
    const viewAllBtn = document.getElementById("view-all-btn");
    const completedBtn = document.getElementById("completed-btn");
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority");
    const taskList = document.getElementById("task-list");
    const taskContainer = document.getElementById("task-container");
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("month-year");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");
    let currentDate = new Date();
    let selectedDate = null;
    let currentView = "none";

    // Hide tasks initially
    taskContainer.style.display = "none";

    // Add task
    addBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        const taskObj = {
            id: Date.now(), // unique identifier
            text: taskText,
            priority: priority,
            completed: false,
            date: selectedDate ? selectedDate.toDateString() : null
        };



        allTasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(allTasks)); // Save to localStorage
        taskInput.value = "";

        showPopup("Task added!");
    });
    clearBtn.addEventListener("click", function () {
    taskInput.value = "";                
    prioritySelect.selectedIndex = 0;       
    prioritySelect.classList.remove("selected");
});


    // View tasks
    viewAllBtn.addEventListener("click", function () {
        if (currentView === "all") {
            taskContainer.style.display = "none";
            currentView = "none";
        } else {
            renderTasks();
            taskContainer.style.display = "block";
            currentView = "all";
        }
    });

    let showingCompleted = false;

    completedBtn.addEventListener("click", function () {
        if (currentView === "completed") {
            taskContainer.style.display = "none";
            currentView = "none";
        } else {
            const completedTasks = allTasks.filter(task => task.completed);
            taskList.innerHTML = "";
            taskContainer.style.display = "block";

            if (completedTasks.length === 0) {
                const noTask = document.createElement("li");
                noTask.textContent = "No completed tasks found.";
                noTask.style.color = "#555";
                taskList.appendChild(noTask);
            } else {
                completedTasks.forEach((task, index) => {
                    const li = document.createElement("li");

                    const taskText = document.createElement("span");
                    taskText.textContent = task.text;
                    taskText.classList.add("task-text");

                    const priorityBox = document.createElement("span");
                    priorityBox.textContent = task.priority;
                    priorityBox.classList.add("priority-box", `priority-${task.priority}`);

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = task.completed;
                    checkbox.classList.add("task-checkbox");
                    checkbox.addEventListener("change", () => {
                        allTasks[index].completed = checkbox.checked;
                        saveTasksToLocalStorage();
                    });

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "✖";
                    deleteBtn.classList.add("remove-btn");
                    deleteBtn.addEventListener("click", () => {
                        allTasks.splice(index, 1);
                        saveTasksToLocalStorage();
                        taskContainer.style.display = "none";
                        currentView = "none";
                    });

                    const contentDiv = document.createElement("div");
                    contentDiv.classList.add("task-content");
                    contentDiv.appendChild(checkbox);
                    contentDiv.appendChild(taskText);
                    contentDiv.appendChild(priorityBox);

                    li.appendChild(contentDiv);
                    li.appendChild(deleteBtn);
                    taskList.appendChild(li);
                });
            }

            currentView = "completed";
        }
    });


    function renderTasks() {
        taskList.innerHTML = "";

        allTasks.forEach((task, index) => {
            const li = document.createElement("li");

            // Task text
            const taskText = document.createElement("span");
            taskText.textContent = task.text;
            taskText.classList.add("task-text");

            // Priority
            const prioritySpan = document.createElement("span");
            prioritySpan.textContent = task.priority;
            prioritySpan.classList.add("priority-box", `priority-${task.priority}`);


            // Checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.classList.add("task-checkbox");
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasksToLocalStorage();
                renderTasks(); // re-render to apply styles
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✖";
            deleteBtn.classList.add("remove-btn");
            deleteBtn.addEventListener("click", () => {
                allTasks.splice(index, 1); // remove from array
                saveTasksToLocalStorage(); // update storage
                renderTasks(); // re-render
            });

            // Wrap content
            const contentDiv = document.createElement("div");
            contentDiv.classList.add("task-content");
            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(taskText);
            contentDiv.appendChild(prioritySpan);

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function showPopup(message) {
        const popup = document.createElement("div");
        popup.textContent = message;
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.backgroundColor = "#4CAF50";
        popup.style.color = "white";
        popup.style.padding = "10px 20px";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        popup.style.zIndex = "1000";
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    // Calendar Rendering
    function renderCalendar(date) {
        calendar.innerHTML = "";

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const today = new Date();

        // Set month-year label
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        // Add blank cells before the first day
        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement("div");
            calendar.appendChild(blank);
        }

        // Fill calendar with day numbers
        for (let day = 1; day <= lastDate; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.textContent = day;

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayDiv.classList.add("today");
            }

            dayDiv.addEventListener("click", () => {
                selectedDate = new Date(year, month, day);
                highlightSelectedDate(dayDiv);
                showTasksForDate(selectedDate);
            });

            calendar.appendChild(dayDiv);
        }
    }

    // ✅ Move this OUTSIDE of renderCalendar
    function highlightSelectedDate(selectedEl) {
        const previouslySelected = document.querySelector('#calendar .selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        selectedEl.classList.add('selected');
    }

    // ✅ Move this OUTSIDE of renderCalendar
    function showTasksForDate(date) {
        taskContainer.style.display = "block";
        const formattedDate = date.toDateString();

        const filteredTasks = allTasks
            .map((task, i) => ({ ...task, realIndex: i }))
            .filter(task => task.date === formattedDate);

        taskList.innerHTML = "";

        if (filteredTasks.length === 0) {
            const noTask = document.createElement("li");
            noTask.textContent = `No tasks scheduled for ${formattedDate}`;
            noTask.style.color = "#555";
            taskList.appendChild(noTask);
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");

            const taskText = document.createElement("span");
            taskText.textContent = task.text;
            taskText.classList.add("task-text");

            const prioritySpan = document.createElement("span");
            prioritySpan.textContent = task.priority;
            prioritySpan.classList.add("priority-box", `priority-${task.priority}`);



            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.classList.add("task-checkbox");
            checkbox.addEventListener("change", () => {
                allTasks[task.realIndex].completed = checkbox.checked;
                saveTasksToLocalStorage();
                showTasksForDate(date);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✖";
            deleteBtn.classList.add("remove-btn");
            deleteBtn.addEventListener("click", () => {
                allTasks = allTasks.filter(t => t.id !== task.id);
                saveTasksToLocalStorage();
                renderTasks();
            });


            const contentDiv = document.createElement("div");
            contentDiv.classList.add("task-content");
            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(taskText);
            contentDiv.appendChild(prioritySpan);

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }


    // Navigation
    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Initial render
    renderCalendar(currentDate);
});
