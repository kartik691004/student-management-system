const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load data from JSON file-
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save data to JSON file
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
// Get all students
app.get('/api/students', (req, res) => {
  const students = loadData();
  res.json(students);
});

// Get a single student by ID
app.get('/api/students/:id', (req, res) => {
  const students = loadData();
  const studentId = parseInt(req.params.id);
  const student = students.find((s) => s.id === studentId);
  
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Add a new student
app.post('/api/students', (req, res) => {
  const students = loadData();
  const newStudent = { id: Date.now(), ...req.body };
  students.push(newStudent);
  saveData(students);
  res.status(201).json(newStudent);
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  try {
    const students = loadData();
    const studentId = parseInt(req.params.id);
    const updatedStudent = req.body;
    
    // Validate required fields
    if (!updatedStudent.name || !updatedStudent.email || !updatedStudent.enrollmentDate) {
      return res.status(400).json({ error: 'Name, email, and enrollment date are required' });
    }
    
    const index = students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      students[index] = { 
        ...students[index], 
        ...updatedStudent,
        id: studentId // Ensure ID doesn't change
      };
      saveData(students);
      res.json(students[index]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const students = loadData();
  const studentId = parseInt(req.params.id);
  const filteredStudents = students.filter((s) => s.id !== studentId);
  saveData(filteredStudents);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});