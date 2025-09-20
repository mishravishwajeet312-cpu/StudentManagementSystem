const nameInput = document.getElementById("studentName");
const dateInput = document.getElementById("attendanceDate");
const tableBody = document.querySelector("#attendanceTable tbody");

let students = [];  
let rollNo = 1;

window.onload = function () {
    const savedData = localStorage.getItem("students");
    if (savedData) {
        students = JSON.parse(savedData);
        rollNo = students[students.length - 1].roll + 1;
    }

    setTodayDate();
    displayStudents();
};

function setTodayDate() {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.addEventListener("change", displayStudents);
}

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Student name is required");
        return;
    }

    const newStudent = {   
        roll: rollNo,
        name: name,
        attendance: {}
    };

    students.push(newStudent);  
    rollNo++;
    nameInput.value = "";
    saveData();
    displayStudents();
}

function displayStudents() {
    tableBody.innerHTML = "";
    let selectedDate = dateInput.value;

    students.forEach((s) => {
        let status = s.attendance[selectedDate] || "Not Marked";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>
                <span class="${status === 'Present' ? 'present' : status === 'Absent' ? 'absent' : ''}">
                    ${status}
                </span><br>
                <button onclick="markAttendance(${s.roll}, 'Present')">Present</button>
                <button onclick="markAttendance(${s.roll}, 'Absent')">Absent</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function markAttendance(roll, status) {
    const selectedDate = dateInput.value;
    const studentObj = students.find((s) => s.roll === roll);  
    if (studentObj) {
        studentObj.attendance[selectedDate] = status;
    }

    saveData();
    displayStudents();
}
