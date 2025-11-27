// Events Page Functionality

// Events Data
const events = [
    {
        id: 1,
        title: "Master Barber Workshop",
        date: "2024-03-15",
        time: "10:00 AM - 2:00 PM",
        price: 50,
        location: "Main Studio",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Learn advanced barbering techniques from industry experts. Perfect for professionals looking to enhance their skills.",
        category: "Workshop"
    },
    {
        id: 2,
        title: "Fade Masterclass",
        date: "2024-03-20",
        time: "11:00 AM - 3:00 PM",
        price: 75,
        location: "Training Center",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Master the art of fade haircuts with hands-on training. All skill levels welcome.",
        category: "Training"
    },
    {
        id: 3,
        title: "Beard Styling Seminar",
        date: "2024-03-25",
        time: "2:00 PM - 5:00 PM",
        price: 35,
        location: "Conference Hall",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Comprehensive guide to beard grooming and styling techniques for modern barbers.",
        category: "Seminar"
    },
    {
        id: 4,
        title: "Haircut Championship",
        date: "2024-04-01",
        time: "9:00 AM - 6:00 PM",
        price: 100,
        location: "Grand Arena",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Competition event showcasing the best barbers in the region. Watch live demonstrations.",
        category: "Competition"
    },
    {
        id: 5,
        title: "Client Consultation Workshop",
        date: "2024-04-05",
        time: "1:00 PM - 4:00 PM",
        price: 45,
        location: "Main Studio",
        image: "https://images.unsplash.com/photo-1622296242086-4314e36a1c95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Learn effective client communication and consultation techniques to improve customer satisfaction.",
        category: "Workshop"
    },
    {
        id: 6,
        title: "Classic Cuts Revival",
        date: "2024-04-10",
        time: "10:00 AM - 1:00 PM",
        price: 40,
        location: "Heritage Studio",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Explore traditional barbering styles and techniques that never go out of fashion.",
        category: "Workshop"
    },
    {
        id: 7,
        title: "Modern Styling Techniques",
        date: "2024-04-15",
        time: "2:00 PM - 6:00 PM",
        price: 65,
        location: "Innovation Lab",
        image: "https://images.unsplash.com/photo-1622296242086-4314e36a1c95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Cutting-edge styling techniques and trends in contemporary barbering.",
        category: "Training"
    },
    {
        id: 8,
        title: "Business Management for Barbers",
        date: "2024-04-20",
        time: "10:00 AM - 3:00 PM",
        price: 85,
        location: "Business Center",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Essential business skills for barbershop owners and independent barbers.",
        category: "Seminar"
    },
    {
        id: 9,
        title: "Safety & Hygiene Training",
        date: "2024-04-25",
        time: "11:00 AM - 2:00 PM",
        price: 30,
        location: "Training Center",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Important health and safety protocols for professional barbershops.",
        category: "Training"
    },
    {
        id: 10,
        title: "Trend Forecasting Session",
        date: "2024-05-01",
        time: "3:00 PM - 6:00 PM",
        price: 55,
        location: "Style Studio",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Learn about upcoming hair trends and how to adapt your services accordingly.",
        category: "Seminar"
    },
    {
        id: 11,
        title: "Scissor Work Masterclass",
        date: "2024-05-05",
        time: "9:00 AM - 1:00 PM",
        price: 70,
        location: "Main Studio",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Advanced scissor techniques for precision cutting and texturizing.",
        category: "Workshop"
    },
    {
        id: 12,
        title: "Customer Service Excellence",
        date: "2024-05-10",
        time: "1:00 PM - 4:00 PM",
        price: 40,
        location: "Conference Hall",
        image: "https://images.unsplash.com/photo-1622296242086-4314e36a1c95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Build lasting client relationships through exceptional customer service.",
        category: "Seminar"
    },
    {
        id: 13,
        title: "Color Techniques Workshop",
        date: "2024-05-15",
        time: "10:00 AM - 3:00 PM",
        price: 80,
        location: "Color Studio",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Introduction to hair coloring techniques for barbers expanding their services.",
        category: "Workshop"
    },
    {
        id: 14,
        title: "Networking & Community",
        date: "2024-05-20",
        time: "6:00 PM - 9:00 PM",
        price: 25,
        location: "Event Center",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Connect with fellow barbers and industry professionals in a casual setting.",
        category: "Networking"
    },
    {
        id: 15,
        title: "Year-End Celebration",
        date: "2024-05-25",
        time: "7:00 PM - 11:00 PM",
        price: 60,
        location: "Grand Ballroom",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Celebrate another great year with awards, live demonstrations, and entertainment.",
        category: "Celebration"
    }
];

let filteredEvents = [...events];

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
    
    // Render events
    renderEvents();
    
    // Search functionality
    const searchInput = document.getElementById('eventsSearch');
    searchInput.addEventListener('input', function() {
        filterEvents();
    });
    
    // Filters button (placeholder for future filter functionality)
    document.getElementById('filtersBtn').addEventListener('click', function() {
        alert('Filter options coming soon!');
    });
});

function filterEvents() {
    const searchTerm = document.getElementById('eventsSearch').value.toLowerCase();
    
    filteredEvents = events.filter(event => {
        return event.title.toLowerCase().includes(searchTerm) ||
               event.description.toLowerCase().includes(searchTerm) ||
               event.category.toLowerCase().includes(searchTerm) ||
               event.location.toLowerCase().includes(searchTerm);
    });
    
    document.getElementById('eventsCount').textContent = filteredEvents.length;
    renderEvents();
}

function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    
    if (filteredEvents.length === 0) {
        grid.innerHTML = '<div class="no-events">No events found. Try a different search.</div>';
        return;
    }
    
    grid.innerHTML = filteredEvents.map(event => `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Event'">
                <div class="event-price-tag">KES ${event.price}</div>
            </div>
            <div class="event-content">
                <div class="event-category">${event.category}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <div class="event-detail-item">
                        <i class="far fa-calendar"></i>
                        <span>${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div class="event-detail-item">
                        <i class="far fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
                <button class="event-book-btn mpesa-payment-btn" onclick="handleEventPayment(${event.id}, '${event.title}', ${event.price})">
                    <i class="fas fa-mobile-alt"></i>
                    Pay with M-Pesa
                </button>
            </div>
        </div>
    `).join('');
}

function handleEventPayment(eventId, eventTitle, price) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        document.getElementById('authRequiredModal').style.display = 'flex';
        return;
    }
    
    // Open M-Pesa payment form
    openMpesaPaymentForm(eventId, 'event', eventTitle, price);
}

// Close auth modal
document.addEventListener('click', function(e) {
    const modal = document.getElementById('authRequiredModal');
    const closeBtn = document.querySelector('#authRequiredModal .close-modal');
    
    if (e.target === modal || e.target === closeBtn) {
        modal.style.display = 'none';
    }
});

