// Global variables for state management
let currentTab = 'components';
let currentComponent = 'button';
let measurementsEnabled = false;
let guidesEnabled = false;
let playgroundState = null;

// Initialize secure playground state
try {
    if (window.SecurePlaygroundState) {
        playgroundState = new SecurePlaygroundState({
            currentTab: 'components',
            currentComponent: 'button',
            measurementsEnabled: false,
            guidesEnabled: false
        });
        console.log('✅ Playground state initialized successfully');
    }
} catch (error) {
    console.error('❌ Error initializing playground state:', error);
    // Fallback for basic functionality
    playgroundState = {
        setState: (updater) => console.log('Fallback state update:', updater),
        getState: () => ({ currentTab, currentComponent })
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all demos
        updateComponentDemo();
        updateLayoutDemo();
        if (typeof updateFormDemo === 'function') updateFormDemo();
        if (typeof updateContentDemo === 'function') updateContentDemo();
        if (typeof updateNavigationDemo === 'function') updateNavigationDemo();
        if (typeof updateUtilityDemo === 'function') updateUtilityDemo();
        if (typeof updateAdvancedDemo === 'function') updateAdvancedDemo();
        
        // Initialize range value displays
        updateRangeValue('layout-columns');
        
        // Show welcome message
        setTimeout(() => {
            showToast('Welcome to the Complete Bootstrap Playground! 🚀', 'success');
        }, 1000);

        // Initialize Bootstrap tooltips and popovers
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });

    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showToast('Some features may not work properly. Please refresh the page.', 'warning');
    }
});

// Tab management
function switchComponentTab(tabName) {
    try {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to clicked button
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        currentTab = tabName;
        
        // Update state
        if (playgroundState && playgroundState.setState) {
            playgroundState.setState(prevState => ({
                ...prevState,
                currentTab: tabName
            }));
        }
        
        // Initialize the tab content
        initializeTab(tabName);
        
        showToast(`Switched to ${tabName} tab`, 'success');
    } catch (error) {
        console.error('❌ Error switching tabs:', error);
        showToast('Error switching tabs', 'error');
    }
}

// Initialize tab content
function initializeTab(tabName) {
    try {
        switch(tabName) {
            case 'components':
                updateComponentDemo();
                break;
            case 'layout':
                updateLayoutDemo();
                break;
            case 'forms':
                if (typeof updateFormDemo === 'function') updateFormDemo();
                break;
            case 'content':
                if (typeof updateContentDemo === 'function') updateContentDemo();
                break;
            case 'navigation':
                if (typeof updateNavigationDemo === 'function') updateNavigationDemo();
                break;
            case 'utilities':
                if (typeof updateUtilityDemo === 'function') updateUtilityDemo();
                break;
            case 'advanced':
                if (typeof updateAdvancedDemo === 'function') updateAdvancedDemo();
                break;
        }
    } catch (error) {
        console.error(`❌ Error initializing ${tabName} tab:`, error);
    }
}

// Component demo updates
function updateComponentDemo() {
    try {
        const componentType = document.getElementById('component-type')?.value || 'button';
        currentComponent = componentType;
        
        // Generate component HTML
        const html = generateComponentHTML(componentType);
        const container = document.getElementById('components-demo-container');
        if (container) {
            container.innerHTML = html;
        }
        
        // Update HTML output
        updateHTMLOutput('components-html-output', html);
        
        // Add interactivity
        addComponentInteractivity(container);
    } catch (error) {
        console.error('❌ Error updating component demo:', error);
    }
}

// Generate component HTML based on type
function generateComponentHTML(type) {
    try {
        switch(type) {
            case 'button':
                return generateButtonHTML();
            case 'alert':
                return generateAlertHTML();
            case 'badge':
                return generateBadgeHTML();
            case 'card':
                return generateCardHTML();
            case 'progress':
                return generateProgressHTML();
            case 'spinner':
                return generateSpinnerHTML();
            case 'dropdown':
                return generateDropdownHTML();
            case 'toast':
                return generateToastHTML();
            default:
                return '<p>Component preview will appear here</p>';
        }
    } catch (error) {
        console.error('❌ Error generating component HTML:', error);
        return '<p class="text-danger">Error generating component</p>';
    }
}

// Generate specific component HTML functions
function generateButtonHTML() {
    return `<button type="button" class="btn btn-primary bs-component selected">Click me!</button>`;
}

function generateAlertHTML() {
    return `<div class="alert alert-primary bs-component selected" role="alert">
        <i class="bi bi-info-circle me-2"></i>This is an important alert message!
    </div>`;
}

function generateBadgeHTML() {
    return `<span class="badge bg-primary bs-component selected">New</span>`;
}

function generateCardHTML() {
    return `<div class="card bs-component selected" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">Card Title</h5>
            <p class="card-text">This is a sample card with some text content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>`;
}

function generateProgressHTML() {
    return `<div class="progress bs-component selected">
        <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
    </div>`;
}

function generateSpinnerHTML() {
    return `<div class="spinner-border text-primary bs-component selected" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
}

function generateDropdownHTML() {
    return `<div class="dropdown bs-component selected">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Dropdown button
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
    </div>`;
}

function generateToastHTML() {
    return `<div class="toast show bs-component selected" role="alert">
        <div class="toast-header">
            <i class="bi bi-bell text-primary me-2"></i>
            <strong class="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            Hello, world! This is a toast message.
        </div>
    </div>`;
}

// Layout demo updates
function updateLayoutDemo() {
    try {
        const container = document.getElementById('layout-container')?.value || 'container';
        const columns = parseInt(document.getElementById('layout-columns')?.value) || 3;
        const breakpoint = document.getElementById('layout-breakpoint')?.value || 'col-md';
        
        const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary'];
        
        let html = `<div class="${container}">
            <div class="row g-3">`;
        
        for (let i = 0; i < columns; i++) {
            const color = colors[i % colors.length];
            html += `<div class="${breakpoint}">
                <div class="p-3 ${color} text-white text-center rounded">Column ${i + 1}</div>
            </div>`;
        }
        
        html += '</div></div>';
        
        const demoContainer = document.getElementById('layout-demo-container');
        if (demoContainer) {
            demoContainer.innerHTML = html;
        }
        
        updateHTMLOutput('layout-html-output', html);
    } catch (error) {
        console.error('❌ Error updating layout demo:', error);
    }
}

// Update range value displays
function updateRangeValue(rangeId) {
    const range = document.getElementById(rangeId);
    const valueDisplay = document.getElementById(`${rangeId}-value`);
    if (range && valueDisplay) {
        valueDisplay.textContent = range.value + (rangeId.includes('progress') ? '%' : '');
    }
}

// HTML output with syntax highlighting
function updateHTMLOutput(outputId, html) {
    const output = document.getElementById(outputId);
    if (!output) return;
    
    // Store original HTML for theme updates
    output.setAttribute('data-original-html', html);
    
    const formattedHTML = formatHTML(html);
    const highlightedHTML = highlightSyntax(formattedHTML);
    output.innerHTML = highlightedHTML;
}

// Format HTML for display
function formatHTML(html) {
    let formatted = html;
    let indent = '';
    const tab = '  ';
    
    formatted = formatted.replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    let result = '';
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        if (trimmed.startsWith('</')) {
            indent = indent.substring(tab.length);
        }
        
        result += indent + trimmed + '\n';
        
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            const tagName = trimmed.match(/<(\w+)/);
            const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
            if (tagName && !voidElements.includes(tagName[1].toLowerCase())) {
                indent += tab;
            }
        }
    });
    
    return result.trim();
}

// Syntax highlighting
function highlightSyntax(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&lt;(\/?[\w-]+)([^&]*?)&gt;/g, (match, tag, attrs) => {
            const highlightedTag = `<span class="html-tag">&lt;${tag}</span>`;
            const highlightedAttrs = attrs.replace(/([\w-]+)=("[^"]*")/g, 
                '<span class="html-attr">$1</span>=<span class="html-value">$2</span>');
            return `${highlightedTag}${highlightedAttrs}<span class="html-tag">&gt;</span>`;
        })
        .replace(/(class="[^"]*bootstrap[^"]*")/gi, '<span class="bootstrap-class">$1</span>');
}

// Copy code functionality
function copyCode(outputId) {
    const output = document.getElementById(outputId);
    if (!output) return;
    
    const text = output.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = output.parentElement.querySelector('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
        }, 2000);
        
        showToast('HTML copied to clipboard!', 'success');
    });
}

// Component interactivity
function addComponentInteractivity(container) {
    if (!container) return;
    
    const components = container.querySelectorAll('.bs-component');
    components.forEach(component => {
        component.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove selected class from all components
            container.querySelectorAll('.bs-component').forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked component
            component.classList.add('selected');
            
            showToast('Component selected', 'info');
        });
    });
}

// Preset applications
function applyComponentPreset(presetName) {
    switch(presetName) {
        case 'cta-button':
            const componentType = document.getElementById('component-type');
            if (componentType) {
                componentType.value = 'button';
            }
            showToast('Applied CTA button preset', 'success');
            break;
        case 'success-alert':
            const alertType = document.getElementById('component-type');
            if (alertType) {
                alertType.value = 'alert';
            }
            showToast('Applied success alert preset', 'success');
            break;
        case 'info-card':
            const cardType = document.getElementById('component-type');
            if (cardType) {
                cardType.value = 'card';
            }
            showToast('Applied info card preset', 'success');
            break;
    }
    
    updateComponentDemo();
}

function applyLayoutPreset(presetName) {
    switch(presetName) {
        case 'three-column':
            const columns = document.getElementById('layout-columns');
            const breakpoint = document.getElementById('layout-breakpoint');
            if (columns) columns.value = '3';
            if (breakpoint) breakpoint.value = 'col-md';
            break;
        case 'sidebar':
            const sidebarColumns = document.getElementById('layout-columns');
            const sidebarBreakpoint = document.getElementById('layout-breakpoint');
            if (sidebarColumns) sidebarColumns.value = '2';
            if (sidebarBreakpoint) sidebarBreakpoint.value = 'col-lg';
            break;
    }
    
    updateLayoutDemo();
    showToast(`Applied ${presetName} layout preset`, 'success');
}

// Visual tools
function toggleMeasurements() {
    measurementsEnabled = !measurementsEnabled;
    const btn = document.getElementById('measurements-btn');
    const containers = document.querySelectorAll('.demo-container');
    
    if (measurementsEnabled) {
        btn?.classList.add('active');
        containers.forEach(container => container.classList.add('with-measurements'));
        showToast('Measurements enabled', 'info');
    } else {
        btn?.classList.remove('active');
        containers.forEach(container => container.classList.remove('with-measurements'));
        showToast('Measurements disabled', 'info');
    }
}

function toggleComponentGuides() {
    guidesEnabled = !guidesEnabled;
    const btn = document.getElementById('guide-btn');
    
    if (guidesEnabled) {
        btn?.classList.add('active');
        showToast('Component guides enabled', 'info');
    } else {
        btn?.classList.remove('active');
        showToast('Component guides disabled', 'info');
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const container = document.getElementById('fullscreenContainer');
    const icon = document.getElementById('fullscreen-icon');
    
    if (container?.classList.contains('active')) {
        exitFullscreen();
    } else {
        enterFullscreen(currentTab);
    }
}

function enterFullscreen(tabName) {
    const container = document.getElementById('fullscreenContainer');
    const playgroundContent = document.getElementById('fullscreen-playground-content');
    const controlsContent = document.getElementById('fullscreen-controls-content');
    
    // Clone current tab content
    const currentTabElement = document.getElementById(`${tabName}-tab`);
    if (currentTabElement) {
        const demo = currentTabElement.querySelector('.demo-container');
        const controls = currentTabElement.querySelector('.col-lg-6');
        
        if (demo && playgroundContent) {
            playgroundContent.innerHTML = demo.outerHTML;
        }
        
        if (controls && controlsContent) {
            controlsContent.innerHTML = controls.innerHTML;
        }
    }
    
    if (container) {
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    const icon = document.getElementById('fullscreen-icon');
    if (icon) {
        icon.classList.remove('bi-fullscreen');
        icon.classList.add('bi-fullscreen-exit');
    }
    
    showToast('Entered fullscreen mode', 'success');
}

function exitFullscreen() {
    const container = document.getElementById('fullscreenContainer');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    const icon = document.getElementById('fullscreen-icon');
    if (icon) {
        icon.classList.remove('bi-fullscreen-exit');
        icon.classList.add('bi-fullscreen');
    }
    
    showToast('Exited fullscreen mode', 'info');
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type}`;
    
    const icons = {
        success: 'bi-check-circle',
        error: 'bi-x-circle',
        warning: 'bi-exclamation-triangle',
        info: 'bi-info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${icons[type]} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}

// Export and utility functions
function exportBootstrapHTML() {
    let allHTML = '';
    
    // Collect HTML from all visible demos
    document.querySelectorAll('.demo-container').forEach((container, index) => {
        if (container.innerHTML.trim()) {
            allHTML += `<!-- Demo ${index + 1} -->\n${container.innerHTML}\n\n`;
        }
    });
    
    const blob = new Blob([allHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bootstrap-components.html';
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('HTML exported successfully!', 'success');
}

function resetAllComponents() {
    // Reset all form controls to defaults
    document.querySelectorAll('select, input, textarea').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else if (input.type === 'range') {
            input.value = input.getAttribute('value') || input.min || 0;
        } else {
            input.value = input.getAttribute('value') || '';
        }
    });
    
    // Update all demos
    updateComponentDemo();
    updateLayoutDemo();
    
    showToast('All components reset to defaults', 'info');
}

function validateBootstrapHTML() {
    const containers = document.querySelectorAll('.demo-container');
    let isValid = true;
    let errors = [];
    
    containers.forEach((container, index) => {
        const html = container.innerHTML;
        
        // Basic validation checks
        if (!html.includes('class=')) {
            errors.push(`Demo ${index + 1}: Missing Bootstrap classes`);
            isValid = false;
        }
        
        // Check for common Bootstrap patterns
        const hasBootstrapClasses = /\b(btn|alert|card|row|col|container)\b/.test(html);
        if (!hasBootstrapClasses) {
            errors.push(`Demo ${index + 1}: No Bootstrap classes detected`);
            isValid = false;
        }
    });
    
    if (isValid) {
        showToast('HTML validation passed!', 'success');
    } else {
        showToast(`Validation errors found: ${errors.join(', ')}`, 'error');
    }
}

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+D for theme toggle
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (window.ThemeManager) {
            window.ThemeManager.toggleTheme();
        }
    }
    
    // F11 for fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Ctrl+Enter for copy HTML
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const activeOutput = document.querySelector('.tab-content.active .code-output');
        if (activeOutput) {
            copyCode(activeOutput.id);
        }
    }
    
    // Number keys for tab switching
    if (e.key >= '1' && e.key <= '7') {
        const tabs = ['components', 'layout', 'forms', 'content', 'navigation', 'utilities', 'advanced'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            switchComponentTab(tabs[tabIndex]);
        }
    }
    
    // Delete key to clear
    if (e.key === 'Delete') {
        resetAllComponents();
    }
    
    // M for measurements
    if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.altKey) {
            toggleMeasurements();
        }
    }
    
    // G for guides
    if (e.key === 'g' || e.key === 'G') {
        if (!e.ctrlKey && !e.altKey) {
            toggleComponentGuides();
        }
    }
});

// Listen for theme changes to update syntax highlighting
window.addEventListener('themeChanged', function(e) {
    updateSyntaxHighlightingForTheme();
});

window.addEventListener('syntaxThemeChanged', function(e) {
    updateSyntaxHighlightingForTheme();
});

// Update syntax highlighting based on current theme
function updateSyntaxHighlightingForTheme() {
    document.querySelectorAll('.code-output').forEach(output => {
        const html = output.getAttribute('data-original-html');
        if (html) {
            const highlighted = highlightSyntax(formatHTML(html));
            output.innerHTML = highlighted;
        }
    });
}