

document.addEventListener("DOMContentLoaded", function () {
    const navbarTop = document.getElementById('navbarTop');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const allLinks = document.querySelectorAll('.sidebar .nav-link');
    const pagesCollapseEl = document.getElementById('pages-collapse');
    const pagesCollapseInstance = pagesCollapseEl ? new bootstrap.Collapse(pagesCollapseEl, { toggle: false }) : null;

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
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle me-1"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark-red" aria-labelledby="navbarDropdownProfile">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle khmer-regular" id="userEmailDisplay" class="user-email ">Loading user info...</i></a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-key me-2"></i>Change Password</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `;
    // sidebarMenu.innerHTML=`

    // `;

    

});
