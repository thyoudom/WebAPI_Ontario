const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxF56vp0kSWscaOJ6kjkB7yUW3waqSZhb9lPFairDYlMfhIh3jadH7wPtrVudjp7ngk/exec'; // Placeholder
// const GOOGLE_APPS_SCRIPT_URL = 'https://api.ontario.edu.kh/login.php'; // Placeholder
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const ImagesInput = document.getElementById('Images');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');


// Function to display messages to the user
function showMessage(text, type) {
    messageDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
    messageDiv.classList.add(`alert-${type}`);
    messageDiv.textContent = text;
}

// Function to hide messages
function hideMessage() {
    messageDiv.classList.add('d-none');
}

// Function to toggle loading state of the button
function toggleLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        buttonText.textContent = 'Logging in...';
        loadingSpinner.classList.remove('d-none');
    } else {
        submitBtn.disabled = false;
        buttonText.textContent = 'Login';
        loadingSpinner.classList.add('d-none');
    }
}

// Event listener for form submission
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    hideMessage(); // Hide any previous messages
    toggleLoading(true); // Show loading spinner

    const email = emailInput.value;
    const password = passwordInput.value;

    // Prepare data to send to Google Apps Script
    const formData = new FormData();
    formData.append('action', 'login'); // Action to tell the script what to do
    formData.append('email', email);
    formData.append('password', password);

    try {
        // Send data using fetch API
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: formData, // Use FormData for POST requests to Apps Script
            // No 'Content-Type' header needed when using FormData, fetch sets it automatically
        });

        if (!response.ok) {
            // Log the response status and text for more detailed error information
            console.error('HTTP Error Response:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error Response Body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Parse the JSON response from Apps Script

        if (result.success) {
            showMessage('Login successful! Redirecting...', 'success');
            // Store the logged-in user's email in sessionStorage
            sessionStorage.setItem('loggedInUserEmail', email);
            // Redirect to the Home page
            
            window.location.href = './index.html'; // Ensure Home.html is in the same directory
        } else {
            showMessage(`Login failed: ${result.message || 'Invalid credentials.'}`, 'danger');
        }
    } catch (error) {
        console.error('Error during login:', error);
        showMessage('An error occurred during login. Please try again later.', 'danger');
    } finally {
        toggleLoading(false); // Hide loading spinner
    }
});