// Base API configuration
const API_BASE_URL = "https://tunga-diary-api.onrender.com/api/fullstack";

// DOM Elements
const entryForm = document.getElementById('entry-form');
const entryTitle = document.getElementById('entry-title');
const entryContent = document.getElementById('entry-content');
const saveButton = document.querySelector('.save-button');
const deleteButton = document.getElementById('delete-button');
const statusMessage = document.getElementById('status-message');
const loadingElement = document.getElementById('loading');
const pageTitle = document.getElementById('page-title');
const dateDisplay = document.getElementById('date-display');

// Get entry ID from URL if present
const urlParams = new URLSearchParams(window.location.search);
const entryId = urlParams.get('id');
let isNewEntry = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're editing an existing entry
    if (entryId) {
        isNewEntry = false;
        pageTitle.textContent = 'Edit Entry';
        deleteButton.style.display = 'block';
        fetchEntry();
    } else {
        // For new entries, show the form immediately
        entryForm.style.display = 'block';
        loadingElement.style.display = 'none';
        showCurrentDate();
    }
    
    // Setup form event listeners
    entryForm.addEventListener('submit', handleFormSubmit);
    deleteButton.addEventListener('click', handleDelete);
});

// Show current date for new entries
function showCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Fetch an existing entry from the API
function fetchEntry() {
    const token = localStorage.getItem('token');
    if (!token) {
        redirectToLogin();
        return;
    }
    
    axios.get(API_BASE_URL + '/diary/' + entryId, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) {
        // Populate form with entry data
        entryTitle.value = response.data.title;
        entryContent.value = response.data.content;
        
        // Format and display date
        const entryDate = new Date(response.data.date);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateDisplay.textContent = entryDate.toLocaleDateString('en-US', options);
        
        // Show the form
        entryForm.style.display = 'block';
        loadingElement.style.display = 'none';
    })
    .catch(function(error) {
        loadingElement.style.display = 'none';
        showMessage('Error loading entry. Please try again.', 'error');
        console.error('Error fetching entry:', error);
    });
}

// Handle form submission for both create and update
function handleFormSubmit(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        redirectToLogin();
        return;
    }
    
    // Prepare entry data
    const entryData = {
        title: entryTitle.value,
        content: entryContent.value
    };
    
    // Show loading state
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;
    
    if (isNewEntry) {
        // Create a new entry
        createEntry(entryData, token);
    } else {
        // Update existing entry
        updateEntry(entryData, token);
    }
}

// Create a new diary entry
function createEntry(entryData, token) {
    axios.post(API_BASE_URL + '/diary', entryData, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) {
        showMessage('Entry created successfully! Redirecting to dashboard...', 'success');
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 1500);
    })
    .catch(function(error) {
        handleApiError(error, 'creating');
        saveButton.textContent = 'Save Entry';
        saveButton.disabled = false;
    });
}

// Update an existing diary entry
function updateEntry(entryData, token) {
    axios.put(API_BASE_URL + '/diary/' + entryId, entryData, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) {
        showMessage('Entry updated successfully!', 'success');
        saveButton.textContent = 'Save Entry';
        saveButton.disabled = false;
    })
    .catch(function(error) {
        handleApiError(error, 'updating');
        saveButton.textContent = 'Save Entry';
        saveButton.disabled = false;
    });
}

// Handle entry deletion
function handleDelete() {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        redirectToLogin();
        return;
    }
    
    deleteButton.textContent = 'Deleting...';
    deleteButton.disabled = true;
    
    axios.delete(API_BASE_URL + '/diary/' + entryId, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) {
        showMessage('Entry deleted successfully! Redirecting to dashboard...', 'success');
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 1500);
    })
    .catch(function(error) {
        showMessage('Error deleting entry. Please try again.', 'error');
        deleteButton.textContent = 'Delete Entry';
        deleteButton.disabled = false;
        console.error('Delete error:', error);
    });
}

// Show status message
function showMessage(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = 'status-message ' + type;
}

// Handle API errors
function handleApiError(error, action) {
    let errorMessage = 'Error ' + action + ' entry.';
    
    if (error.response) {
        if (error.response.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            setTimeout(redirectToLogin, 2000);
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
    } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
    }
    
    showMessage(errorMessage, 'error');
}

// Redirect to login page
function redirectToLogin() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}