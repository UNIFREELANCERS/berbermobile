// Employer Panel Functionality

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    // Check if user is logged in
    if (!currentUser) {
        window.location.href = 'signup.html';
        return;
    }
    
    // Check if user is a barber and employed
    if (currentUser.role !== 'barber' || currentUser.employmentStatus !== 'accepted') {
        if (currentUser.role === 'barber' && currentUser.employmentStatus !== 'accepted') {
            window.location.href = 'hire.html';
        } else {
            alert('Access denied. This page is for employees only.');
            window.location.href = 'home.html';
        }
        return;
    }
    
    // Display user info
    const userName = document.getElementById('userName');
    const employeeName = document.getElementById('employeeName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    userName.textContent = currentUser.name;
    employeeName.textContent = currentUser.name;
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // Load appointments
    loadAppointments(currentUser);
    
    // Filter tabs
    setupFilterTabs();
});

function loadAppointments(user) {
    // Get user's appointments/work assignments
    const users = getUsers();
    const currentUser = users.find(u => u.id === user.id);
    
    const appointments = currentUser?.appointments || [];
    
    // Update stats
    document.getElementById('totalAppointments').textContent = appointments.length;
    document.getElementById('pendingAppointments').textContent = 
        appointments.filter(a => a.status === 'pending').length;
    document.getElementById('completedAppointments').textContent = 
        appointments.filter(a => a.status === 'completed').length;
    
    // Display appointments
    renderAppointments(appointments);
}

function renderAppointments(appointments, filter = 'all') {
    const container = document.getElementById('appointmentsList');
    
    let filteredAppointments = appointments;
    if (filter !== 'all') {
        filteredAppointments = appointments.filter(a => a.status === filter);
    }
    
    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-inbox"></i>
                <p>No ${filter !== 'all' ? filter : ''} appointments yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredAppointments.map(appointment => `
        <div class="appointment-card" data-appointment-id="${appointment.id}">
            <div class="appointment-header">
                <div class="appointment-status status-${appointment.status}">
                    <i class="fas ${getStatusIcon(appointment.status)}"></i>
                    <span>${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                </div>
                <span class="appointment-date">${new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div class="appointment-body">
                <h3>${appointment.serviceName}</h3>
                <div class="appointment-client">
                    <i class="fas fa-user"></i>
                    <span>${appointment.clientName}</span>
                </div>
                <p class="appointment-description">${appointment.description || 'No description provided'}</p>
                <div class="appointment-details">
                    <div class="detail-item">
                        <i class="far fa-clock"></i>
                        <span>${appointment.time || 'Time TBD'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${appointment.price || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn-view-details" onclick="viewAppointmentDetails('${appointment.id}')">
                    View Details
                </button>
                ${appointment.status === 'pending' ? `
                    <button class="btn-accept" onclick="updateAppointmentStatus('${appointment.id}', 'accepted')">
                        Accept
                    </button>
                ` : ''}
                ${appointment.status === 'accepted' ? `
                    <button class="btn-complete" onclick="updateAppointmentStatus('${appointment.id}', 'completed')">
                        Mark Complete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getStatusIcon(status) {
    switch(status) {
        case 'pending': return 'fa-clock';
        case 'accepted': return 'fa-check-circle';
        case 'completed': return 'fa-check-double';
        default: return 'fa-info-circle';
    }
}

function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const currentUser = getCurrentUser();
            const users = getUsers();
            const user = users.find(u => u.id === currentUser.id);
            renderAppointments(user?.appointments || [], filter);
        });
    });
}

function viewAppointmentDetails(appointmentId) {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    const appointment = user?.appointments?.find(a => a.id === appointmentId);
    
    if (!appointment) return;
    
    const modal = document.getElementById('appointmentModal');
    const content = document.getElementById('appointmentModalContent');
    
    content.innerHTML = `
        <h2 style="color: white; margin-bottom: 20px;">Appointment Details</h2>
        <div class="appointment-detail">
            <div class="detail-row">
                <label>Service:</label>
                <span>${appointment.serviceName}</span>
            </div>
            <div class="detail-row">
                <label>Client:</label>
                <span>${appointment.clientName}</span>
            </div>
            <div class="detail-row">
                <label>Date:</label>
                <span>${new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
                <label>Time:</label>
                <span>${appointment.time || 'To be determined'}</span>
            </div>
            <div class="detail-row">
                <label>Price:</label>
                <span>$${appointment.price || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <label>Status:</label>
                <span class="status-badge status-${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
            </div>
            <div class="detail-row full-width">
                <label>Description:</label>
                <p>${appointment.description || 'No description provided'}</p>
            </div>
            ${appointment.clientPhone ? `
                <div class="detail-row">
                    <label>Client Phone:</label>
                    <span>${appointment.clientPhone}</span>
                </div>
            ` : ''}
            ${appointment.clientEmail ? `
                <div class="detail-row">
                    <label>Client Email:</label>
                    <span>${appointment.clientEmail}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
    
    document.querySelector('#appointmentModal .close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function updateAppointmentStatus(appointmentId, newStatus) {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return;
    
    const appointmentIndex = users[userIndex].appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex === -1) return;
    
    users[userIndex].appointments[appointmentIndex].status = newStatus;
    saveUsers(users);
    
    // Reload appointments
    loadAppointments(getCurrentUser());
}

