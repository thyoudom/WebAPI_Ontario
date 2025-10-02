document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxF56vp0kSWscaOJ6kjkB7yUW3waqSZhb9lPFairDYlMfhIh3jadH7wPtrVudjp7ngk/exec'; // Placeholder


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
    if(loginForm){
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
                window.location.href = './login.html'; // Ensure Home.html is in the same directory
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
    }
    
});
const userEmailDisplay = document.getElementById('userEmailDisplay');
const textuserlogout="Loading user info...";
$(document).ready(function () {
   
    onloadUser();
});
document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('sidebar');
    const navbarUsertop = document.getElementById('navbarUsertop');
    const footer = document.getElementById('footer');
    cardContainer.innerHTML = `
     <nav class="main-nav">
    <ul>
        <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
        <li class="nav-item has-dropdown">
            <a href="#" class="nav-link dropdown-toggle">Products</a>
            <ul class="dropdown-menu">
                <li class="nav-item"><a href="#product1" class="nav-link">Product One</a></li>
                <li class="nav-item"><a href="#product2" class="nav-link">Product Two</a></li>
                <li class="nav-item"><a href="#product3" class="nav-link">Product Three</a></li>
            </ul>
        </li>
        <li class="nav-item has-dropdown">
            <a href="#" class="nav-link dropdown-toggle">Services</a>
            <ul class="dropdown-menu">
                <li class="nav-item"><a href="#servicea" class="nav-link">Service A</a></li>
                <li class="nav-item"><a href="#serviceb" class="nav-link">Service B</a></li>
            </ul>
        </li>
        <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
    </ul>
</nav>
    <div class="sidebar-header">
            <h3><img src="img/Logo_School.png" class="img-fluid" /><span>ontario</span></h3>
        </div>
        <ul class="list-unstyled component m-0">
            <!-- <li class="active">
                <a href="#" class="dashboard"><i class="material-icons">dashboard</i>Home </a>
            </li> -->
            <li class="dropdown">
                <a href="#homeSubmenu1" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <i class="material-icons">dashboard</i>Home
                </a>
                <ul class="collapse list-unstyled menu" id="homeSubmenu1">
                    <li><a href="#">⚪VISION/MISSION</a></li>
                    <li><a href="#">⚪ORGANIZATIONAL CHART</a></li>
                    <li><a href="#">⚪WELCOME MESSAGES</a></li>
                    <li><a href="#">⚪LICENCES & PARTNERS</a></li>
                    <li><a href="#">⚪PARENT TESTIMONIAL</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="#homeSubmenu1" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <i class="material-icons">aspect_ratio</i>About US
                </a>
                <ul class="collapse list-unstyled menu" id="homeSubmenu1">
                    <li><a href="#">⚪VISION/MISSION</a></li>
                    <li><a href="#">⚪ORGANIZATIONAL CHART</a></li>
                    <li><a href="#">⚪WELCOME MESSAGES</a></li>
                    <li><a href="#">⚪LICENCES & PARTNERS</a></li>
                    <li><a href="#">⚪PARENT TESTIMONIAL</a></li>
                </ul>
            </li>


            <li class="dropdown">
                <a href="#homeSubmenu2" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <i class="material-icons">apps</i>CURRICULUM
                </a>
                <ul class="collapse list-unstyled menu" id="homeSubmenu2">
                    <li><a href="#">⚪CURRICULUM OVERVIEW</a></li>
                    <li><a href="#">⚪INFANT CLASS</a></li>
                    <li><a href="#">⚪TODDLER CLASS</a></li>
                    <li><a href="#">⚪KINDERGARTEN</a></li>
                    <li><a href="#">⚪PRIMARY SCHOOL</a></li>
                    <li><a href="#">⚪ACADEMIC CALENDAR</a></li>
                </ul>
            </li>

            <li class="dropdown">
                <a href="#homeSubmenu3" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <i class="material-icons">equalizer</i>EVENTS
                </a>
                <ul class="collapse list-unstyled menu" id="homeSubmenu3">
                    <li><a href="#">⚪NEWS & EVENTS</a></li>
                    <li><a href="#">⚪NEWSLETTERS</a></li>
                    <li><a href="#">⚪CAREERS</a></li>
                </ul>
            </li>


            <li class="dropdown">
                <a href="#homeSubmenu4" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <i class="material-icons">extension</i>GALLERY
                </a>
                <ul class="collapse list-unstyled menu" id="homeSubmenu4">
                    <li><a href="#">⚪STUDENT ACTIVITIES</a></li>
                    <li><a href="#">⚪PARENTING TIPS</a></li>
                    <li><a href="#">⚪RESEARCH ARTICLES</a></li>
                </ul>
            </li>
            <li class="">
                <a href="home.html" class="nav-active"><i class="material-icons">date_range</i>TUITION FEE </a>
            </li>
            <li class="nav-activeitem">
                <a href="contact.html" class="nav-active"><i class="material-icons">library_books</i>CONTACT </a>
            </li>

        </ul>
       

    `;
    navbarUsertop.innerHTML = `
    <div class="xd-topbar">
        <div class="row">
            <div class="col-2 col-md-1 col-lg-1 order-2 order-md-1 align-self-center">
                <div class="xp-menubar" id="xp-menubar">
                    <span class="material-icons text-white">signal_cellular_alt</span>
                </div>
            </div>

            <div class="col-md-5 col-lg-3 order-3 order-md-2">
                <div class="xp-searchbar">
                    <form>
                        <div class="input-group">
                            <input type="search" class="form-control" placeholder="Search">
                            <div class="input-group-append">
                                <button class="btn" type="submit" id="button-addon2">Go
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            <div class="col-10 col-md-6 col-lg-8 order-1 order-md-3" id="Userlogo">
                <div class="xp-profilebar text-right">
                    <nav class="navbar p-0">
                        <ul class="nav navbar-nav flex-row ml-auto">
                            <li class="dropdown nav-item">
                                <a class="nav-link" href="#" data-toggle="dropdown">
                                    <img src="img/Userlogo.png" style="width:40px; border-radius:50%;" />
                                    <span class="xp-user-live"></span>
                                </a>
                                <ul class="dropdown-menu small-menu">
                                    <li><a href="#">
                                            <p class="user-email text-muted" id="userEmailDisplay"><span class="material-icons">settings</span> Loading user info...</p>
                                        </a></li>
                                    <li><a href="#">
                                            <span class="material-icons">settings</span>
                                            Settings
                                        </a></li>
                                    <li id="logoutBtn"><a href="">
                                            <span class="material-icons" >logout</span>
                                            Logout
                                        </a></li>

                                </ul>
                            </li>


                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    </div>
    `;
    footer.innerHTML = `
        <div class="container-fluid">
            <div class="footer-in">
                <p class="mb-0">&copy 2025 Ontario . All Rights Reserved.</p>
            </div>
        </div>
    `;


});

function onloadUser() {
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const textLog = document.getElementById('getuserEmailDisplay');

    // Retrieve the email from sessionStorage
    const loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');

    if (loggedInUserEmail) { 
        userEmailDisplay.textContent =' '+ loggedInUserEmail;
        textLog.textContent= '' + loggedInUserEmail;
    } else {
        // If no email is found, redirect back to the login page
        userEmailDisplay.textContent = 'Loading user info...';
        setTimeout(() => {
            // Changed 'index.html' to './index.html' for more robust relative path resolution
            window.location.href = './login.html'; // Assuming your login page is index.html
        }, 0); // Redirect after 2 seconds
    }
}


$(document).ready(function () {
    $(".xp-menubar").on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
    });

    $(".xp-menubar,.body-overlay").on('click', function () {
        $('#sidebar,.body-overlay').toggleClass('show-nav');
    });

});
function secLogout() {
    sessionStorage.removeItem('loggedInUserEmail');
    // Redirect back to the login page
    // Changed 'index.html' to './index.html' for more robust relative path resolution
    window.location.href = './login.html'; // Assuming your login page is index.html
    console.log(myFunction)
}
document.addEventListener('DOMContentLoaded', function () {
    // Your code that interacts with DOM elements here
    const myElement = document.getElementById('logoutBtn');
    if (myElement) { // Always check if the element exists
        myElement.addEventListener('click', secLogout);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const dropdownToggles = document.querySelectorAll('.main-nav .dropdown-toggle');

    // --- Dropdown Toggle Functionality ---
    dropdownToggles.forEach(toggle => {
        const parentNavItem = toggle.closest('.has-dropdown');
        if (parentNavItem) {
            // Option 1: Click to toggle dropdown
            toggle.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                // Close other open dropdowns
                document.querySelectorAll('.has-dropdown.show-dropdown').forEach(openDropdown => {
                    if (openDropdown !== parentNavItem) {
                        openDropdown.classList.remove('show-dropdown');
                    }
                });
                parentNavItem.classList.toggle('show-dropdown');
            });

            // Option 2: Hover to toggle dropdown (if preferred)
            // parentNavItem.addEventListener('mouseenter', function() {
            //     this.classList.add('show-dropdown');
            // });
            // parentNavItem.addEventListener('mouseleave', function() {
            //     this.classList.remove('show-dropdown');
            // });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav')) {
            document.querySelectorAll('.has-dropdown.show-dropdown').forEach(openDropdown => {
                openDropdown.classList.remove('show-dropdown');
            });
        }
    });


    // --- Active Class Management ---
    // Function to remove all active classes
    function removeAllActiveClasses() {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.main-nav .nav-item').forEach(item => {
            item.classList.remove('active', 'parent-active');
        });
    }

    // Function to set active class based on URL (for page load)
    function setActiveLinkOnLoad() {
        const currentHash = window.location.hash; // For single-page app (SPA) sections
        // Or for multi-page apps: const currentPath = window.location.pathname;

        if (currentHash) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentHash) {
                    removeAllActiveClasses(); // Clear previous active states
                    link.classList.add('active'); // Activate the link

                    const parentLi = link.closest('.nav-item');
                    if (parentLi) {
                        parentLi.classList.add('active'); // Activate the direct parent LI

                        // If it's inside a dropdown, activate the top-level dropdown parent
                        const topLevelDropdownParent = parentLi.closest('.has-dropdown');
                        if (topLevelDropdownParent) {
                            topLevelDropdownParent.classList.add('parent-active');
                            topLevelDropdownParent.classList.add('active'); // Also mark the top-level li as active
                            topLevelDropdownParent.classList.add('show-dropdown'); // Optionally keep dropdown open
                        }
                    }
                }
            });
        } else {
            // Handle case for default/home page if no hash is present
            // e.g., if href="#home" is your default
            const homeLink = document.querySelector('.main-nav a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                homeLink.closest('.nav-item').classList.add('active');
            }
        }
    }

    // Call on page load
    setActiveLinkOnLoad();

    // Add click listener to all nav links for dynamic active state changes
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a dropdown toggle (href="#"), prevent default link behavior
            if (this.classList.contains('dropdown-toggle')) {
                // The dropdown toggle logic above handles this
                return;
            }

            // For regular links or sub-menu links
            removeAllActiveClasses(); // Clear previous active states
            this.classList.add('active'); // Activate the clicked link

            const parentLi = this.closest('.nav-item');
            if (parentLi) {
                parentLi.classList.add('active'); // Activate the direct parent LI

                // If it's inside a dropdown, activate the top-level dropdown parent
                const topLevelDropdownParent = parentLi.closest('.has-dropdown');
                if (topLevelDropdownParent) {
                    topLevelDropdownParent.classList.add('parent-active');
                    topLevelDropdownParent.classList.add('active'); // Also mark the top-level li as active
                }
            }
        });
    });
});