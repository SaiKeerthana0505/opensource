const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveAttendance = (data) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    xlsx.writeFile(workbook, path.join(__dirname, '../data/attendance_' + new Date().toISOString().split('T')[0] + '.xlsx'));
};

router.post('/add', (req, res) => {
    const { rollNumber, name } = req.body;
    const formattedName = name.replace(/\b\w/g, char => char.toUpperCase());
    saveAttendance([{ rollNumber: rollNumber.toUpperCase(), name: formattedName }]);
    res.status(200).json({ message: 'Attendance recorded' });
});

module.exports = router;
