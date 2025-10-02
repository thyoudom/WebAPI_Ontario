

document.addEventListener("DOMContentLoaded", function () {
    const navbarTop = document.getElementById('navbarTop');
    const sidebarMenu = document.getElementById('sidebarMenu');
    // const allLinks = document.querySelectorAll('.sidebar .nav-link');
    // const pagesCollapseEl = document.getElementById('pages-collapse');
    // const pagesCollapseInstance = pagesCollapseEl ? new bootstrap.Collapse(pagesCollapseEl, { toggle: false }) : null;

    navbarTop.innerHTML = `
        <div class="container-fluid">
        
            <!-- Sidebar toggle button for smaller screens -->
            <button class="btn btn-toggle-sidebar d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi bi-list"></i>
            </button>
            <a class="navbar-brand me-auto" href="#">
                <i class="bi bi-speedometer2 me-2"></i>Admin Panel
            </a>

            <!-- Profile dropdown on the right for large screens -->
            
            <div class="d-none d-lg-flex">
                <div class="dropdown">
                    <button 
                        class="profile-dropdown-toggle dropdown-toggle d-flex align-items-center" 
                        type="button" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <i class="bi bi-person-circle fs-4 me-2"></i>
                        <span class="d-none d-md-inline user-email" id="userEmailDisplay">Loading user info...</span> 
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-profile">
                        
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item" href="/edit-profile">
                                <i class="bi bi-person-vcard me-2"></i> Edit Profile
                            </a>
                        </li>
                        
                        <li>
                            <a class="dropdown-item" href="/change-password">
                                <i class="bi bi-key me-2"></i> Change Password
                            </a>
                        </li>
                        
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item text-danger" href="" id="logoutBtn">
                                <i class="bi bi-box-arrow-right me-2"></i> Log Out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
           
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050;"></div>
            <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="languageDropdown">
                <i class="flag-icon flag-icon-us"></i> English
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
               
                <li>
                    <a class="dropdown-item" href="#" data-lang-code="en" data-lang-name="English" onclick="translatePage(this);">
                        <i class="flag-icon flag-icon-us"></i> English
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-lang-code="km" data-lang-name="Khmer" onclick="translatePage(this);">
                        <i class="flag-icon flag-icon-kh"></i> Khmer
                    </a>
                </li>
                 
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="#" onclick="clearTranslation();">
                        <i class="flag-icon">❌</i> Clear Translation
                    </a>
                </li>
            </ul>
        </div>
        </div>
      
    `;
});
function googleTranslateElementInit() {
    // Initialize the Google Translate widget (it remains hidden)
    new google.translate.TranslateElement({
        pageLanguage: 'en', // Set the original language of your page
        includedLanguages: 'es,km,en', // Languages you offer
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false // Important: Prevents the default widget from showing up
    }, 'google_translate_element');
}
const ORIGINAL_LANGUAGE_CODE = 'en';
const google_translate_element=val('en')

/**
 * Triggers the Google Translate function using URL fragments.
 * @param {HTMLElement} element - The clicked dropdown item (<a> tag).
 */
function translatePage(element) {
    const langCode = element.getAttribute('data-lang-code');
    const langName = element.getAttribute('data-lang-name');

    // 1. Update the dropdown button text/flag
    const dropdownButton = document.getElementById('languageDropdown');
    const flagIcon = element.querySelector('.flag-icon');

    // Clone the flag icon and update button content
    if (flagIcon) {
        const newFlag = flagIcon.cloneNode(true);
        dropdownButton.innerHTML = '';
        dropdownButton.appendChild(newFlag);
        dropdownButton.appendChild(document.createTextNode(' ' + langName));
    } else {
        // Fallback if flag icons are not used/available
        dropdownButton.innerHTML = langName;
    }

    // 2. Set the translation URL fragment and reload
    // Format: #googtrans(source|target)
    window.location.hash = `#googtrans(${ORIGINAL_LANGUAGE_CODE}|${langCode})`;
    location.reload(); // Reloads the page with the translation hash
}

/**
 * Clears the translation by removing the URL fragment and reloading.
 */
function clearTranslation() {
    const currentHash = window.location.hash;

    // Only reload if a translation hash exists
    if (currentHash.includes('#googtrans')) {
        // Clear the hash and reload
        window.location.hash = '';
        location.reload();
    }

    // Reset dropdown button to original language
    const dropdownButton = document.getElementById('languageDropdown');
    dropdownButton.innerHTML = '<i class="flag-icon flag-icon-us"></i> English'; // Assuming US/English as original
}

// **Optional: Check on load to set the dropdown to the currently translated language**
window.addEventListener('load', function () {
    const hash = window.location.hash;
    if (hash.includes('#googtrans')) {
        const parts = hash.match(/\(([^|]+)\|([^)]+)\)/);
        if (parts && parts.length === 3) {
            const targetLangCode = parts[2];

            // Find the matching dropdown item and update the button
            const targetItem = document.querySelector(`[data-lang-code="${targetLangCode}"]`);
            if (targetItem) {
                const langName = targetItem.getAttribute('data-lang-name');
                const flagIcon = targetItem.querySelector('.flag-icon');
                const dropdownButton = document.getElementById('languageDropdown');

                if (flagIcon) {
                    const newFlag = flagIcon.cloneNode(true);
                    dropdownButton.innerHTML = '';
                    dropdownButton.appendChild(newFlag);
                    dropdownButton.appendChild(document.createTextNode(' ' + langName));
                } else {
                    dropdownButton.innerHTML = langName;
                }
            }
        }
    }
});