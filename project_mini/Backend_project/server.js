const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing JSON request body

// Path to the JSON file
const dataFilePath = "./data.json";

// Utility function to read data from JSON file
function readData() {
  if (!fs.existsSync(dataFilePath)) {
    return { users: [], complaints: [], suggestions: [] };
  }
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData || "{}") || { users: [], complaints: [], suggestions: [] };
}

// Utility function to write data to JSON file
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// Initialize data if JSON file is empty or doesn't exist
const initialData = readData();
if (!initialData.users.length) {
  initialData.users = [
    { id: "user1", password: "password123" },
    { id: "user2", password: "password456" },
  ];
  writeData(initialData);
}

// Authentication middleware
function authenticate(req, res, next) {
  const { userId, password } = req.body;
  const data = readData();

  const user = data.users.find((u) => u.id === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  next();
}

// Routes
// 1. Login Endpoint
app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const data = readData();

  const user = data.users.find((u) => u.id === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful" });
});

// 2. Complaint Submission Endpoint
app.post("/submit-complaint", authenticate, (req, res) => {
  const { userId, complaint } = req.body;
  if (!complaint) {
    return res.status(400).json({ message: "Complaint cannot be empty" });
  }

  const data = readData();
  const newComplaint = { userId, complaint, date: new Date().toISOString() };
  data.complaints.push(newComplaint);
  writeData(data);

  res.status(201).json({
    message: "Complaint submitted successfully",
    complaint: newComplaint,
  });
});

// 3. Suggestion Submission Endpoint
app.post("/submit-suggestion", authenticate, (req, res) => {
  const { userId, suggestion } = req.body;
  if (!suggestion) {
    return res.status(400).json({ message: "Suggestion cannot be empty" });
  }

  const data = readData();
  const newSuggestion = { userId, suggestion, date: new Date().toISOString() };
  data.suggestions.push(newSuggestion);
  writeData(data);

  res.status(201).json({
    message: "Suggestion submitted successfully",
    suggestion: newSuggestion,
  });
});

// 4. View Complaints
app.get("/view-complaints", (req, res) => {
  const data = readData();
  res.status(200).json({ complaints: data.complaints });
});

// 5. View Suggestions
app.get("/view-suggestions", (req, res) => {
  const data = readData();
  res.status(200).json({ suggestions: data.suggestions });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
