const express = require("express");
const { Pool } = require("pg"); // Only if using PostgreSQL
const path = require("path"); // Required to work with file paths

const app = express();

// Database connection (optional: use this only if connecting to a database)
// const isProduction = process.env.NODE_ENV === "production";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: isProduction ? { rejectUnauthorized: false } : false,
// });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todoapp",
  password: "26102004",
  port: 5432,
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint to get all tasks (example)
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// API endpoint to add a new task
app.post("/tasks", async (req, res) => {
  const { description } = req.body;

  try {
    // Insert the new task at the end (or at a specific position if required)
    const result = await pool.query(
      "INSERT INTO tasks (description) VALUES ($1) RETURNING *",
      [description]
    );

    // Reassign IDs to keep them sequential
    await pool.query(`
      WITH Renumbered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) as new_id
        FROM tasks
      )
      UPDATE tasks
      SET id = Renumbered.new_id
      FROM Renumbered
      WHERE tasks.id = Renumbered.id;
    `);

    // Retrieve the newly added task with the updated ID
    const updatedTask = await pool.query(
      "SELECT * FROM tasks WHERE description = $1 ORDER BY id DESC LIMIT 1",
      [description]
    );

    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    // Delete the task
    await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);

    // Reassign IDs to keep them sequential
    const result = await pool.query(`
      WITH Renumbered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) as new_id
        FROM tasks
      )
      UPDATE tasks
      SET id = Renumbered.new_id
      FROM Renumbered
      WHERE tasks.id = Renumbered.id;
    `);

    res
      .status(200)
      .send({ message: "Task deleted and IDs reassigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete task and reassign IDs" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
