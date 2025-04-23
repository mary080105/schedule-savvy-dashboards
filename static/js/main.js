
// Global variables
let currentSchedule = null;

// Helper functions
function formatTime(timeString) {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function formatHour(hour) {
    if (hour === null || hour === undefined) return 'N/A';
    return hour < 12 ? `${hour} AM` : (hour === 12 ? '12 PM' : `${hour - 12} PM`);
}

async function fetchSchedules() {
    try {
        const response = await fetch('/api/schedules');
        const schedules = await response.json();
        
        const selectElement = document.getElementById('schedule-select');
        if (!selectElement) return;
        
        // Clear existing options
        selectElement.innerHTML = '';
        
        // Add options
        schedules.forEach(schedule => {
            const option = document.createElement('option');
            option.value = schedule;
            option.textContent = schedule;
            selectElement.appendChild(option);
        });
        
        // Add selected option if current schedule exists
        if (currentSchedule) {
            selectElement.value = currentSchedule;
        } else if (schedules.length > 0) {
            // Set the first schedule as default
            currentSchedule = schedules[0];
            selectElement.value = currentSchedule;
        }
        
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

async function createNewSchedule() {
    const nameInput = document.getElementById('new-schedule-name');
    const name = nameInput.value.trim();
    
    if (!name) {
        showToast('Please enter a schedule name', 'error');
        return;
    }
    
    try {
        // Initialize by getting events (which will create an empty schedule if it doesn't exist)
        await fetch(`/api/events/${name}`);
        currentSchedule = name;
        
        // Update UI
        await fetchSchedules();
        nameInput.value = '';
        
        // If on dashboard, reload page with new schedule
        if (window.location.pathname.includes('/dashboard/')) {
            window.location.href = `/dashboard/${name}`;
        } else {
            showToast(`Schedule '${name}' created`, 'success');
        }
    } catch (error) {
        console.error('Error creating schedule:', error);
        showToast('Failed to create schedule', 'error');
    }
}

async function fetchEvents(scheduleName) {
    try {
        const response = await fetch(`/api/events/${scheduleName}`);
        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

async function fetchOptimizedEvents(scheduleName) {
    try {
        const response = await fetch(`/api/optimized/${scheduleName}`);
        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error fetching optimized events:', error);
        return [];
    }
}

async function fetchAnalytics(scheduleName) {
    try {
        const response = await fetch(`/api/analytics/${scheduleName}`);
        const analytics = await response.json();
        
        // Update analytics on the page
        document.getElementById('total-events').textContent = analytics.total_events;
        document.getElementById('avg-duration').textContent = `${analytics.avg_duration_minutes} mins`;
        document.getElementById('peak-hour').textContent = formatHour(analytics.peak_start_hour);
        document.getElementById('optimized-events').textContent = analytics.optimized_events;
        
        return analytics;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

async function fetchVisualizations(scheduleName) {
    try {
        const response = await fetch(`/api/visualizations/${scheduleName}`);
        const visualizations = await response.json();
        
        // Update visualization images
        if (visualizations.duration_histogram) {
            document.getElementById('duration-histogram').src = `data:image/png;base64,${visualizations.duration_histogram}`;
        }
        
        if (visualizations.start_time_barchart) {
            document.getElementById('start-time-barchart').src = `data:image/png;base64,${visualizations.start_time_barchart}`;
        }
        
        if (visualizations.name_piechart) {
            document.getElementById('name-piechart').src = `data:image/png;base64,${visualizations.name_piechart}`;
        }
        
        return visualizations;
    } catch (error) {
        console.error('Error fetching visualizations:', error);
        return null;
    }
}

function renderEvents(events, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    if (events.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No events found</p>';
        return;
    }
    
    // Create event list
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow';
        eventCard.innerHTML = `
            <h3 class="font-semibold text-gray-800 text-lg">${event.name}</h3>
            <div class="flex flex-col sm:flex-row sm:justify-between mt-2 text-sm">
                <div class="text-gray-600">
                    <span class="inline-flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${formatTime(event.start_time)}</span>
                </div>
                <div class="text-gray-600 mt-1 sm:mt-0">
                    <span class="inline-flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${formatTime(event.end_time)}</span>
                </div>
            </div>
        `;
        container.appendChild(eventCard);
    });
}

async function addEvent(event) {
    event.preventDefault();
    
    if (!currentSchedule) {
        showToast('Please select or create a schedule first', 'error');
        return;
    }
    
    const nameInput = document.getElementById('event-name');
    const startTimeInput = document.getElementById('event-start');
    const endTimeInput = document.getElementById('event-end');
    
    const name = nameInput.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (!name || !startTime || !endTime) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    const eventData = {
        name,
        start_time: startTime,
        end_time: endTime
    };
    
    try {
        const response = await fetch(`/api/events/${currentSchedule}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            // Reset form
            nameInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
            
            // Update UI
            await updateDashboard();
            showToast('Event added successfully', 'success');
        } else {
            const errorData = await response.json();
            showToast(errorData.error || 'Failed to add event', 'error');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        showToast('Failed to add event', 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const icon = document.getElementById('toast-icon');
    const messageEl = document.getElementById('toast-message');
    
    // Set icon and color based on type
    if (type === 'success') {
        icon.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
        toast.className = 'fixed top-4 right-4 flex items-center p-4 mb-4 bg-green-100 text-green-800 rounded-lg shadow';
    } else if (type === 'error') {
        icon.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
        toast.className = 'fixed top-4 right-4 flex items-center p-4 mb-4 bg-red-100 text-red-800 rounded-lg shadow';
    } else {
        icon.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
        toast.className = 'fixed top-4 right-4 flex items-center p-4 mb-4 bg-blue-100 text-blue-800 rounded-lg shadow';
    }
    
    messageEl.textContent = message;
    toast.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

async function goToDashboard() {
    const selectElement = document.getElementById('schedule-select');
    if (!selectElement) return;
    
    const schedule = selectElement.value;
    if (!schedule) {
        showToast('Please select or create a schedule first', 'error');
        return;
    }
    
    window.location.href = `/dashboard/${schedule}`;
}

async function updateDashboard() {
    if (!currentSchedule) return;
    
    // Update all data
    await Promise.all([
        fetchEvents(currentSchedule).then(events => renderEvents(events, 'events-list')),
        fetchOptimizedEvents(currentSchedule).then(events => renderEvents(events, 'optimized-events')),
        fetchAnalytics(currentSchedule),
        fetchVisualizations(currentSchedule)
    ]);
}

async function changeSchedule() {
    const selectElement = document.getElementById('schedule-select');
    if (!selectElement) return;
    
    const selectedSchedule = selectElement.value;
    if (!selectedSchedule) return;
    
    currentSchedule = selectedSchedule;
    
    // If on dashboard, reload page with new schedule
    if (window.location.pathname.includes('/dashboard/')) {
        window.location.href = `/dashboard/${selectedSchedule}`;
    }
}

// Initialize page based on URL
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize toast
    const toastCloseButton = document.getElementById('toast-close-button');
    if (toastCloseButton) {
        toastCloseButton.addEventListener('click', () => {
            const toast = document.getElementById('toast');
            toast.classList.add('hidden');
        });
    }
    
    // Check if we're on dashboard
    const path = window.location.pathname;
    if (path.includes('/dashboard/')) {
        currentSchedule = path.split('/dashboard/')[1];
        
        // Set up form submission
        const eventForm = document.getElementById('event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', addEvent);
        }
        
        // Set up schedule selector
        const scheduleSelect = document.getElementById('schedule-select');
        if (scheduleSelect) {
            scheduleSelect.addEventListener('change', changeSchedule);
        }
        
        // Update dashboard
        await fetchSchedules();
        await updateDashboard();
    } else {
        // On index page
        await fetchSchedules();
        
        // Set up event handlers
        const createScheduleBtn = document.getElementById('create-schedule');
        if (createScheduleBtn) {
            createScheduleBtn.addEventListener('click', createNewSchedule);
        }
        
        const goToDashboardBtn = document.getElementById('go-to-dashboard');
        if (goToDashboardBtn) {
            goToDashboardBtn.addEventListener('click', goToDashboard);
        }
        
        const scheduleSelect = document.getElementById('schedule-select');
        if (scheduleSelect) {
            scheduleSelect.addEventListener('change', changeSchedule);
        }
    }
    
    // Set up links
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';
        });
    }
});

// Refresh data every minute
setInterval(() => {
    if (window.location.pathname.includes('/dashboard/') && currentSchedule) {
        updateDashboard();
    }
}, 60000);
