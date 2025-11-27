// Services Page Functionality

// Service Data
const services = [
    {
        id: 1,
        name: "Classic Haircut",
        category: "haircut",
        price: 25,
        duration: "30 min",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Professional classic haircut with styling"
    },
    {
        id: 2,
        name: "Beard Trim & Shape",
        category: "trimming",
        price: 15,
        duration: "20 min",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Precision beard trimming and shaping"
    },
    {
        id: 3,
        name: "Fade Haircut",
        category: "haircut",
        price: 30,
        duration: "45 min",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Modern fade haircut with precision detailing"
    },
    {
        id: 4,
        name: "Hair Styling & Wash",
        category: "styling",
        price: 20,
        duration: "25 min",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Complete hair wash and professional styling"
    },
    {
        id: 5,
        name: "Full Beard Grooming",
        category: "beard",
        price: 35,
        duration: "40 min",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Complete beard grooming with hot towel treatment"
    }
];

let filteredServices = [...services];
let currentCategory = "all";
let currentType = "services";

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        userName.textContent = currentUser.name;
        userInfo.style.display = 'flex';
        
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
    
    // Initialize services
    renderServices();
    
    // Category filtering
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filterServices();
        });
    });
    
    // Type tabs
    const serviceTabs = document.querySelectorAll('.service-tab');
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            serviceTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            filterServices();
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('serviceSearch');
    searchInput.addEventListener('input', function() {
        filterServices();
    });
    
    // Employee filter
    const employeeFilter = document.getElementById('employeeFilter');
    employeeFilter.addEventListener('change', function() {
        filterServices();
    });
});

function filterServices() {
    const searchTerm = document.getElementById('serviceSearch').value.toLowerCase();
    
    filteredServices = services.filter(service => {
        const matchesCategory = currentCategory === 'all' || service.category === currentCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchTerm) || 
                            service.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    // Update count
    document.getElementById('serviceCount').textContent = filteredServices.length;
    
    // Re-render
    renderServices();
}

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    
    if (filteredServices.length === 0) {
        grid.innerHTML = '<div class="no-services">No services found. Try a different search.</div>';
        return;
    }
    
    grid.innerHTML = filteredServices.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-tag">
                <i class="fas fa-shopping-bag"></i>
                <span>Service</span>
            </div>
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Service'">
            </div>
            <div class="service-info">
                <h4 class="service-name">${service.name}</h4>
                <p class="service-description">${service.description}</p>
                <div class="service-meta">
                    <span class="service-duration"><i class="far fa-clock"></i> ${service.duration}</span>
                    <span class="service-price">KES ${service.price}</span>
                </div>
                <button class="service-select-btn mpesa-payment-btn" onclick="handleServicePayment(${service.id}, '${service.name}', ${service.price})">
                    <i class="fas fa-mobile-alt"></i>
                    Pay with M-Pesa
                </button>
            </div>
        </div>
    `).join('');
}

function handleServicePayment(serviceId, serviceName, price) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        document.getElementById('authRequiredModal').style.display = 'flex';
        return;
    }
    
    // Open M-Pesa payment form
    openMpesaPaymentForm(serviceId, 'service', serviceName, price);
}

// Close modal
document.addEventListener('click', function(e) {
    const modal = document.getElementById('authRequiredModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (e.target === modal || e.target === closeBtn) {
        modal.style.display = 'none';
    }
});

