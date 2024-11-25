const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Path to the data.json file for storing suggestions and complaints
const dataFilePath = path.join(__dirname, 'data.json');

// Read data from data.json
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file", error);
    return { suggestions: [], complaints: [] }; // Default structure if the file doesn't exist
  }
};

// Write data to data.json
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to data file", error);
  }
};

// Route to add a suggestion
app.post('/suggestions', (req, res) => {
  const { suggestion } = req.body;

  if (!suggestion) {
    return res.status(400).json({ message: "Suggestion is required." });
  }

  const data = readData();
  const newSuggestion = { id: Date.now(), suggestion };
  data.suggestions.push(newSuggestion);
  writeData(data);

  res.status(201).json({ message: 'Suggestion added successfully', suggestion: newSuggestion });
});

// Route to add a complaint
app.post('/complaints', (req, res) => {
  const { complaint } = req.body;

  if (!complaint) {
    return res.status(400).json({ message: "Complaint is required." });
  }

  const data = readData();
  const newComplaint = { id: Date.now(), complaint };
  data.complaints.push(newComplaint);
  writeData(data);

  res.status(201).json({ message: 'Complaint filed successfully', complaint: newComplaint });
});

// Route to get all suggestions
app.get('/suggestions', (req, res) => {
  const data = readData();
  res.json(data.suggestions);
});

// Route to get all complaints
app.get('/complaints', (req, res) => {
  const data = readData();
  res.json(data.complaints);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
