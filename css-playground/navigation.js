// js/components/navigation.js - Navigation Component

const Navigation = {
    // Navigation state
    isCollapsed: false,
    activeItem: null,
    
    // Navigation structure
    navigationItems: [
        {
            id: 'home',
            title: 'Home',
            icon: 'bi-house-fill',
            href: '#home',
            active: true
        },
        {
            id: 'playground',
            title: 'Playground',
            icon: 'bi-palette-fill',
            href: '#playground',
            dropdown: [
                { id: 'layout', title: 'Layout', icon: 'bi-grid-3x3-gap' },
                { id: 'typography', title: 'Typography', icon: 'bi-type' },
                { id: 'colors', title: 'Colors', icon: 'bi-palette' },
                { id: 'effects', title: 'Effects', icon: 'bi-magic' },
                { id: 'animations', title: 'Animations', icon: 'bi-play-circle' }
            ]
        },
        {
            id: 'learning',
            title: 'Learning',
            icon: 'bi-mortarboard-fill',
            href: '#learning',
            badge: { text: 'New', variant: 'success' }
        },
        {
            id: 'tools',
            title: 'Tools',
            icon: 'bi-tools',
            href: '#tools',
            dropdown: [
                { id: 'export', title: 'Export CSS', icon: 'bi-download' },
                { id: 'import', title: 'Import', icon: 'bi-upload' },
                { id: 'presets', title: 'Presets', icon: 'bi-bookmark' },
                { id: 'inspector', title: 'Inspector', icon: 'bi-search' }
            ]
        }
    ],
    
    // Initialize navigation
    init() {
        console.log('🧭 Initializing Navigation...');
        
        // Render navigation
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up responsive behavior
        this.setupResponsive();
        
        // Set up keyboard navigation
        this.setupKeyboardNavigation();
        
        console.log('✅ Navigation initialized');
        return this;
    },
    
    // Render navigation HTML
    render() {
        const navbar = document.getElementById('main-navbar');
        if (!navbar) return;
        
        navbar.innerHTML = `
            <div class="container-fluid">
                <!-- Brand -->
                <a class="navbar-brand d-flex align-items-center" href="#home">
                    <div class="brand-icon me-2">
                        <i class="bi bi-palette-fill"></i>
                    </div>
                    <span class="brand-text">CSS Playground</span>
                </a>
                
                <!-- Mobile toggle -->
                <button class="navbar-toggler" type="button" id="navbar-toggler" 
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <!-- Navigation items -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        ${this.renderNavigationItems()}
                    </ul>
                    
                    <!-- Right side items -->
                    <div class="navbar-nav ms-auto d-flex align-items-center">
                        ${this.renderRightSideItems()}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render navigation items
    renderNavigationItems() {
        return this.navigationItems.map(item => {
            if (item.dropdown) {
                return this.renderDropdownItem(item);
            } else {
                return this.renderNavItem(item);
            }
        }).join('');
    },
    
    // Render single navigation item
    renderNavItem(item) {
        const activeClass = item.active ? 'active' : '';
        const badge = item.badge ? `<span class="badge bg-${item.badge.variant} ms-1">${item.badge.text}</span>` : '';
        
        return `
            <li class="nav-item">
                <a class="nav-link ${activeClass}" href="${item.href}" data-nav-id="${item.id}">
                    <i class="${item.icon} me-1"></i>
                    ${item.title}
                    ${badge}
                </a>
            </li>
        `;
    },
    
    // Render dropdown navigation item
    renderDropdownItem(item) {
        const activeClass = item.active ? 'active' : '';
        const dropdownItems = item.dropdown.map(subItem => `
            <li>
                <a class="dropdown-item" href="#${subItem.id}" data-nav-id="${subItem.id}">
                    <i class="${subItem.icon} me-2"></i>
                    ${subItem.title}
                </a>
            </li>
        `).join('');
        
        return `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle ${activeClass}" href="#" id="${item.id}Dropdown" 
                   role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="${item.icon} me-1"></i>
                    ${item.title}
                </a>
                <ul class="dropdown-menu" aria-labelledby="${item.id}Dropdown">
                    ${dropdownItems}
                </ul>
            </li>
        `;
    },
    
    // Render right side items
    renderRightSideItems() {
        return `
            <!-- Search -->
            <div class="search-container me-3">
                <div class="input-group input-group-sm">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search properties..." 
                           id="nav-search" aria-label="Search">
                </div>
            </div>
            
            <!-- Theme toggle -->
            <button class="btn btn-outline-light btn-sm me-2" id="theme-toggle" 
                    data-theme-toggle title="Toggle theme">
                <i class="bi bi-moon-fill"></i>
            </button>
            
            <!-- Settings -->
            <div class="dropdown">
                <button class="btn btn-outline-light btn-sm" type="button" 
                        id="settingsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-gear-fill"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
                    <li><h6 class="dropdown-header">Settings</h6></li>
                    <li>
                        <a class="dropdown-item" href="#" data-action="toggle-measurements">
                            <i class="bi bi-rulers me-2"></i>
                            Toggle Measurements
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" data-action="toggle-guides">
                            <i class="bi bi-grid me-2"></i>
                            Toggle Guides
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" data-action="keyboard-shortcuts">
                            <i class="bi bi-keyboard me-2"></i>
                            Keyboard Shortcuts
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <a class="dropdown-item" href="#" data-action="reset-all">
                            <i class="bi bi-arrow-clockwise me-2"></i>
                            Reset All
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" data-action="export-settings">
                            <i class="bi bi-download me-2"></i>
                            Export Settings
                        </a>
                    </li>
                </ul>
            </div>
        `;
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Mobile toggle
        const toggler = document.getElementById('navbar-toggler');
        if (toggler) {
            toggler.addEventListener('click', () => this.toggleMobileNav());
        }
        
        // Navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav-id]')) {
                e.preventDefault();
                const navId = e.target.dataset.navId;
                this.setActiveItem(navId);
                this.handleNavigation(navId);
            }
        });
        
        // Settings actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                e.preventDefault();
                const action = e.target.dataset.action;
                this.handleSettingsAction(action);
            }
        });
        
        // Search functionality
        const searchInput = document.getElementById('nav-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSearch(e.target.value);
                }
            });
        }
        
        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
    },
    
    // Set up responsive behavior
    setupResponsive() {
        // Watch for window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Check initial state
        this.handleResize();
    },
    
    // Set up keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape to close dropdowns
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
            
            // Arrow keys for navigation
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigatePrevious();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateNext();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.openCurrentDropdown();
                        break;
                }
            }
            
            // Quick access shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '/':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case ',':
                        e.preventDefault();
                        this.openSettings();
                        break;
                }
            }
        });
    },
    
    // Handle navigation click
    handleNavigation(navId) {
        // Emit navigation event
        if (window.EventManager) {
            EventManager.emit('navigation:change', navId);
        }
        
        // Handle specific navigation
        switch (navId) {
            case 'home':
                this.scrollToTop();
                break;
            case 'learning':
                this.showLearningSection();
                break;
            default:
                if (window.AppState) {
                    AppState.setCurrentTab(navId);
                }
                break;
        }
        
        // Close mobile menu if open
        this.closeMobileNav();
    },
    
    // Handle settings actions
    handleSettingsAction(action) {
        switch (action) {
            case 'toggle-measurements':
                this.toggleMeasurements();
                break;
            case 'toggle-guides':
                this.toggleGuides();
                break;
            case 'keyboard-shortcuts':
                this.showKeyboardShortcuts();
                break;
            case 'reset-all':
                this.resetAll();
                break;
            case 'export-settings':
                this.exportSettings();
                break;
        }
    },
    
    // Handle search input
    handleSearch(query) {
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        // Search for CSS properties
        const results = this.searchProperties(query);
        this.showSearchResults(results);
    },
    
    // Execute search
    executeSearch(query) {
        if (query.trim()) {
            // Emit search event
            if (window.EventManager) {
                EventManager.emit('search:execute', query);
            }
            
            // Show search results in main area
            this.showSearchInMainArea(query);
        }
    },
    
    // Search CSS properties
    searchProperties(query) {
        const properties = [
            'display', 'position', 'flex', 'grid', 'float', 'clear',
            'font-family', 'font-size', 'font-weight', 'color', 'text-align',
            'background', 'border', 'padding', 'margin', 'width', 'height',
            'box-shadow', 'transform', 'transition', 'animation'
        ];
        
        return properties.filter(prop => 
            prop.toLowerCase().includes(query.toLowerCase())
        );
    },
    
    // Show search results
    showSearchResults(results) {
        // This would integrate with a search results UI component
        console.log('Search results:', results);
    },
    
    // Clear search results
    clearSearchResults() {
        // Clear search UI
    },
    
    // Show search in main area
    showSearchInMainArea(query) {
        // This would integrate with the main content area
        console.log('Searching in main area:', query);
    },
    
    // Set active navigation item
    setActiveItem(navId) {
        // Remove active class from all items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to selected item
        const activeLink = document.querySelector(`[data-nav-id="${navId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.activeItem = navId;
    },
    
    // Toggle mobile navigation
    toggleMobileNav() {
        const navbar = document.getElementById('navbarNav');
        const toggler = document.getElementById('navbar-toggler');
        
        if (navbar && toggler) {
            const isExpanded = navbar.classList.contains('show');
            
            if (isExpanded) {
                this.closeMobileNav();
            } else {
                this.openMobileNav();
            }
        }
    },
    
    // Open mobile navigation
    openMobileNav() {
        const navbar = document.getElementById('navbarNav');
        const toggler = document.getElementById('navbar-toggler');
        
        if (navbar && toggler) {
            navbar.classList.add('show');
            toggler.setAttribute('aria-expanded', 'true');
        }
    },
    
    // Close mobile navigation
    closeMobileNav() {
        const navbar = document.getElementById('navbarNav');
        const toggler = document.getElementById('navbar-toggler');
        
        if (navbar && toggler) {
            navbar.classList.remove('show');
            toggler.setAttribute('aria-expanded', 'false');
        }
    },
    
    // Handle window resize
    handleResize() {
        const width = window.innerWidth;
        
        if (width >= 992) {
            // Desktop - ensure mobile menu is closed
            this.closeMobileNav();
        }
        
        // Update responsive classes
        this.updateResponsiveClasses(width);
    },
    
    // Update responsive classes
    updateResponsiveClasses(width) {
        const navbar = document.getElementById('main-navbar');
        if (!navbar) return;
        
        navbar.classList.toggle('navbar-mobile', width < 992);
        navbar.classList.toggle('navbar-desktop', width >= 992);
    },
    
    // Navigation methods
    navigatePrevious() {
        const items = this.navigationItems.filter(item => !item.dropdown);
        const currentIndex = items.findIndex(item => item.id === this.activeItem);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        this.setActiveItem(items[previousIndex].id);
    },
    
    navigateNext() {
        const items = this.navigationItems.filter(item => !item.dropdown);
        const currentIndex = items.findIndex(item => item.id === this.activeItem);
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        this.setActiveItem(items[nextIndex].id);
    },
    
    openCurrentDropdown() {
        const activeItem = this.navigationItems.find(item => item.id === this.activeItem);
        if (activeItem && activeItem.dropdown) {
            const dropdown = document.getElementById(`${activeItem.id}Dropdown`);
            if (dropdown) {
                new bootstrap.Dropdown(dropdown).show();
            }
        }
    },
    
    // Close all dropdowns
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            const dropdown = bootstrap.Dropdown.getInstance(menu.previousElementSibling);
            if (dropdown) {
                dropdown.hide();
            }
        });
    },
    
    // Utility methods
    focusSearch() {
        const searchInput = document.getElementById('nav-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    },
    
    openSettings() {
        const settingsButton = document.getElementById('settingsDropdown');
        if (settingsButton) {
            new bootstrap.Dropdown(settingsButton).show();
        }
    },
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    showLearningSection() {
        // This would integrate with the learning system
        if (window.ChallengeSystem) {
            ChallengeSystem.showLearningDashboard();
        }
    },
    
    // Settings actions
    toggleMeasurements() {
        if (window.AppState) {
            const enabled = AppState.toggleVisualTool('measurements');
            this.showToast(`Measurements ${enabled ? 'enabled' : 'disabled'}`);
        }
    },
    
    toggleGuides() {
        if (window.AppState) {
            const enabled = AppState.toggleVisualTool('guides');
            this.showToast(`Guides ${enabled ? 'enabled' : 'disabled'}`);
        }
    },
    
    showKeyboardShortcuts() {
        if (window.KeyboardShortcuts) {
            KeyboardShortcuts.show();
        }
    },
    
    resetAll() {
        if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
            if (window.AppState) {
                AppState.reset();
                this.showToast('All settings have been reset');
            }
        }
    },
    
    exportSettings() {
        if (window.ExportUtils) {
            ExportUtils.exportSettings();
        }
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        }
    },
    
    // Update navigation badge
    updateBadge(itemId, badge) {
        const navItem = document.querySelector(`[data-nav-id="${itemId}"]`);
        if (navItem) {
            // Remove existing badge
            const existingBadge = navItem.querySelector('.badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge if provided
            if (badge) {
                const badgeElement = document.createElement('span');
                badgeElement.className = `badge bg-${badge.variant} ms-1`;
                badgeElement.textContent = badge.text;
                navItem.appendChild(badgeElement);
            }
        }
    },
    
    // Get current navigation state
    getState() {
        return {
            activeItem: this.activeItem,
            isCollapsed: this.isCollapsed,
            isMobileMenuOpen: document.getElementById('navbarNav')?.classList.contains('show') || false
        };
    },
    
    // Debug information
    debug() {
        return {
            activeItem: this.activeItem,
            isCollapsed: this.isCollapsed,
            navigationItems: this.navigationItems,
            state: this.getState()
        };
    }
};

// Make Navigation globally available
window.Navigation = Navigation;