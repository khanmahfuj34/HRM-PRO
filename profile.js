// Get employee index from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const employeeIndex = parseInt(urlParams.get('id'));

// Load employee data
let employees = [];
let currentEmployee = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadEmployeeData();
    displayEmployeeProfile();
});

// Load employees from localStorage
function loadEmployeeData() {
    const stored = localStorage.getItem('employees');
    if (stored) {
        employees = JSON.parse(stored);
        if (employeeIndex >= 0 && employeeIndex < employees.length) {
            currentEmployee = employees[employeeIndex];
        } else {
            // Invalid index, redirect to dashboard
            window.location.href = 'index.html';
        }
    } else {
        // No data, redirect to dashboard
        window.location.href = 'index.html';
    }
}

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Display employee profile
function displayEmployeeProfile() {
    if (!currentEmployee) return;

    const initials = currentEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const highEarnerStar = currentEmployee.salary > 100000
        ? '<i class="fas fa-star" style="color:gold; font-size: 1.5rem;"></i>'
        : '';

    // Profile Header
    document.getElementById('profileHeader').innerHTML = `
        <div class="profile-avatar-large">${initials}</div>
        <div class="profile-header-info">
            <h1>${currentEmployee.name} ${highEarnerStar}</h1>
            <p class="email"><i class="fas fa-envelope"></i> ${currentEmployee.email}</p>
            <div class="profile-badges">
                <span class="badge">
                    <i class="fas fa-building"></i> ${currentEmployee.department}
                </span>
                ${currentEmployee.salary > 100000 ? '<span class="badge"><i class="fas fa-star"></i> High Earner</span>' : ''}
                <span class="badge">
                    <i class="fas fa-check-circle"></i> Active
                </span>
            </div>
        </div>
    `;

    // Employment Details
    document.getElementById('empDepartment').textContent = currentEmployee.department;
    document.getElementById('empJoinDate').textContent = currentEmployee.joinDate || 'January 2024';
    document.getElementById('empId').textContent = `EMP-${String(employeeIndex + 1).padStart(4, '0')}`;

    // Compensation
    document.getElementById('empSalary').textContent = '$' + currentEmployee.salary.toLocaleString();
    document.getElementById('empAnnualSalary').textContent = '$' + (currentEmployee.salary * 12).toLocaleString();
    document.getElementById('empBonuses').textContent = '$' + (currentEmployee.totalBonuses || 0).toLocaleString();

    // Activity Timeline
    displayActivityTimeline();
}

// Display activity timeline
function displayActivityTimeline() {
    const timeline = document.getElementById('activityTimeline');

    const activities = [
        {
            icon: 'fa-user-plus',
            title: 'Employee Added',
            description: 'Profile created in the system',
            date: currentEmployee.joinDate || 'January 2024'
        },
        {
            icon: 'fa-dollar-sign',
            title: 'Salary Updated',
            description: `Current salary: $${currentEmployee.salary.toLocaleString()}`,
            date: 'Recent'
        }
    ];

    if (currentEmployee.totalBonuses && currentEmployee.totalBonuses > 0) {
        activities.unshift({
            icon: 'fa-gift',
            title: 'Bonus Received',
            description: `Total bonuses: $${currentEmployee.totalBonuses.toLocaleString()}`,
            date: 'Recent'
        });
    }

    timeline.innerHTML = activities.map(activity => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="timeline-content">
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <div class="timeline-date">
                    <i class="fas fa-calendar"></i> ${activity.date}
                </div>
            </div>
        </div>
    `).join('');
}

// Give bonus from profile page
function giveBonusFromProfile() {
    // Increase salary by $1,000
    currentEmployee.salary += 1000;

    // Track total bonuses
    if (!currentEmployee.totalBonuses) {
        currentEmployee.totalBonuses = 0;
    }
    currentEmployee.totalBonuses += 1000;

    // Update the employees array
    employees[employeeIndex] = currentEmployee;

    // Save to localStorage
    saveEmployees();

    // Show confirmation alert
    alert(`Bonus added! New Salary: $${currentEmployee.salary.toLocaleString()}`);

    // Refresh the display
    displayEmployeeProfile();
}

// Edit employee from profile page
function editEmployeeFromProfile() {
    // Redirect to main page with edit parameter
    window.location.href = `index.html?edit=${employeeIndex}`;
}

// Delete employee from profile page
function deleteEmployeeFromProfile() {
    if (confirm(`Are you sure you want to delete ${currentEmployee.name}?`)) {
        employees.splice(employeeIndex, 1);
        saveEmployees();
        alert('Employee deleted successfully!');
        window.location.href = 'index.html';
    }
}

// Generate report (placeholder function)
function generateReport() {
    alert(`Generating report for ${currentEmployee.name}...\n\nThis feature would generate a PDF report with:\n- Employee details\n- Salary history\n- Performance metrics\n- Attendance records`);
}
