const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const signupFile = './signup.json';
const loginFile = './login.json';
const suggestionFile = './suggestion.json';
const complaintFile = './complaint.json';

// Helper functions to read/write JSON data
const readDataFromFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return data ? JSON.parse(data) : []; // Handle empty files
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
};

const writeDataToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error.message);
  }
};

// ** Signup API **
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required (name, email, password).' });
  }

  const users = readDataFromFile(signupFile);
  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  const newUser = { name, email, password };
  users.push(newUser);
  writeDataToFile(signupFile, users);

  res.status(201).json({ message: 'User registered successfully.' });
});

// ** Login API **
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = readDataFromFile(signupFile);
  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const loggedInUsers = readDataFromFile(loginFile);
  loggedInUsers.push({ email, loginTime: new Date() });
  writeDataToFile(loginFile, loggedInUsers);

  res.status(200).json({ message: 'Login successful.', email });
});

// ** Suggestion API **
app.post('/suggestion', (req, res) => {
  const { email, password, suggestionText } = req.body;
  if (!email || !password || !suggestionText) {
    return res.status(400).json({ message: 'All fields are required (email, password, suggestionText).' });
  }

  const users = readDataFromFile(signupFile);
  if (!users.find((user) => user.email === email && user.password === password)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const suggestions = readDataFromFile(suggestionFile);
  suggestions.push({ email, suggestionText, date: new Date() });
  writeDataToFile(suggestionFile, suggestions);

  res.status(201).json({ message: 'Suggestion submitted successfully.' });
});

// ** Complaint API **
app.post('/complaint', (req, res) => {
  const { email, password, complaintText } = req.body;
  if (!email || !password || !complaintText) {
    return res.status(400).json({ message: 'All fields are required (email, password, complaintText).' });
  }

  const users = readDataFromFile(signupFile);
  if (!users.find((user) => user.email === email && user.password === password)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const complaints = readDataFromFile(complaintFile);
  complaints.push({ email, complaintText, date: new Date() });
  writeDataToFile(complaintFile, complaints);

  res.status(201).json({ message: 'Complaint submitted successfully.' });
});

// ** View Suggestions API **
app.get('/view-suggestions', (req, res) => {
  const suggestions = readDataFromFile(suggestionFile);
  res.status(200).json(suggestions);
});

// ** View Complaints API **
app.get('/view-complaints', (req, res) => {
  const complaints = readDataFromFile(complaintFile);
  res.status(200).json(complaints);
});

// ** Server Setup **
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
