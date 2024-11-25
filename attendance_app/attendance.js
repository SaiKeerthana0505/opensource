// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const XLSX = require('xlsx');

let attendanceRecords = []; // Temporary storage

// GET attendance for a specific date
router.get('/:date', (req, res) => {
    const date = req.params.date;
    const attendance = attendanceRecords.find(record => record.date === date);
    res.json(attendance || { date, attendance: [] });
});

// POST attendance for the day
router.post('/', (req, res) => {
    const { date, attendance } = req.body;
    attendanceRecords.push({ date, attendance });
    res.status(201).json({ message: 'Attendance marked', date, attendance });
    saveToExcel(date, attendance);
});

// Update Excel file
function saveToExcel(date, attendance) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(attendance);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `data/attendance_${date}.xlsx`);
}

module.exports = router;
