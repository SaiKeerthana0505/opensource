const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing JSON request body

// File paths
const loginFilePath = "./login.json";
const complaintsFilePath = "./complaints.json";
const suggestionsFilePath = "./suggestions.json";

// Utility function to read data from JSON files
function readData(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData || "[]");
}

// Utility function to write data to JSON files
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Initialize data if JSON files are empty or don't exist
const initialLoginData = readData(loginFilePath);
if (!initialLoginData.length) {
  const defaultUsers = [
    { id: "user1", password: "password123" },
    { id: "user2", password: "password456" },
  ];
  writeData(loginFilePath, defaultUsers);
}

// Authentication middleware
function authenticate(req, res, next) {
  const { userId, password } = req.body;
  const users = readData(loginFilePath);

  console.log('Authentication check for:', userId); // Debugging line to check userId

  const user = users.find((u) => u.id === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  next();
}

// Routes
// 1. Login Endpoint
app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const users = readData(loginFilePath);

  const user = users.find((u) => u.id === userId && u.password === password);
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

  const complaints = readData(complaintsFilePath);
  const newComplaint = { userId, complaint, date: new Date().toISOString() };
  complaints.push(newComplaint);
  writeData(complaintsFilePath, complaints);

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

  const suggestions = readData(suggestionsFilePath);
  const newSuggestion = { userId, suggestion, date: new Date().toISOString() };
  suggestions.push(newSuggestion);
  writeData(suggestionsFilePath, suggestions);

  res.status(201).json({
    message: "Suggestion submitted successfully",
    suggestion: newSuggestion,
  });
});

// 4. View Complaints
app.get("/view-complaints", (req, res) => {
  const complaints = readData(complaintsFilePath);
  res.status(200).json({ complaints });
});

// 5. View Suggestions
app.get("/view-suggestions", (req, res) => {
  const suggestions = readData(suggestionsFilePath);
  res.status(200).json({ suggestions });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
