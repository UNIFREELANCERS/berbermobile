// Hire Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    // Check if user is logged in
    if (!currentUser) {
        window.location.href = 'signup.html';
        return;
    }
    
    // Check if user is a barber
    if (currentUser.role !== 'barber') {
        alert('This page is only for barbers. Redirecting...');
        window.location.href = 'home.html';
        return;
    }
    
    // Check if user is already employed
    if (currentUser.employmentStatus === 'accepted') {
        window.location.href = 'employerpanel.html';
        return;
    }
    
    // Display user info
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    userName.textContent = currentUser.name;
    userInfo.style.display = 'flex';
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // Fill in user details
    document.getElementById('applicantName').value = currentUser.name;
    document.getElementById('applicantEmail').value = currentUser.email;
    document.getElementById('applicantPhone').value = currentUser.phone || '';
    
    // Check existing application status
    checkApplicationStatus(currentUser);
    
    // File upload handlers
    setupFileUpload('cvFile', 'cvFileName', 'cvUploadArea');
    setupFileUpload('videoFile', 'videoFileName', 'videoUploadArea');
    
    // Form submission
    const hireForm = document.getElementById('hireForm');
    hireForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitApplication(currentUser);
    });
});

function setupFileUpload(inputId, displayId, areaId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    const area = document.getElementById(areaId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size
            const maxSize = inputId === 'cvFile' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for CV, 50MB for video
            if (file.size > maxSize) {
                alert(`File size exceeds maximum allowed size (${inputId === 'cvFile' ? '5MB' : '50MB'})`);
                input.value = '';
                display.textContent = '';
                return;
            }
            
            display.textContent = file.name;
            display.style.display = 'block';
            area.classList.add('file-selected');
        }
    });
    
    // Drag and drop
    area.addEventListener('dragover', function(e) {
        e.preventDefault();
        area.classList.add('drag-over');
    });
    
    area.addEventListener('dragleave', function(e) {
        e.preventDefault();
        area.classList.remove('drag-over');
    });
    
    area.addEventListener('drop', function(e) {
        e.preventDefault();
        area.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            input.dispatchEvent(new Event('change'));
        }
    });
}

function checkApplicationStatus(user) {
    const users = getUsers();
    const currentUser = users.find(u => u.id === user.id);
    
    if (currentUser && currentUser.application) {
        const status = currentUser.application.status;
        const statusCard = document.getElementById('applicationStatus');
        const statusText = document.getElementById('statusText');
        const statusDate = document.getElementById('statusDate');
        const hireFormContainer = document.getElementById('hireFormContainer');
        
        statusCard.style.display = 'block';
        
        let statusClass = '';
        let icon = '';
        let message = '';
        
        switch(status) {
            case 'pending':
                statusClass = 'status-pending';
                icon = 'fas fa-clock';
                message = 'Your application is under review. We will notify you once a decision is made.';
                break;
            case 'accepted':
                statusClass = 'status-accepted';
                icon = 'fas fa-check-circle';
                message = 'Congratulations! Your application has been accepted. You are now part of the Hair Hustler team.';
                hireFormContainer.style.display = 'none';
                setTimeout(() => {
                    window.location.href = 'employerpanel.html';
                }, 3000);
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                icon = 'fas fa-times-circle';
                message = 'Unfortunately, your application was not accepted at this time. You can submit a new application.';
                break;
        }
        
        document.getElementById('statusCard').className = `status-card ${statusClass}`;
        document.getElementById('statusCard').querySelector('i').className = icon;
        statusText.textContent = message;
        statusDate.textContent = `Submitted: ${new Date(currentUser.application.submittedAt).toLocaleDateString()}`;
    }
}

async function submitApplication(user) {
    const cvFile = document.getElementById('cvFile').files[0];
    const videoFile = document.getElementById('videoFile').files[0];
    const experience = document.getElementById('experience').value;
    const motivation = document.getElementById('motivation').value;
    
    if (!cvFile || !videoFile) {
        alert('Please upload both CV and video proof of work.');
        return;
    }
    
    // Disable submit button to prevent double submission
    const submitBtn = document.querySelector('.btn-submit-application');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Create application object with pending status
    const application = {
        submittedAt: new Date().toISOString(),
        experience: experience,
        motivation: motivation,
        status: 'pending',
        cvFileName: cvFile.name,
        videoFileName: videoFile.name
    };
    
    // Update user in database
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        users[userIndex].application = application;
        saveUsers(users);
    }
    
    // Prepare FormData for FormSpree
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('phone', user.phone || '');
    formData.append('experience', experience);
    formData.append('motivation', motivation);
    formData.append('cv_file', cvFile);
    formData.append('video_file', videoFile);
    formData.append('subject', `Barber Application - ${user.name}`);
    formData.append('submitted_at', new Date().toLocaleString());
    formData.append('_replyto', user.email);
    formData.append('_subject', `New Barber Application from ${user.name}`);
    
    try {
        // Submit to FormSpree
        // IMPORTANT: Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual FormSpree endpoint
        // Get your endpoint from: https://formspree.io/
        // Example: 'https://formspree.io/f/xpzgqnkl'
        // After you reply from FormSpree, call updateApplicationStatus(userId, 'accepted' or 'rejected')
        const formSpreeEndpoint = 'https://formspree.io/f/mldkpkbj'; // TODO: Replace with your FormSpree endpoint
        
        const response = await fetch(formSpreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        
        // Check FormSpree response
        if (response.ok || result.success || result.ok) {
            // FormSpree sent successfully
            // Update application status to pending (awaiting review)
            if (userIndex !== -1) {
                users[userIndex].application.status = 'pending';
                users[userIndex].application.formSpreeSubmitted = true;
                saveUsers(users);
            }
            
            showModal(
                'Application Submitted Successfully!',
                'Your application has been successfully submitted. We will review it and get back to you soon. You can check the status on this page.',
                'success'
            );
            
            // Refresh status and reset form
            setTimeout(() => {
                checkApplicationStatus(getCurrentUser());
                document.getElementById('hireForm').reset();
                document.getElementById('cvFileName').textContent = '';
                document.getElementById('videoFileName').textContent = '';
                document.getElementById('cvUploadArea').classList.remove('file-selected');
                document.getElementById('videoUploadArea').classList.remove('file-selected');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 2000);
            
        } else {
            // FormSpree submission failed
            throw new Error(result.error || 'Submission failed');
        }
        
    } catch (error) {
        console.error('FormSpree submission error:', error);
        
        // Show error message
        showModal(
            'Application Submission Failed',
            'We encountered an issue submitting your application. Please try again later or contact us directly.',
            'error'
        );
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // You can also keep the application in pending status for retry
        if (userIndex !== -1) {
            users[userIndex].application.formSpreeError = error.message;
            saveUsers(users);
        }
    }
}

// Helper function to find user by email and update application status
// Usage: updateApplicationStatusByEmail('user@example.com', 'accepted') or updateApplicationStatusByEmail('user@example.com', 'rejected')
function updateApplicationStatusByEmail(userEmail, status) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    if (user && user.application) {
        updateApplicationStatus(user.id, status);
        return { success: true, message: `Application status updated to ${status} for ${user.name}` };
    }
    
    return { success: false, message: 'User not found or no application submitted' };
}

// Function to update application status after reviewing FormSpree email
// Call this function after reviewing the application from FormSpree
// Usage: updateApplicationStatus(userId, 'accepted') or updateApplicationStatus(userId, 'rejected')
// You can get the userId from the application email or use updateApplicationStatusByEmail() with the email
function updateApplicationStatus(userId, status) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && users[userIndex].application) {
        if (status === 'accepted') {
            users[userIndex].application.status = 'accepted';
            users[userIndex].employmentStatus = 'accepted';
            users[userIndex].application.reviewedAt = new Date().toISOString();
            
            // If user is currently logged in, show success message
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                showModal(
                    'Congratulations!',
                    'Your application has been accepted! You are now part of the Hair Hustler team. Redirecting to employee panel...',
                    'success'
                );
                
                setTimeout(() => {
                    window.location.href = 'employerpanel.html';
                }, 3000);
            }
        } else if (status === 'rejected') {
            users[userIndex].application.status = 'rejected';
            users[userIndex].application.reviewedAt = new Date().toISOString();
            
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                showModal(
                    'Application Update',
                    'Your application was not successful this time. Feel free to try again in the future.',
                    'error'
                );
            }
        }
        
        saveUsers(users);
        checkApplicationStatus(getCurrentUser());
    }
}

function showModal(title, message, type) {
    const modal = document.getElementById('responseModal');
    const modalContent = document.getElementById('modalContent');
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const color = type === 'success' ? '#4caf50' : '#f44336';
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <i class="fas ${icon}" style="font-size: 48px; color: ${color}; margin-bottom: 20px;"></i>
            <h2 style="color: white; margin-bottom: 15px;">${title}</h2>
            <p style="color: rgba(255,255,255,0.8);">${message}</p>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Close modal handlers
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

