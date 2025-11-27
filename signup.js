// Sign Up / Login Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const signupTab = document.querySelector('[data-tab="signup"]');
    const loginTab = document.querySelector('[data-tab="login"]');
    const signupFormDiv = document.getElementById('signupForm');
    const loginFormDiv = document.getElementById('loginForm');
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'home.html';
        return;
    }
    
    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupFormDiv.classList.add('active');
        loginFormDiv.classList.remove('active');
        clearMessages();
    });
    
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginFormDiv.classList.add('active');
        signupFormDiv.classList.remove('active');
        clearMessages();
    });
    
    // Sign Up Form Submission
    const signupFormElement = document.getElementById('signupFormElement');
    signupFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const role = document.getElementById('signup-role').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        const messageDiv = document.getElementById('signup-message');
        
        // Validation
        if (!name || !email || !phone || !role || !password || !confirmPassword) {
            showMessage(messageDiv, 'Please fill in all fields.', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage(messageDiv, 'Password must be at least 6 characters long.', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage(messageDiv, 'Passwords do not match.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Register user
        const result = registerUser({ name, email, phone, role, password });
        
        if (result.success) {
            showMessage(messageDiv, result.message, 'success');
            
            // Auto login after successful signup
            setTimeout(() => {
                const loginResult = loginUser(email, password, true);
                if (loginResult.success) {
                    // Redirect based on user role
                    if (role === 'barber') {
                        window.location.href = 'hire.html';
                    } else {
                        window.location.href = 'home.html';
                    }
                }
            }, 1500);
        } else {
            showMessage(messageDiv, result.message, 'error');
        }
    });
    
    // Login Form Submission
    const loginFormElement = document.getElementById('loginFormElement');
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        const messageDiv = document.getElementById('login-message');
        
        // Validation
        if (!email || !password) {
            showMessage(messageDiv, 'Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Login user
        const result = loginUser(email, password, rememberMe);
        
        if (result.success) {
            showMessage(messageDiv, result.message, 'success');
            setTimeout(() => {
                // Redirect based on user role and employment status
                if (result.user.role === 'barber') {
                    if (result.user.employmentStatus === 'accepted') {
                        window.location.href = 'employerpanel.html';
                    } else {
                        window.location.href = 'hire.html';
                    }
                } else {
                    window.location.href = 'home.html';
                }
            }, 1000);
        } else {
            showMessage(messageDiv, result.message, 'error');
        }
    });
});

// Helper Functions
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'auth-message ' + type;
    element.style.display = 'block';
    
    // Auto hide success messages
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function clearMessages() {
    document.getElementById('signup-message').style.display = 'none';
    document.getElementById('login-message').style.display = 'none';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

