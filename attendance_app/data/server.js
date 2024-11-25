const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const attendanceDataPath = path.join(__dirname, 'data', 'attendance.json');

// Route to fetch attendance data
app.get('/attendance', (req, res) => {
    fs.readFile(attendanceDataPath, (err, data) => {
        if (err) res.status(500).send("Error reading attendance data");
        else res.json(JSON.parse(data));
    });
});

// Route to add attendance
app.post('/attendance', (req, res) => {
    const newAttendance = req.body;
    fs.readFile(attendanceDataPath, (err, data) => {
        if (err) return res.status(500).send("Error reading data");

        const attendance = JSON.parse(data);
        attendance.push(newAttendance);

        fs.writeFile(attendanceDataPath, JSON.stringify(attendance), (err) => {
            if (err) res.status(500).send("Error saving data");
            else res.send("Attendance added successfully");
        });
    });
});

// Route to download attendance data
app.get('/download', (req, res) => {
    res.download(attendanceDataPath, 'attendance.json');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
