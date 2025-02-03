const express = require('express');//it is used to import express(to create server).
const cors = require('cors');//this is used to import cors modules.(extract inform from request body)
const fs = require('fs');//importing file systems (can used for operation on file ).
const bodyParser = require('body-parser');//importing body parsers (extract information from request body )
const { clearScreenDown } = require('readline');//importing readline module 
const app = express();// creating  app from express server

// Middleware
app.use(cors());//data transfers between browsers and servers. 
app.use(bodyParser.json());//Handling incoming data in a variety of formats, such as JSON, URL-encoded form data, and raw or text data.

// File paths
const signupFile = './signup.json';//import signup.json file
const loginFile = './login.json';//import login.json file
const suggestionFile = './suggestion.json';//import suggestion.json file
const complaintFile = './complaint.json';//import complaint.json file

// Helper functions to read/write JSON data
const readDataFromFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');//read file 
      return data ? JSON.parse(data) : []; // Handle empty files
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);//to know error
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

// ** Server Setup **
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});