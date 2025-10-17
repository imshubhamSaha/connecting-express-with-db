// app.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/database");
const PORT = 3000;
const app = express();
app.use(bodyParser.json());

// Create table if not exists
db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table 'users' is ready");
    }
  }
);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Express + MySQL App");
});

// INSERT a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error("Insert error:", err.message);
      return res.status(500).json({ error: "Failed to insert user" });
    }
    console.log(`Inserted user: ${name} (${email})`);
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// UPDATE user by id
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error("Update error:", err.message);
      return res.status(500).json({ error: "Failed to update user" });
    }
    if (result.affectedRows === 0) {
      console.warn(`No user found with id ${id}`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`Updated user id ${id}: ${name} (${email})`);
    res.json({ id, name, email });
  });
});

// DELETE user by id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    if (result.affectedRows === 0) {
      console.warn(`No user found with id ${id}`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`Deleted user id ${id}`);
    res.json({ message: `User id ${id} deleted` });
  });
});

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
