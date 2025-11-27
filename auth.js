// Authentication System for Hair Hustler
// Database operations using localStorage (acts as database)

// Database structure stored in localStorage
const DB_KEY = 'hairHustlerUsers';

// Initialize database if it doesn't exist
function initDatabase() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
}

// Get all users from database
function getUsers() {
    initDatabase();
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users to database
function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Check if email already exists
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register a new user
function registerUser(userData) {
    const users = getUsers();
    
    // Check if email already exists
    if (emailExists(userData.email)) {
        return { success: false, message: 'Email already registered. Please login instead.' };
    }
    
    // Create user object
    const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone,
        role: userData.role,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        lastLogin: null,
        bookings: [],
        profile: {},
        employmentStatus: null, // For barbers: null, 'pending', 'accepted', 'rejected'
        application: null, // For barbers application data
        appointments: [] // For employed barbers
    };
    
    // Add user to database
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Account created successfully!', user: newUser };
}

// Login user
function loginUser(email, password, rememberMe = false) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid email or password.' };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    saveUsers(users);
    
    // Set session
    const sessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
    };
    
    if (rememberMe) {
        localStorage.setItem('hairHustlerSession', JSON.stringify(sessionData));
        localStorage.setItem('hairHustlerRemember', 'true');
    } else {
        sessionStorage.setItem('hairHustlerSession', JSON.stringify(sessionData));
    }
    
    return { success: true, message: 'Login successful!', user: user };
}

// Check if user is logged in
function isLoggedIn() {
    const session = sessionStorage.getItem('hairHustlerSession') || localStorage.getItem('hairHustlerSession');
    return session ? JSON.parse(session) : null;
}

// Get current user
function getCurrentUser() {
    const session = isLoggedIn();
    if (!session) return null;
    
    const users = getUsers();
    return users.find(u => u.id === session.id) || null;
}

// Logout user
function logout() {
    sessionStorage.removeItem('hairHustlerSession');
    localStorage.removeItem('hairHustlerSession');
    localStorage.removeItem('hairHustlerRemember');
    window.location.href = 'signup.html';
}

// Require authentication - redirect if not logged in
function requireAuth(redirectUrl = 'signup.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Initialize database on load
initDatabase();

// Auto-login if remember me was checked
window.addEventListener('DOMContentLoaded', () => {
    const remember = localStorage.getItem('hairHustlerRemember');
    if (remember === 'true' && localStorage.getItem('hairHustlerSession')) {
        // Session is already active
    }
});

