const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const usersFilePath = './users.json';

function readUsersFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function writeUsersFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// GET all users
app.get('/users', (req, res) => {
    const users = readUsersFile().map(({ id, name, email }) => ({ id, name, email })); // Exclude passwords
    res.json(users);
});

// POST a new user
app.post('/users', async (req, res) => {
    console.log("fyugihojpk[plj")
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const users = readUsersFile();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    users.push(newUser);
    writeUsersFile(users);

    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsersFile();
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    console.log("gfhgjhkjlkhgj")
    const userId = parseInt(req.params.id, 10);
    const users = readUsersFile();
    const updatedUsers = users.filter(user => user.id !== userId);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ message: 'User not found' });
    }

    writeUsersFile(updatedUsers);
    res.status(200).json({ message: 'User deleted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
