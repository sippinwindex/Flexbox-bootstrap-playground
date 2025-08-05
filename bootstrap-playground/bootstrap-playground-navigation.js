// Navigation tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load navigation tab content
    loadNavigationTab();
});

function loadNavigationTab() {
    const navigationTab = document.getElementById('navigation-tab');
    if (!navigationTab) return;

    navigationTab.innerHTML = `
        <div class="component-card">
            <div class="component-header navigation">
                <div>
                    <h3 class="mb-0"><i class="bi bi-menu-button-wide me-2"></i>Bootstrap Navigation</h3>
                    <p class="mb-0 opacity-75">Navbars, breadcrumbs, pagination, and navigation components</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="live-indicator pulse">LIVE</div>
                    <button class="fullscreen-btn" onclick="enterFullscreen('navigation')" title="Enter Fullscreen Mode">
                        <i class="bi bi-arrows-fullscreen"></i>
                        Fullscreen
                    </button>
                </div>
            </div>
            <div class="component-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="control-group">
                            <label class="control-label">Navigation Type</label>
                            <div class="description-text">Choose the type of navigation component</div>
                            <select class="form-select" id="nav-type" onchange="updateNavigationDemo()">
                                <option value="navbar" selected>Navbar</option>
                                <option value="nav-tabs">Nav Tabs</option>
                                <option value="nav-pills">Nav Pills</option>
                                <option value="breadcrumb">Breadcrumb</option>
                                <option value="pagination">Pagination</option>
                                <option value="list-group">List Group</option>
                            </select>
                        </div>

                        <div id="navbar-controls" class="component-controls active">
                            <div class="control-group">
                                <label class="control-label">Navbar Theme</label>
                                <div class="description-text">Choose navbar color scheme</div>
                                <select class="form-select" id="navbar-theme" onchange="updateNavigationDemo()">
                                    <option value="navbar-light bg-light" selected>Light</option>
                                    <option value="navbar-dark bg-dark">Dark</option>
                                    <option value="navbar-dark bg-primary">Primary</option>
                                    <option value="navbar-dark bg-success">Success</option>
                                    <option value="navbar-dark bg-info">Info</option>
                                    <option value="navbar-dark bg-warning">Warning</option>
                                    <option value="navbar-dark bg-danger">Danger</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Navbar Position</label>
                                <div class="description-text">Control navbar positioning</div>
                                <select class="form-select" id="navbar-position" onchange="updateNavigationDemo()">
                                    <option value="" selected>Static</option>
                                    <option value="sticky-top">Sticky Top</option>
                                    <option value="fixed-top">Fixed Top</option>
                                    <option value="fixed-bottom">Fixed Bottom</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Navbar Features</label>
                                <div class="description-text">Add interactive features</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="navbar-brand" checked onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="navbar-brand">Brand/Logo</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="navbar-toggler" checked onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="navbar-toggler">Mobile Toggle</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="navbar-dropdown" onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="navbar-dropdown">Dropdown Menu</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="navbar-search" onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="navbar-search">Search Form</label>
                                </div>
                            </div>
                        </div>

                        <div id="pagination-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Pagination Size</label>
                                <div class="description-text">Control pagination size</div>
                                <select class="form-select" id="pagination-size" onchange="updateNavigationDemo()">
                                    <option value="pagination-sm">Small</option>
                                    <option value="" selected>Default</option>
                                    <option value="pagination-lg">Large</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Number of Pages</label>
                                <div class="description-text">Set total number of pages</div>
                                <input type="range" class="form-range" id="pagination-count" min="3" max="10" value="5" oninput="updateRangeValue('pagination-count')" onchange="updateNavigationDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>3</span>
                                    <span class="range-value" id="pagination-count-value">5</span>
                                    <span>10</span>
                                </div>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Active Page</label>
                                <div class="description-text">Set which page is currently active</div>
                                <input type="range" class="form-range" id="pagination-active" min="1" max="5" value="3" oninput="updateRangeValue('pagination-active')" onchange="updateNavigationDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>1</span>
                                    <span class="range-value" id="pagination-active-value">3</span>
                                    <span id="pagination-max-value">5</span>
                                </div>
                            </div>
                        </div>

                        <div id="nav-tabs-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Tab Style</label>
                                <div class="description-text">Choose tab appearance</div>
                                <select class="form-select" id="tab-style" onchange="updateNavigationDemo()">
                                    <option value="nav-tabs" selected>Tabs</option>
                                    <option value="nav-pills">Pills</option>
                                    <option value="nav-pills nav-fill">Pills (Fill)</option>
                                    <option value="nav-tabs nav-justified">Tabs (Justified)</option>
                                    <option value="nav-underline">Underline</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Tab Features</label>
                                <div class="description-text">Add tab features</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="tab-vertical" onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="tab-vertical">Vertical Layout</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="tab-content" checked onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="tab-content">Show Content</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="tab-fade" checked onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="tab-fade">Fade Animation</label>
                                </div>
                            </div>
                        </div>

                        <div id="breadcrumb-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Breadcrumb Style</label>
                                <div class="description-text">Choose breadcrumb appearance</div>
                                <select class="form-select" id="breadcrumb-style" onchange="updateNavigationDemo()">
                                    <option value="breadcrumb" selected>Default</option>
                                    <option value="breadcrumb custom-separator">Custom Separator</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Breadcrumb Items</label>
                                <div class="description-text">Set number of breadcrumb items</div>
                                <input type="range" class="form-range" id="breadcrumb-items" min="2" max="6" value="3" oninput="updateRangeValue('breadcrumb-items')" onchange="updateNavigationDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>2</span>
                                    <span class="range-value" id="breadcrumb-items-value">3</span>
                                    <span>6</span>
                                </div>
                            </div>
                        </div>

                        <div id="list-group-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">List Group Style</label>
                                <div class="description-text">Choose list group appearance</div>
                                <select class="form-select" id="listgroup-style" onchange="updateNavigationDemo()">
                                    <option value="list-group" selected>Default</option>
                                    <option value="list-group list-group-flush">Flush</option>
                                    <option value="list-group list-group-horizontal">Horizontal</option>
                                    <option value="list-group list-group-horizontal-md">Horizontal (MD+)</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">List Group Features</label>
                                <div class="description-text">Add interactive features</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="listgroup-actionable" checked onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="listgroup-actionable">Actionable Items</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="listgroup-badges" onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="listgroup-badges">Include Badges</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="listgroup-contextual" onchange="updateNavigationDemo()">
                                    <label class="form-check-label" for="listgroup-contextual">Contextual Colors</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h5><i class="bi bi-eye me-2"></i>Live Preview</h5>
                        <div class="demo-container" id="navigation-demo-container">
                            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                                <div class="container-fluid">
                                    <a class="navbar-brand" href="#">Brand</a>
                                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDemo">
                                        <span class="navbar-toggler-icon"></span>
                                    </button>
                                    <div class="collapse navbar-collapse" id="navbarDemo">
                                        <ul class="navbar-nav me-auto">
                                            <li class="nav-item">
                                                <a class="nav-link active" href="#">Home</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#">About</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#">Contact</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Navigation Presets:</label>
                            <div>
                                <button class="preset-btn" onclick="applyNavigationPreset('website-nav')">
                                    <i class="bi bi-house me-1"></i>Website Nav
                                </button>
                                <button class="preset-btn" onclick="applyNavigationPreset('admin-nav')">
                                    <i class="bi bi-gear me-1"></i>Admin Nav
                                </button>
                                <button class="preset-btn" onclick="applyNavigationPreset('simple-tabs')">
                                    <i class="bi bi-tabs me-1"></i>Simple Tabs
                                </button>
                            </div>
                        </div>

                        <div class="learning-tip">
                            <h6><i class="bi bi-lightbulb me-2"></i>Navigation Tips</h6>
                            <ul class="mb-0 small">
                                <li>Use sticky-top for navbars that stick when scrolling</li>
                                <li>Always include a navbar-toggler for mobile responsiveness</li>
                                <li>Breadcrumbs help users understand their location</li>
                                <li>Use aria-current="page" for accessibility</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5><i class="bi bi-code-square me-2"></i>Generated HTML</h5>
                        <div class="position-relative">
                            <button class="copy-btn" onclick="copyCode('navigation-html-output')">
                                <i class="bi bi-clipboard me-1"></i>Copy
                            </button>
                            <div class="code-output" id="navigation-html-output"><!-- HTML will be generated here --></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Navigation demo updates
function updateNavigationDemo() {
    try {
        const navType = document.getElementById('nav-type')?.value || 'navbar';
        
        // Hide all navigation controls
        document.querySelectorAll('#navigation-tab .component-controls').forEach(control => {
            control.classList.remove('active');
        });
        
        // Show relevant controls based on navigation type
        let controlsToShow = [];
        
        switch(navType) {
            case 'navbar':
                controlsToShow = ['navbar-controls'];
                break;
            case 'nav-tabs':
            case 'nav-pills':
                controlsToShow = ['nav-tabs-controls'];
                break;
            case 'breadcrumb':
                controlsToShow = ['breadcrumb-controls'];
                break;
            case 'pagination':
                controlsToShow = ['pagination-controls'];
                break;
            case 'list-group':
                controlsToShow = ['list-group-controls'];
                break;
        }
        
        // Show relevant controls
        controlsToShow.forEach(controlId => {
            const controls = document.getElementById(controlId);
            if (controls) {
                controls.classList.add('active');
            }
        });
        
        let html = '';
        
        switch(navType) {
            case 'navbar':
                html = generateNavbarHTML();
                break;
            case 'nav-tabs':
                html = generateNavTabsHTML();
                break;
            case 'nav-pills':
                html = generateNavPillsHTML();
                break;
            case 'breadcrumb':
                html = generateBreadcrumbHTML();
                break;
            case 'pagination':
                html = generatePaginationHTML();
                break;
            case 'list-group':
                html = generateListGroupHTML();
                break;
            default:
                html = generateNavbarHTML();
        }
        
        const container = document.getElementById('navigation-demo-container');
        if (container) {
            container.innerHTML = html;
            
            // Initialize Bootstrap components that need JS
            initializeNavigationComponents(navType);
        }
        
        updateHTMLOutput('navigation-html-output', html);
    } catch (error) {
        console.error('❌ Error updating navigation demo:', error);
    }
}

function generateNavbarHTML() {
    const theme = document.getElementById('navbar-theme')?.value || 'navbar-light bg-light';
    const position = document.getElementById('navbar-position')?.value || '';
    const hasBrand = document.getElementById('navbar-brand')?.checked !== false;
    const hasToggler = document.getElementById('navbar-toggler')?.checked !== false;
    const hasDropdown = document.getElementById('navbar-dropdown')?.checked || false;
    const hasSearch = document.getElementById('navbar-search')?.checked || false;
    
    const positionClass = position ? ` ${position}` : '';
    
    return `<nav class="navbar navbar-expand-lg ${theme}${positionClass}">
        <div class="container-fluid">
            ${hasBrand ? '<a class="navbar-brand" href="#">Brand</a>' : ''}
            ${hasToggler ? `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDemo">
                <span class="navbar-toggler-icon"></span>
            </button>` : ''}
            <div class="collapse navbar-collapse" id="navbarDemo">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About</a>
                    </li>
                    ${hasDropdown ? `<li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Services
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                        </ul>
                    </li>` : ''}
                    <li class="nav-item">
                        <a class="nav-link" href="#">Contact</a>
                    </li>
                </ul>
                ${hasSearch ? `<form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>` : ''}
            </div>
        </div>
    </nav>`;
}

function generateNavTabsHTML() {
    const tabStyle = document.getElementById('tab-style')?.value || 'nav-tabs';
    const isVertical = document.getElementById('tab-vertical')?.checked || false;
    const hasContent = document.getElementById('tab-content')?.checked || false;
    const hasFade = document.getElementById('tab-fade')?.checked || false;
    
    const navClasses = `nav ${tabStyle}${isVertical ? ' flex-column' : ''}`;
    const fadeClass = hasFade ? ' fade' : '';
    
    const tabsHTML = `<ul class="${navClasses}" id="navTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-pane" type="button" role="tab" aria-controls="home-pane" aria-selected="true">Home</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-pane" type="button" role="tab" aria-controls="profile-pane" aria-selected="false">Profile</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-pane" type="button" role="tab" aria-controls="contact-pane" aria-selected="false">Contact</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link disabled" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-pane" type="button" role="tab" aria-controls="disabled-pane" aria-selected="false" disabled>Disabled</button>
        </li>
    </ul>`;
    
    if (hasContent) {
        const containerClass = isVertical ? 'd-flex align-items-start' : '';
        const contentClass = isVertical ? 'flex-grow-1 ms-3' : 'mt-3';
        
        return `<div class="${containerClass}">
            ${isVertical ? '<div>' : ''}${tabsHTML}${isVertical ? '</div>' : ''}
            <div class="tab-content ${contentClass}" id="navTabContent">
                <div class="tab-pane${fadeClass} show active" id="home-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                    <h5>Home Content</h5>
                    <p>This is the home tab content. It contains information about the home section of your website.</p>
                </div>
                <div class="tab-pane${fadeClass}" id="profile-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                    <h5>Profile Content</h5>
                    <p>This is the profile tab content. Here you would display user profile information and settings.</p>
                </div>
                <div class="tab-pane${fadeClass}" id="contact-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                    <h5>Contact Content</h5>
                    <p>This is the contact tab content. Display contact forms and information here.</p>
                </div>
                <div class="tab-pane${fadeClass}" id="disabled-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
                    <h5>Disabled Content</h5>
                    <p>This content is disabled and should not be accessible.</p>
                </div>
            </div>
        </div>`;
    }
    
    return tabsHTML;
}

function generateNavPillsHTML() {
    // For nav-pills, we use the same logic as nav-tabs but the style will be different
    return generateNavTabsHTML();
}

function generateBreadcrumbHTML() {
    const style = document.getElementById('breadcrumb-style')?.value || 'breadcrumb';
    const itemCount = parseInt(document.getElementById('breadcrumb-items')?.value) || 3;
    
    const breadcrumbItems = [
        { text: 'Home', link: true },
        { text: 'Library', link: true },
        { text: 'Data', link: false },
        { text: 'Bootstrap', link: false },
        { text: 'Components', link: false },
        { text: 'Navigation', link: false }
    ];
    
    let html = `<nav aria-label="breadcrumb">
        <ol class="${style}">`;
    
    for (let i = 0; i < Math.min(itemCount, breadcrumbItems.length); i++) {
        const item = breadcrumbItems[i];
        const isLast = i === itemCount - 1;
        
        if (isLast) {
            html += `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
        } else {
            html += `<li class="breadcrumb-item"><a href="#" class="text-decoration-none">${item.text}</a></li>`;
        }
    }
    
    html += `</ol>
    </nav>`;
    
    return html;
}

function generatePaginationHTML() {
    const size = document.getElementById('pagination-size')?.value || '';
    const count = parseInt(document.getElementById('pagination-count')?.value) || 5;
    const active = parseInt(document.getElementById('pagination-active')?.value) || 3;
    
    const sizeClass = size ? ` ${size}` : '';
    
    // Update pagination active range max
    const paginationActiveRange = document.getElementById('pagination-active');
    const paginationMaxValue = document.getElementById('pagination-max-value');
    if (paginationActiveRange) {
        paginationActiveRange.max = count;
        if (parseInt(paginationActiveRange.value) > count) {
            paginationActiveRange.value = count;
        }
    }
    if (paginationMaxValue) {
        paginationMaxValue.textContent = count;
    }
    
    let html = `<nav aria-label="Page navigation">
        <ul class="pagination${sizeClass}">
            <li class="page-item${active === 1 ? ' disabled' : ''}">
                <a class="page-link" href="#" tabindex="-1">Previous</a>
            </li>`;
    
    for (let i = 1; i <= count; i++) {
        html += `<li class="page-item${i === active ? ' active' : ''}">
            <a class="page-link" href="#">${i}</a>
        </li>`;
    }
    
    html += `<li class="page-item${active === count ? ' disabled' : ''}">
                <a class="page-link" href="#">Next</a>
            </li>
        </ul>
    </nav>`;
    
    return html;
}

function generateListGroupHTML() {
    const style = document.getElementById('listgroup-style')?.value || 'list-group';
    const isActionable = document.getElementById('listgroup-actionable')?.checked || false;
    const hasBadges = document.getElementById('listgroup-badges')?.checked || false;
    const hasContextual = document.getElementById('listgroup-contextual')?.checked || false;
    
    const isHorizontal = style.includes('horizontal');
    const containerTag = 'div';
    const itemTag = isActionable ? 'a' : 'li';
    const itemBaseClass = `list-group-item${isActionable ? ' list-group-item-action' : ''}`;
    const href = isActionable ? ' href="#"' : '';
    
    const items = [
        { text: 'Home', badge: '14', contextual: hasContextual ? 'list-group-item-primary' : '', active: true },
        { text: 'Profile', badge: '2', contextual: hasContextual ? 'list-group-item-secondary' : '', active: false },
        { text: 'Messages', badge: '7', contextual: hasContextual ? 'list-group-item-success' : '', active: false },
        { text: 'Settings', badge: '1', contextual: hasContextual ? 'list-group-item-info' : '', active: false },
        { text: 'Help', badge: '', contextual: hasContextual ? 'list-group-item-warning' : '', active: false, disabled: true }
    ];
    
    let html = `<${containerTag} class="${style}">`;
    
    items.forEach(item => {
        const activeClass = item.active ? ' active' : '';
        const disabledClass = item.disabled ? ' disabled' : '';
        const contextualClass = item.contextual ? ` ${item.contextual}` : '';
        const disabledAttr = item.disabled && isActionable ? ' tabindex="-1" aria-disabled="true"' : '';
        
        const itemClass = `${itemBaseClass}${activeClass}${disabledClass}${contextualClass}`;
        const badgeHTML = hasBadges && item.badge ? ` <span class="badge ${item.active ? 'bg-light text-dark' : 'bg-primary'} rounded-pill">${item.badge}</span>` : '';
        
        html += `<${itemTag} class="${itemClass}"${href}${disabledAttr}>
            ${item.text}${badgeHTML}
        </${itemTag}>`;
    });
    
    html += `</${containerTag}>`;
    
    return html;
}

function initializeNavigationComponents(navType) {
    try {
        // Initialize tab functionality
        if (navType === 'nav-tabs' || navType === 'nav-pills') {
            const triggerTabList = [].slice.call(document.querySelectorAll('#navTabs button[data-bs-toggle="tab"]'));
            triggerTabList.forEach(function (triggerEl) {
                const tabTrigger = new bootstrap.Tab(triggerEl);
                
                triggerEl.addEventListener('click', function (event) {
                    event.preventDefault();
                    tabTrigger.show();
                });
            });
        }
        
        // Initialize any tooltips in navigation
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
    } catch (error) {
        console.error('❌ Error initializing navigation components:', error);
    }
}

function applyNavigationPreset(presetName) {
    const navType = document.getElementById('nav-type');
    
    switch(presetName) {
        case 'website-nav':
            // Complete website navigation with all features
            if (navType) navType.value = 'navbar';
            setTimeout(() => {
                const theme = document.getElementById('navbar-theme');
                const position = document.getElementById('navbar-position');
                const brand = document.getElementById('navbar-brand');
                const toggler = document.getElementById('navbar-toggler');
                const search = document.getElementById('navbar-search');
                const dropdown = document.getElementById('navbar-dropdown');
                if (theme) theme.value = 'navbar-dark bg-primary';
                if (position) position.value = 'sticky-top';
                if (brand) brand.checked = true;
                if (toggler) toggler.checked = true;
                if (search) search.checked = true;
                if (dropdown) dropdown.checked = true;
                updateNavigationDemo();
            }, 100);
            break;
            
        case 'admin-nav':
            // Dark admin-style navigation
            if (navType) navType.value = 'navbar';
            setTimeout(() => {
                const adminTheme = document.getElementById('navbar-theme');
                const adminDropdown = document.getElementById('navbar-dropdown');
                const adminBrand = document.getElementById('navbar-brand');
                const adminSearch = document.getElementById('navbar-search');
                if (adminTheme) adminTheme.value = 'navbar-dark bg-dark';
                if (adminDropdown) adminDropdown.checked = true;
                if (adminBrand) adminBrand.checked = true;
                if (adminSearch) adminSearch.checked = false;
                updateNavigationDemo();
            }, 100);
            break;
            
        case 'simple-tabs':
            // Clean tab navigation with content
            if (navType) navType.value = 'nav-tabs';
            setTimeout(() => {
                const tabContent = document.getElementById('tab-content');
                const tabFade = document.getElementById('tab-fade');
                const tabStyle = document.getElementById('tab-style');
                const tabVertical = document.getElementById('tab-vertical');
                if (tabContent) tabContent.checked = true;
                if (tabFade) tabFade.checked = true;
                if (tabStyle) tabStyle.value = 'nav-tabs';
                if (tabVertical) tabVertical.checked = false;
                updateNavigationDemo();
            }, 100);
            break;
    }
    
    showToast(`Applied ${presetName} navigation preset`, 'success');
}