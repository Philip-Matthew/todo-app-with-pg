const express = require("express");
const { Pool } = require("pg"); // Only if using PostgreSQL
const path = require("path"); // Required to work with file paths

const app = express();

// Database connection (optional: use this only if connecting to a database)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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

// API endpoint to add a new task (example)
app.post("/tasks", async (req, res) => {
  const { description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
