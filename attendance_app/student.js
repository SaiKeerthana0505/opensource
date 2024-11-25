// server/routes/students.js
const express = require('express');
const router = express.Router();

let students = []; // Temporary storage

// GET all students
router.get('/', (req, res) => res.json({ students }));

// POST new student
router.post('/', (req, res) => {
    const { rollNumber, firstName, lastName } = req.body;
    const name = `${capitalize(firstName)} ${capitalize(lastName)}`;
    students.push({ rollNumber: rollNumber.toUpperCase(), name });
    res.status(201).json({ message: 'Student added', student: { rollNumber, name } });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = router;
