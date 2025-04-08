const API_URL = 'http://localhost:5000/api/students';
const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');

// Show notification
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Fetch and display students
async function fetchStudents() {
  loading.style.display = 'block';
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    showNotification('Failed to fetch students', 'error');
  } finally {
    loading.style.display = 'none';
  }
}

// Render students in the table
function renderStudents(students) {
  studentTable.innerHTML = '';
  students.forEach((student) => {
    const row = studentTable.insertRow();
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${new Date(student.enrollmentDate).toLocaleDateString()}</td>
      <td class="actions">
        <button class="edit" onclick="editStudent(${student.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="delete" onclick="deleteStudent(${student.id})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </td>
    `;
  });
}

// Add or Update Student
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    enrollmentDate: document.getElementById('enrollmentDate').value,
  };

  try {
    if (studentForm.dataset.editId) {
      // Update student
      await fetch(`${API_URL}/${studentForm.dataset.editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      delete studentForm.dataset.editId;
      showNotification('Student updated successfully', 'success');
    } else {
      // Add new student
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      showNotification('Student added successfully', 'success');
    }
    fetchStudents();
    studentForm.reset();
  } catch (error) {
    console.error('Error saving student:', error);
    showNotification('Failed to save student', 'error');
  }
});

// Edit Student
function editStudent(id) {
  window.location.href = `edit.html?id=${id}`;
}

// Delete Student
async function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      showNotification('Student deleted successfully', 'success');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      showNotification('Failed to delete student', 'error');
    }
  }
}

// Initial fetch
fetchStudents();