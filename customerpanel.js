// Customer Panel Functionality

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'signup.html';
        return;
    }

    if (currentUser.role === 'barber') {
        // Redirect barbers to their panel or application flow
        if (currentUser.employmentStatus === 'accepted') {
            window.location.href = 'employerpanel.html';
        } else {
            window.location.href = 'hire.html';
        }
        return;
    }

    initHeader(currentUser);
    hydrateCustomerPanel(currentUser.id);
});

function initHeader(user) {
    const userName = document.getElementById('userName');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userName) userName.textContent = user.name;
    if (userInfo) userInfo.style.display = 'flex';
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

function hydrateCustomerPanel(userId) {
    let user = getUserRecord(userId);
    if (!user) return;

    const needsUpdate = seedSampleCustomerData(user);
    if (needsUpdate) {
        persistUser(user);
        user = getUserRecord(userId);
    }

    updateProfileCard(user);
    renderLoyalty(user);
    renderInsights(user);
    renderTimelines(user);
    hydrateRemarks(user);
    hydrateTips();
    hydrateCareTracker(userId);
    setupTabs();
    setupRemarkForm(userId);
    setupClearRemarks(userId);
    setupCareTracker(userId);
    setupTimezonePicker();
}

function getUserRecord(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId) || null;
}

function persistUser(user) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        saveUsers(users);
    }
}

function seedSampleCustomerData(user) {
    let updated = false;

    if (!Array.isArray(user.bookings)) {
        user.bookings = [];
        updated = true;
    }

    if (!Array.isArray(user.eventBookings)) {
        user.eventBookings = [];
        updated = true;
    }

    if (!Array.isArray(user.clientRemarks)) {
        user.clientRemarks = [];
        updated = true;
    }

    if (user.bookings.length === 0) {
        user.bookings = [
            {
                id: 'bk-' + Date.now(),
                serviceName: 'Students & Seniors Special',
                status: 'pending',
                date: '2025-11-25',
                time: '13:00',
                duration: '60 min',
                practitioner: 'Bria Sommers',
                location: 'Suite 4B · Lincoln Ave',
                price: 45,
                timezone: 'UTC',
                notes: 'Light taper fade with beard line-up.',
                createdAt: new Date().toISOString()
            },
            {
                id: 'bk-02',
                serviceName: 'Hydration Therapy Cut',
                status: 'completed',
                date: '2025-10-03',
                time: '10:30',
                duration: '75 min',
                practitioner: 'Miles Carter',
                location: 'Studio Loft · Brooklyn',
                price: 85,
                timezone: 'UTC',
                notes: 'Added steam treatment.',
                createdAt: new Date().toISOString()
            },
            {
                id: 'bk-03',
                serviceName: 'Edge & Style Refresh',
                status: 'completed',
                date: '2025-09-12',
                time: '15:00',
                duration: '45 min',
                practitioner: 'Bria Sommers',
                location: 'Suite 4B · Lincoln Ave',
                price: 55,
                timezone: 'UTC',
                notes: 'Requested matte finish.',
                createdAt: new Date().toISOString()
            }
        ];
        updated = true;
    }

    if (user.eventBookings.length === 0) {
        user.eventBookings = [
            {
                id: 'ev-' + Date.now(),
                eventTitle: 'Scalp Reset Workshop',
                eventDate: '2025-12-09',
                eventTime: '18:00',
                price: 35,
                status: 'confirmed',
                location: 'Hair Hustler HQ · Lounge',
                notes: 'Bring current product list.',
                bookingDate: new Date().toISOString()
            }
        ];
        updated = true;
    }

    return updated;
}

function updateProfileCard(user) {
    const bookings = user.bookings || [];
    const upcoming = bookings.filter(isUpcomingBooking);
    const completed = bookings.filter(b => b.status === 'completed');
    const events = user.eventBookings || [];

    setText('profileName', user.name);
    setText('profileEmail', user.email);

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    setText('profileAvatar', initials || 'HH');

    const membershipTier = completed.length >= 6 ? 'Gold Member' : completed.length >= 3 ? 'Silver Member' : 'Classic Member';
    setText('membershipTier', membershipTier);

    setText('sidebarUpcoming', upcoming.length);
    setText('sidebarHistory', completed.length);
    setText('sidebarEvents', events.length);

    if (upcoming.length > 0) {
        const next = upcoming.sort(compareByDate)[0];
        setText('nextAppointmentTitle', next.serviceName);
        setText('nextAppointmentMeta', `${formatDate(next.date)} · ${next.time} · ${next.location}`);
    } else {
        setText('nextAppointmentTitle', 'No bookings yet');
        setText('nextAppointmentMeta', 'Tap “Book New Service” to secure your next slot.');
    }
}

function renderLoyalty(user) {
    const completed = (user.bookings || []).filter(b => b.status === 'completed').length;
    const target = 6;
    const progress = Math.min(100, Math.round((completed / target) * 100));

    const fill = document.getElementById('loyaltyProgressFill');
    if (fill) fill.style.width = progress + '%';

    setText('loyaltyProgressText', `${progress}% complete`);
}

function renderInsights(user) {
    const bookings = user.bookings || [];
    const completed = bookings.filter(b => b.status === 'completed').sort(compareByDate);

    if (completed.length >= 2) {
        const intervals = [];
        for (let i = 1; i < completed.length; i++) {
            const prev = new Date(completed[i - 1].date);
            const curr = new Date(completed[i].date);
            const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            intervals.push(diff);
        }
        const avg = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
        setText('cadenceLabel', `${avg} days`);
    } else {
        setText('cadenceLabel', '—');
    }

    const stylistCounts = countBy(bookings, 'practitioner');
    const favoriteStylist = getTopKey(stylistCounts);
    setText('stylistLabel', favoriteStylist || 'Unassigned');

    const serviceCounts = countBy(bookings, 'serviceName');
    const favoriteService = getTopKey(serviceCounts);
    setText('serviceLabel', favoriteService || '—');
}

function renderTimelines(user) {
    const bookings = user.bookings || [];
    const upcoming = bookings.filter(isUpcomingBooking).sort(compareByDate);
    const history = bookings.filter(b => !isUpcomingBooking(b)).sort((a, b) => compareByDate(b, a));
    const events = (user.eventBookings || []).sort((a, b) => compareByDate(b, a));

    renderTimelineList('upcomingTimeline', upcoming, 'No upcoming appointments yet.');
    renderTimelineList('historyTimeline', history, 'Past appointments will land here.');
    renderTimelineList('eventsTimeline', events, 'No event bookings just yet.', true);
}

function renderTimelineList(containerId, items, emptyMessage, isEvent = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items.length) {
        container.innerHTML = `
            <div class="timeline-empty">
                <i class="far fa-calendar-times"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items
        .map(item => {
            const status = item.status || 'confirmed';
            const title = isEvent ? item.eventTitle : item.serviceName;
            const date = formatDate(isEvent ? item.eventDate : item.date);
            const time = isEvent ? item.eventTime : item.time;
            const meta = isEvent ? item.location || 'On-site' : item.location;
            const priceLabel = item.price ? `$${item.price}` : '';
            const duration = item.duration || (isEvent ? '90 min' : '60 min');
            const practitioner = isEvent ? 'Community Session' : (item.practitioner || 'Stylist TBD');

            return `
                <article class="timeline-card">
                    <div class="timeline-marker"></div>
                    <div class="timeline-body">
                        <div class="timeline-head">
                            <div>
                                <p class="timeline-date">${date}</p>
                                <h3>${title}</h3>
                            </div>
                            <span class="status-chip status-${status}">${status}</span>
                        </div>
                        <div class="timeline-meta">
                            <span><i class="far fa-clock"></i>${time} · ${duration}</span>
                            <span><i class="fas fa-map-marker-alt"></i>${meta}</span>
                        </div>
                        <div class="timeline-footer">
                            <span class="timeline-practitioner">
                                <i class="fas fa-user-circle"></i>${practitioner}
                            </span>
                            <div class="timeline-actions">
                                ${priceLabel ? `<span class="price-chip">${priceLabel}</span>` : ''}
                                <button class="ghost-btn" data-id="${item.id}" data-title="${title}">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        })
        .join('');
}

function hydrateRemarks(user) {
    const remarks = user.clientRemarks || [];
    renderRemarksFeed(remarks);
}

function renderRemarksFeed(remarks) {
    const feed = document.getElementById('remarksFeed');
    if (!feed) return;

    if (!remarks.length) {
        feed.innerHTML = `
            <div class="remark-empty">
                <i class="fas fa-inbox"></i>
                <p>No remarks yet. Share your thoughts to help us tailor every visit.</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = remarks
        .slice(0, 4)
        .map(remark => `
            <div class="remark-item">
                <div class="remark-rating">
                    ${'★'.repeat(remark.rating)}${'☆'.repeat(5 - remark.rating)}
                </div>
                <div>
                    <p class="remark-service">${remark.service}</p>
                    <p class="remark-message">${remark.message}</p>
                    <span class="remark-date">${formatDateTime(remark.createdAt)}</span>
                </div>
            </div>
        `)
        .join('');
}

function setupRemarkForm(userId) {
    const form = document.getElementById('remarkForm');
    const hint = document.getElementById('remarkHint');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const service = document.getElementById('remarkService').value.trim();
        const rating = parseInt(document.getElementById('remarkRating').value, 10);
        const message = document.getElementById('remarkMessage').value.trim();

        if (!service || !rating || !message) return;

        const user = getUserRecord(userId);
        if (!user) return;

        const remark = {
            id: 'remark-' + Date.now(),
            service,
            rating,
            message,
            createdAt: new Date().toISOString()
        };

        user.clientRemarks = [remark, ...(user.clientRemarks || [])];
        persistUser(user);
        renderRemarksFeed(user.clientRemarks);
        form.reset();
        if (hint) {
            hint.textContent = 'Remark received. Thank you for the insight!';
            setTimeout(() => (hint.textContent = 'Remarks go straight to our lead stylist.'), 4000);
        }
    });
}

function setupClearRemarks(userId) {
    const btn = document.getElementById('clearRemarksBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!confirm('Clear all of your saved remarks?')) return;
        const user = getUserRecord(userId);
        if (!user) return;
        user.clientRemarks = [];
        persistUser(user);
        renderRemarksFeed([]);
    });
}

function hydrateTips() {
    const tips = [
        'Arrive 5 minutes early so we can settle you in with a complimentary scalp mist.',
        'Pair hydration services with cool-air drying at home to lock in moisture.',
        'Alternate matte and gloss finishers to keep texture flexible between visits.',
        'Keep a photo roll of looks you loved – it helps us remix styles quicker.'
    ];

    const list = document.getElementById('tipsList');
    if (!list) return;
    list.innerHTML = tips
        .map(tip => `
            <div class="tip-item">
                <i class="fas fa-star"></i>
                <p>${tip}</p>
            </div>
        `)
        .join('');
}

function setupTabs() {
    const tabs = document.querySelectorAll('.customer-tabs .tab-btn');
    const timelines = document.querySelectorAll('.timeline-list');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.dataset.target;
            timelines.forEach(list => {
                if (list.id === targetId) {
                    list.classList.remove('hidden');
                } else {
                    list.classList.add('hidden');
                }
            });
        });
    });
}

function setupTimezonePicker() {
    const select = document.getElementById('timezoneSelect');
    if (!select) return;

    select.addEventListener('change', () => {
        const datePill = document.getElementById('dateRangeDisplay');
        if (datePill) {
            datePill.querySelector('span').textContent = `Showing in ${select.value}`;
        }
    });

    const filtersBtn = document.getElementById('filtersBtn');
    if (filtersBtn) {
        filtersBtn.addEventListener('click', () => {
            alert('Custom filters coming soon – for now, enjoy the curated view.');
        });
    }
}

function hydrateCareTracker(userId) {
    const trackerKey = getCareTrackerKey(userId);
    const stored = JSON.parse(localStorage.getItem(trackerKey) || '{}');
    const inputs = document.querySelectorAll('.care-item input');
    inputs.forEach(input => {
        input.checked = Boolean(stored[input.dataset.care]);
    });
    updateCareCompletion(userId);
}

function setupCareTracker(userId) {
    const inputs = document.querySelectorAll('.care-item input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const trackerKey = getCareTrackerKey(userId);
            const stored = JSON.parse(localStorage.getItem(trackerKey) || '{}');
            stored[input.dataset.care] = input.checked;
            localStorage.setItem(trackerKey, JSON.stringify(stored));
            updateCareCompletion(userId);
        });
    });
}

function updateCareCompletion(userId) {
    const trackerKey = getCareTrackerKey(userId);
    const stored = JSON.parse(localStorage.getItem(trackerKey) || '{}');
    const completed = Object.values(stored).filter(Boolean).length;
    setText('careCompletion', `${completed}/3 done`);
}

function getCareTrackerKey(userId) {
    return `hairHustlerCareTracker_${userId}`;
}

// Helpers
function isUpcomingBooking(booking) {
    const bookingDate = new Date(`${booking.date}T${booking.time || '00:00'}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today && booking.status !== 'completed';
}

function compareByDate(a, b) {
    const dateA = new Date(`${a.date || a.eventDate}T${a.time || a.eventTime || '00:00'}`);
    const dateB = new Date(`${b.date || b.eventDate}T${b.time || b.eventTime || '00:00'}`);
    return dateA - dateB;
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function countBy(items, key) {
    return items.reduce((acc, item) => {
        const value = item[key];
        if (!value) return acc;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}

function getTopKey(countMap) {
    const entries = Object.entries(countMap);
    if (!entries.length) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

