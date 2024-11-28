const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data files
const signupFile = './data/signup.json'; // Updated to signup.json
const complaintsFile = './data/complaints.json';
const suggestionsFile = './data/suggestions.json';

// Read data from files (helper function)
const readDataFromFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
};

// Write data to files (helper function)
const writeDataToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Signup endpoint (Registers a user)
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields (name, email, password)' });
  }

  const users = readDataFromFile(signupFile); // Updated to signupFile
  
  // Check if email already exists
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Add new user to the users array
  const newUser = { name, email, password };
  users.push(newUser);
  
  // Write the updated users array to the file
  writeDataToFile(signupFile, users); // Updated to signupFile

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint (Logs in a user)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const users = readDataFromFile(signupFile); // Updated to signupFile
  
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', email });
});

// Complaints endpoint (Submit a complaint)
app.post('/complaints', (req, res) => {
  const { email, password, complaintText } = req.body;

  if (!email || !password || !complaintText) {
    return res.status(400).json({ message: 'Please provide email, password, and complaint text' });
  }

  const users = readDataFromFile(signupFile); // Updated to signupFile
  
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const complaints = readDataFromFile(complaintsFile);
  const newComplaint = { email, complaintText, date: new Date() };
  complaints.push(newComplaint);

  writeDataToFile(complaintsFile, complaints);

  res.status(201).json({ message: 'Complaint submitted successfully' });
});

// Suggestions endpoint (Submit a suggestion)
app.post('/suggestions', (req, res) => {
  const { email, password, suggestionText } = req.body;

  if (!email || !password || !suggestionText) {
    return res.status(400).json({ message: 'Please provide email, password, and suggestion text' });
  }

  const users = readDataFromFile(signupFile); // Updated to signupFile

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const suggestions = readDataFromFile(suggestionsFile);
  const newSuggestion = { email, suggestionText, date: new Date() };
  suggestions.push(newSuggestion);

  writeDataToFile(suggestionsFile, suggestions);

  res.status(201).json({ message: 'Suggestion submitted successfully' });
});

// Get all complaints (for testing)
app.get('/complaints', (req, res) => {
  const complaints = readDataFromFile(complaintsFile);
  res.status(200).json(complaints);
});

// Get all suggestions (for testing)
app.get('/suggestions', (req, res) => {
  const suggestions = readDataFromFile(suggestionsFile);
  res.status(200).json(suggestions);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
