// Fetch tasks from the server when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetch("/tasks")
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.description;

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        // for styling
        deleteButton.classList.add("delete-button");

        // Append delete button to the list item
        li.appendChild(deleteButton);

        // Append the list item to the task list
        taskList.appendChild(li);

        // Add event listener for delete button
        deleteButton.addEventListener("click", function () {
          deleteTask(task.id, li);
        });
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

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        // for styling
        deleteButton.classList.add("delete-button");

        // Append delete button to the list item
        li.appendChild(deleteButton);

        // Append the list item to the task list
        taskList.appendChild(li);

        // Add event listener for delete button
        deleteButton.addEventListener("click", function () {
          deleteTask(task.id, li);
        });

        taskInput.value = ""; // Clear the input field
      });
  }
});

// Function to delete a task
function deleteTask(taskId, taskElement) {
  fetch(`/tasks/${taskId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Remove the task element from the DOM
        taskElement.remove();
      } else {
        console.error("Failed to delete task");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
