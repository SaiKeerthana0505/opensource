document.addEventListener("DOMContentLoaded", () => {
    // Set current date and day
    const currentDate = new Date();
    document.getElementById("currentDate").innerText = currentDate.toLocaleDateString('en-GB', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Example function to add a student attendance row
    function addStudentRow(rollNumber, name) {
        const table = document.getElementById("attendanceTable");
        const row = table.insertRow(-1);
        row.insertCell(0).innerText = rollNumber.toUpperCase();
        row.insertCell(1).innerText = name.replace(/\b\w/g, char => char.toUpperCase());

        const checkboxCell = row.insertCell(2);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            checkboxCell.style.backgroundColor = checkbox.checked ? "green" : "dull ash";
        });
        checkboxCell.appendChild(checkbox);
    }

    // Placeholder function to fetch and display previous attendance
    function fetchAttendanceData() {
        fetch('/attendance')
            .then(response => response.json())
            .then(data => data.forEach(student => addStudentRow(student.rollNumber, student.name)));
    }

    document.getElementById("addAttendance").addEventListener("click", () => {
        // Logic to add attendance for the current day
    });

    document.getElementById("downloadData").addEventListener("click", () => {
        window.location.href = '/download';
    });

    // Fetch and display existing attendance on page load
    fetchAttendanceData();
});
