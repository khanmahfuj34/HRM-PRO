// ===== Global Variables =====
let employees = [];
let editingIndex = -1;

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', function () {
    loadEmployees();
    updateDashboard();
    updateEmployeeList();
    initializeEventListeners();

    // Check if we need to open edit modal from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');
    if (editIndex !== null) {
        const index = parseInt(editIndex);
        if (index >= 0 && index < employees.length) {
            openEditModal(index);
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// ===== Event Listeners =====
function initializeEventListeners() {
    // Add Employee Button
    document.getElementById('addEmployeeBtn').addEventListener('click', openAddModal);

    // Close Modal Buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Form Submit
    document.getElementById('employeeForm').addEventListener('submit', handleFormSubmit);

    // Search Input
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Close modal when clicking outside
    document.getElementById('employeeModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// ===== LocalStorage Functions =====
function loadEmployees() {
    const stored = localStorage.getItem('employees');
    if (stored) {
        employees = JSON.parse(stored);
    } else {
        // Add some sample data for demonstration
        employees = [
            {
                name: "Sarah Johnson",
                email: "sarah.johnson@hrmpro.com",
                department: "Engineering",
                salary: 120000
            },
            {
                name: "Michael Chen",
                email: "michael.chen@hrmpro.com",
                department: "Marketing",
                salary: 85000
            },
            {
                name: "Emily Rodriguez",
                email: "emily.rodriguez@hrmpro.com",
                department: "Sales",
                salary: 95000
            },
            {
                name: "David Kim",
                email: "david.kim@hrmpro.com",
                department: "Finance",
                salary: 110000
            },
            {
                name: "Jessica Williams",
                email: "jessica.williams@hrmpro.com",
                department: "HR",
                salary: 78000
            }
        ];
        saveEmployees();
    }
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// ===== Dashboard Update =====
function updateDashboard() {
    // Total Employees
    document.getElementById('totalEmployees').textContent = employees.length;

    // Monthly Payroll
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
    document.getElementById('monthlyPayroll').textContent = '$' + totalPayroll.toLocaleString();

    // Total Departments
    const departments = new Set(employees.map(emp => emp.department));
    document.getElementById('totalDepartments').textContent = departments.size;
}

// ===== TASK 1: Update Employee List with High Earner Indicator =====
function updateEmployeeList(filteredEmployees = null) {
    const employeeList = document.getElementById('employeeList');
    const displayEmployees = filteredEmployees || employees;

    if (displayEmployees.length === 0) {
        employeeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <h3>No Employees Found</h3>
                <p>Start by adding your first employee to the system.</p>
            </div>
        `;
        return;
    }

    employeeList.innerHTML = '';

    displayEmployees.forEach((employee, index) => {
        const actualIndex = filteredEmployees ? employees.indexOf(employee) : index;
        const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase();

        // TASK 1: Check if salary is greater than $100,000 for golden star
        const highEarnerStar = employee.salary > 100000
            ? '<i class="fas fa-star" style="color:gold"></i>'
            : '';

        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="employee-header">
                <div class="employee-avatar">${initials}</div>
                <div class="employee-name">
                    <h3>
                        <a href="profile.html?id=${actualIndex}" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: color 0.3s ease;" onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='inherit'">
                            ${employee.name} ${highEarnerStar}
                        </a>
                    </h3>
                    <p>${employee.email}</p>
                </div>
            </div>
            <div class="employee-info">
                <div class="info-row">
                    <i class="fas fa-building"></i>
                    <span><strong>Department:</strong> ${employee.department}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-dollar-sign"></i>
                    <span><strong>Salary:</strong> <span class="salary-highlight">$${employee.salary.toLocaleString()}</span></span>
                </div>
            </div>
            <div class="card-buttons">
                <button class="btn btn-success" onclick="giveBonus(${actualIndex})">
                    <i class="fas fa-dollar-sign"></i> Bonus
                </button>
                <button class="btn btn-warning" onclick="editEmployee(${actualIndex})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteEmployee(${actualIndex})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        employeeList.appendChild(card);
    });
}

// ===== TASK 2: Give Bonus Function =====
function giveBonus(index) {
    // Increase salary by $1,000
    employees[index].salary += 1000;

    // Save to LocalStorage immediately
    saveEmployees();

    // Update the Dashboard (Monthly Payroll)
    updateDashboard();

    // Update the employee list to reflect the change
    updateEmployeeList();

    // Show confirmation alert
    alert(`Bonus added! New Salary: $${employees[index].salary.toLocaleString()}`);
}

// ===== Modal Functions =====
function openAddModal() {
    editingIndex = -1;
    document.getElementById('modalTitle').textContent = 'Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeModal').classList.add('active');
}

function openEditModal(index) {
    editingIndex = index;
    const employee = employees[index];

    document.getElementById('modalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('employeeEmail').value = employee.email;
    document.getElementById('employeeDepartment').value = employee.department;
    document.getElementById('employeeSalary').value = employee.salary;

    document.getElementById('employeeModal').classList.add('active');
}

function closeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    document.getElementById('employeeForm').reset();
    editingIndex = -1;
}

// ===== TASK 3: Form Submit with Email Validation =====
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('employeeName').value.trim();
    const email = document.getElementById('employeeEmail').value.trim().toLowerCase();
    const department = document.getElementById('employeeDepartment').value;
    const salary = parseFloat(document.getElementById('employeeSalary').value);

    // TASK 3: Check if email already exists (only when adding new employee)
    if (editingIndex === -1) {
        const emailExists = employees.some(emp => emp.email.toLowerCase() === email);

        if (emailExists) {
            alert("Error: This email is already registered!");
            return; // Stop the process, do not close modal
        }
    } else {
        // When editing, check if email exists in other employees (not the current one)
        const emailExists = employees.some((emp, idx) =>
            idx !== editingIndex && emp.email.toLowerCase() === email
        );

        if (emailExists) {
            alert("Error: This email is already registered!");
            return;
        }
    }

    const employee = {
        name: name,
        email: email,
        department: department,
        salary: salary
    };

    if (editingIndex === -1) {
        // Add new employee
        employees.push(employee);
    } else {
        // Update existing employee
        employees[editingIndex] = employee;
    }

    saveEmployees();
    updateDashboard();
    updateEmployeeList();
    closeModal();
}

// ===== Edit Employee =====
function editEmployee(index) {
    openEditModal(index);
}

// ===== Delete Employee =====
function deleteEmployee(index) {
    const employee = employees[index];

    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
        employees.splice(index, 1);
        saveEmployees();
        updateDashboard();
        updateEmployeeList();
    }
}

// ===== Search Functionality =====
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        updateEmployeeList();
        return;
    }

    const filtered = employees.filter(emp => {
        return emp.name.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm);
    });

    updateEmployeeList(filtered);
}
