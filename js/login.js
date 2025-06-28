const API_BASE_URL = "https://tunga-diary-api.onrender.com/api/fullstack";

const loginForm = document.getElementById("login-form");

if(loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        // Get user input values
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validate inputs
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            // Send login request to API
            const response = await axios.post(
                `${API_BASE_URL}/auth/login`, 
                {
                    email: email,
                    password: password
                }
            );

            // Handle successful response
            const token = response.data.token;
            localStorage.setItem('token', token);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            // Handle errors
            if (error.response) {
                // Server responded with error status (4xx/5xx)
                alert(`Login failed: ${error.response.data.message || 'Invalid credentials'}`);
            } else if (error.request) {
                // Request was made but no response received
                alert('Network error. Please check your connection.');
            } else {
                // Other setup errors
                alert('Login error: ' + error.message);
            }
        }
    });
}