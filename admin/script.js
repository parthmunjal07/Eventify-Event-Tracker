// Initialize the application
let currentEditingId = null;
let allEvents = [];
let currentFilter = 'all';

// Load events from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    updateStats();
    renderEvents();
    attachEventListeners();
});

// Attach all event listeners
function attachEventListeners() {
    const addEventBtn = document.getElementById('addEventBtn');
    const eventForm = document.getElementById('eventForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const eventModal = document.getElementById('eventModal');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    addEventBtn.addEventListener('click', openAddModal);
    eventForm.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    searchInput.addEventListener('input', filterAndRenderEvents);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAndRenderEvents();
        });
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
        }
    });
}

// Open modal for adding new event
function openAddModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Event';
    document.getElementById('eventForm').reset();
    document.getElementById('eventModal').classList.add('active');
}

// Open modal for editing event
function openEditModal(id) {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Event';
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventCapacity').value = event.capacity || '';
    document.getElementById('eventStatus').value = event.status;
    document.getElementById('eventModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('eventModal').classList.remove('active');
    currentEditingId = null;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const eventData = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        capacity: document.getElementById('eventCapacity').value || 'Unlimited',
        status: document.getElementById('eventStatus').value,
    };

    if (currentEditingId) {
        // Update existing event
        const index = allEvents.findIndex(e => e.id === currentEditingId);
        if (index !== -1) {
            allEvents[index] = { ...allEvents[index], ...eventData };
        }
    } else {
        // Add new event
        const newEvent = {
            id: Date.now(),
            ...eventData,
            registrations: 0,
            createdAt: new Date().toLocaleDateString()
        };
        allEvents.push(newEvent);
    }

    saveEvents();
    updateStats();
    filterAndRenderEvents();
    closeModal();
    showNotification('Event saved successfully!');
}

// Delete event
function deleteEvent(id) {
    currentDeleteId = id;
    document.getElementById('deleteModal').classList.add('active');
}

let currentDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentDeleteId) {
            allEvents = allEvents.filter(e => e.id !== currentDeleteId);
            saveEvents();
            updateStats();
            filterAndRenderEvents();
            document.getElementById('deleteModal').classList.remove('active');
            showNotification('Event deleted successfully!');
            currentDeleteId = null;
        }
    });
});

// Change event status
function changeStatus(id, newStatus) {
    const event = allEvents.find(e => e.id === id);
    if (event) {
        event.status = newStatus;
        saveEvents();
        updateStats();
        filterAndRenderEvents();
        showNotification(`Status changed to ${newStatus}`);
    }
}

// Filter and render events
function filterAndRenderEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allEvents.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || event.status === currentFilter;
        return matchesSearch && matchesFilter;
    });

    renderEvents(filtered);
}

// Render events in table
function renderEvents(events = allEvents) {
    const tableBody = document.getElementById('eventsTableBody');
    const emptyState = document.getElementById('emptyState');

    tableBody.innerHTML = '';

    if (events.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${event.name}</strong></td>
            <td>
                <div style="font-size: 13px;">
                    ${formatDate(event.date)} ${event.time}
                </div>
            </td>
            <td>${event.location}</td>
            <td>
                <span class="status-badge status-${getStatusClass(event.status)}" 
                      onclick="changeStatus(${event.id}, '${getNextStatus(event.status)}')"
                      title="Click to change status">
                    ${event.status}
                </span>
            </td>
            <td>${event.registrations || 0}${event.capacity !== 'Unlimited' ? '/' + event.capacity : ''}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="openEditModal(${event.id})" title="Edit">✏️</button>
                    <button class="action-btn delete" onclick="deleteEvent(${event.id})" title="Delete">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get status class for styling
function getStatusClass(status) {
    switch(status) {
        case 'To Be Announced':
            return 'announced';
        case 'Upcoming':
            return 'upcoming';
        case 'Ongoing':
            return 'ongoing';
        case 'Completed':
            return 'completed';
        default:
            return 'announced';
    }
}

// Get next status for cycling
function getNextStatus(currentStatus) {
    const statuses = ['To Be Announced', 'Upcoming', 'Ongoing', 'Completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
}

// Update statistics
function updateStats() {
    const total = allEvents.length;
    const upcoming = allEvents.filter(e => e.status === 'Upcoming').length;
    const ongoing = allEvents.filter(e => e.status === 'Ongoing').length;
    const completed = allEvents.filter(e => e.status === 'Completed').length;

    document.getElementById('totalEvents').textContent = total;
    document.getElementById('upcomingEvents').textContent = upcoming;
    document.getElementById('ongoingEvents').textContent = ongoing;
    document.getElementById('completedEvents').textContent = completed;
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('eventifyEvents', JSON.stringify(allEvents));
}

// Load events from localStorage
function loadEvents() {
    const saved = localStorage.getItem('eventifyEvents');
    if (saved) {
        allEvents = JSON.parse(saved);
    } else {
        // Add sample events for demo
        allEvents = [
            {
                id: 1,
                name: 'Tech Talk: AI & Machine Learning',
                date: '2025-11-15',
                time: '14:00',
                location: 'Main Auditorium',
                description: 'Learn about the latest trends in AI and ML',
                capacity: 150,
                status: 'Upcoming',
                registrations: 45,
                createdAt: '2025-11-11'
            },
            {
                id: 2,
                name: 'Hackathon 2025',
                date: '2025-11-20',
                time: '10:00',
                location: 'Lab Complex',
                description: '24-hour coding competition',
                capacity: 200,
                status: 'To Be Announced',
                registrations: 78,
                createdAt: '2025-11-11'
            },
            {
                id: 3,
                name: 'Web Development Workshop',
                date: '2025-11-12',
                time: '16:00',
                location: 'Room 301',
                description: 'Learn React and modern web dev',
                capacity: 50,
                status: 'Ongoing',
                registrations: 48,
                createdAt: '2025-11-11'
            }
        ];
        saveEvents();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
