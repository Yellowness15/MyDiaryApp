document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  fetchEntries();
});

function fetchEntries() {
  // Get JWT token from localStorage
  const token = localStorage.getItem('token');
  
  // Make API request to get entries
  axios.get('https://tunga-diary-api.onrender.com/api/fullstack/entries', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(function(response) {
    // Handle successful response
    displayEntries(response.data);
  })
  .catch(function(error) {
    // Handle errors
    console.error('Error fetching entries:', error);
    
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please login again.');
      logout();
    } else {
      alert('Failed to load entries. Please try again later.');
    }
  });
}

function displayEntries(entries) {
  //  Get container element
  const container = document.getElementById('entries-list');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Check if there are entries
  if (!entries || entries.length === 0) {
    container.innerHTML = '<p class="no-entries">No entries found. Start writing!</p>';
    return;
  }
  
  // Create and append entry cards
  entries.forEach(function(entry) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    
    // Format date 
    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Build card content
    card.innerHTML = `
      <h3>${entry.title || 'Untitled Entry'}</h3>
      <small>${formattedDate}</small>
    `;
    
    // Add click event to view entry details
    card.addEventListener('click', function() {
      window.location.href = `entry.html?id=${entry._id}`;
    });
    
    container.appendChild(card);
  });
}

function logout() {
  // Remove authentication token
  localStorage.removeItem('token');
  
  // Redirect to login page
  window.location.href = 'login.html';
}