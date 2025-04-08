const API_URL = 'http://localhost:5000/api/students';
const editStudentForm = document.getElementById('editStudentForm');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');

// Show loading indicator when page loads
document.addEventListener('DOMContentLoaded', () => {
  loading.style.display = 'block';
});

// Show notification
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Get student ID from URL
function getStudentIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Redirect to main page
function redirectToMainPage(delay = 2000) {
  setTimeout(() => {
    window.location.href = 'index.html';
  }, delay);
}

// Fetch student data
async function fetchStudentData() {
  const studentId = getStudentIdFromUrl();
  if (!studentId) {
    showNotification('No student ID provided', 'error');
    redirectToMainPage();
    return;
  }

  loading.style.display = 'block';
  try {
    const response = await fetch(`${API_URL}/${studentId}`);
    if (!response.ok) {
      throw new Error(`Student not found (Status: ${response.status})`);
    }
    const student = await response.json();
    
    // Format date for input field (YYYY-MM-DD)
    let enrollmentDate = student.enrollmentDate;
    if (enrollmentDate) {
      // If it's a full ISO date string, convert it to YYYY-MM-DD
      if (enrollmentDate.includes('T')) {
        enrollmentDate = enrollmentDate.split('T')[0];
      }
    }
    
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('enrollmentDate').value = enrollmentDate || '';
  } catch (error) {
    console.error('Error fetching student:', error);
    showNotification(`Failed to fetch student data: ${error.message}`, 'error');
    redirectToMainPage();
  } finally {
    loading.style.display = 'none';
  }
}

// Handle form submission
editStudentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentId = document.getElementById('studentId').value;
  const studentData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    enrollmentDate: document.getElementById('enrollmentDate').value,
  };

  loading.style.display = 'block';
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error('Failed to update student');
    }

    showNotification('Student updated successfully', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    console.error('Error updating student:', error);
    showNotification('Failed to update student', 'error');
  } finally {
    loading.style.display = 'none';
  }
});

// Initial fetch
fetchStudentData(); 