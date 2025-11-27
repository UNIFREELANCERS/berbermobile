// Home Page Authentication and Button Protection

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    const currentUser = getCurrentUser();
    const authBtn = document.getElementById('authBtn');
    const authIcon = document.getElementById('authIcon');
    const authText = document.getElementById('authText');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const authRequiredModal = document.getElementById('authRequiredModal');
    const closeModal = document.querySelector('.close-modal');
    
    // If user is logged in, show user info and update button
    if (currentUser) {
        // Update auth button to show logged in state
        authBtn.innerHTML = '<i class="fas fa-user-check"></i><span>LOGGED IN</span>';
        authBtn.style.background = '#4caf50';
        
        // Show user info
        userName.textContent = currentUser.name;
        userInfo.style.display = 'flex';
        
        // Auth button redirects to profile (or does nothing if logged in)
        authBtn.onclick = function() {
            // Could redirect to profile page
            alert(`Welcome back, ${currentUser.name}!`);
        };
        
        // Logout functionality
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    } else {
        // User not logged in - redirect to signup page
        authBtn.onclick = function() {
            window.location.href = 'signup.html';
        };
    }
    
    // Protect all buttons and links
    protectButtons();
    
    // Close modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            authRequiredModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === authRequiredModal) {
            authRequiredModal.style.display = 'none';
        }
    });
});

// Function to protect all buttons and links
function protectButtons() {
    const currentUser = getCurrentUser();
    
    // Protected buttons
    const protectedButtons = document.querySelectorAll('.protected-button, .btn-primary');
    protectedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!currentUser) {
                e.preventDefault();
                e.stopPropagation();
                showAuthRequired();
            } else {
                // User is authenticated, allow action
                handleAuthenticatedClick(this);
            }
        });
    });
    
    // Protected links
    const protectedLinks = document.querySelectorAll('.protected-link');
    protectedLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!currentUser) {
                e.preventDefault();
                e.stopPropagation();
                showAuthRequired();
                return;
            }
            
            // Handle EMPLOYEE PANEL link for barbers
            if (this.textContent.trim() === 'EMPLOYEE PANEL') {
                e.preventDefault();
                if (currentUser.role === 'barber') {
                    if (currentUser.employmentStatus === 'accepted') {
                        window.location.href = 'employerpanel.html';
                    } else {
                        window.location.href = 'hire.html';
                    }
                } else {
                    alert('This section is only available for employees.');
                }
            }
            // Other links will work normally if authenticated
        });
    });
}

// Show authentication required modal
function showAuthRequired() {
    const modal = document.getElementById('authRequiredModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        // Fallback: redirect to signup page
        if (confirm('You need to sign up or login to access this feature. Redirect to signup page?')) {
            window.location.href = 'signup.html';
        }
    }
}

// Handle authenticated button clicks
function handleAuthenticatedClick(button) {
    const buttonText = button.textContent.trim();
    
    // You can add specific functionality for each button here
    if (button.classList.contains('btn-primary')) {
        alert('Booking appointment... (This would open booking interface)');
    } else if (button.classList.contains('btn-orange')) {
        alert('Opening purchase page...');
    } else if (button.classList.contains('btn-blue')) {
        alert('Opening Hair Hustler Free page...');
    }
}

