// Fetch tasks from the server when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetch("/tasks")
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.description;
        taskList.appendChild(li);
      });
    });
});

// Add a new task when the "Add Task" button is clicked
document.getElementById("addTaskButton").addEventListener("click", function () {
  const taskInput = document.getElementById("taskInput");

  if (taskInput.value.trim() !== "") {
    const newTask = {
      description: taskInput.value,
    };

    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((task) => {
        const taskList = document.getElementById("taskList");
        const li = document.createElement("li");
        li.textContent = task.description;
        taskList.appendChild(li);
        taskInput.value = "";
      });
  }
});
