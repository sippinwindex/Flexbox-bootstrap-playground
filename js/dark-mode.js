// js/dark-mode.js - Dark mode toggle functionality
(function() {
    'use strict';
    
    const THEME_KEY = 'theme';
    const SYNTAX_THEME_KEY = 'syntaxTheme';
    const TOGGLE_POSITION_KEY = 'themeTogglePosition';
    const DARK_MODE_CLASS = 'dark-mode';
    
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };
    
    const SYNTAX_THEMES = {
        DEFAULT: 'default',
        DRACULA: 'dracula',
        MONOKAI: 'monokai',
        MATERIAL: 'material'
    };
    
    // Cache DOM elements
    let themeToggle = null;
    let themeSelector = null;
    let themeToggleWrapper = null;
    let sunIcon = null;
    let moonIcon = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    /**
     * Updates the visibility of sun and moon icons based on current theme
     * @param {boolean} isDarkMode - Whether dark mode is currently active
     */
    function updateIcons(isDarkMode) {
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDarkMode ? 'none' : 'inline-block';
            moonIcon.style.display = isDarkMode ? 'inline-block' : 'none';
        }
    }
    
    /**
     * Gets the current theme from localStorage or system preference
     * @returns {string} 'dark' or 'light'
     */
    function getCurrentTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        
        if (savedTheme === THEMES.DARK || savedTheme === THEMES.LIGHT) {
            return savedTheme;
        }
        
        // Check system preference if no saved theme
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? THEMES.DARK 
            : THEMES.LIGHT;
    }
    
    /**
     * Gets the current syntax theme from localStorage
     * @returns {string} syntax theme name
     */
    function getCurrentSyntaxTheme() {
        return localStorage.getItem(SYNTAX_THEME_KEY) || SYNTAX_THEMES.DRACULA;
    }
    
    /**
     * Applies the given theme to the document
     * @param {string} theme - 'dark' or 'light'
     */
    function applyTheme(theme) {
        const isDarkMode = theme === THEMES.DARK;
        
        if (isDarkMode) {
            document.body.classList.add(DARK_MODE_CLASS);
            document.documentElement.classList.add(DARK_MODE_CLASS);
        } else {
            document.body.classList.remove(DARK_MODE_CLASS);
            document.documentElement.classList.remove(DARK_MODE_CLASS);
        }
        
        // Store the preference
        localStorage.setItem(THEME_KEY, theme);
        
        // Update icons
        updateIcons(isDarkMode);
        
        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, isDarkMode }
        }));
    }
    
    /**
     * Applies syntax theme to CodeMirror instances
     * @param {string} syntaxTheme - syntax theme name
     */
    function applySyntaxTheme(syntaxTheme) {
        localStorage.setItem(SYNTAX_THEME_KEY, syntaxTheme);
        
        // Dispatch event for CodeMirror instances to update
        window.dispatchEvent(new CustomEvent('syntaxThemeChanged', {
            detail: { syntaxTheme }
        }));
    }
    
    /**
     * Updates active theme option in selector
     */
    function updateActiveThemeOption() {
        if (!themeSelector) return;
        
        const currentSyntax = getCurrentSyntaxTheme();
        const themeOptions = themeSelector.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.syntax === currentSyntax) {
                option.classList.add('active');
            }
        });
    }
    
    /**
     * Shows toast notification if available
     * @param {string} message - Message to show
     * @param {string} type - Toast type (success, info, warn, error)
     */
    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else if (typeof showToast === 'function') {
            showToast(message, type);
        }
    }
    
    /**
     * Makes the theme toggle draggable
     */
    function makeDraggable() {
        if (!themeToggleWrapper) return;
        
        let currentX, currentY, initialX, initialY;
        
        function dragStart(e) {
            if (e.target.closest('.theme-selector')) return;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (!clientX || !clientY) return;
            
            initialX = clientX - dragOffset.x;
            initialY = clientY - dragOffset.y;
            
            if (e.target === themeToggleWrapper || e.target.closest('.theme-toggle')) {
                isDragging = true;
                themeToggleWrapper.style.cursor = 'grabbing';
                e.preventDefault();
            }
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (!clientX || !clientY) return;
            
            currentX = clientX - initialX;
            currentY = clientY - initialY;
            
            dragOffset.x = currentX;
            dragOffset.y = currentY;
            
            // Constrain to viewport
            const rect = themeToggleWrapper.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            dragOffset.x = Math.max(0, Math.min(maxX, currentX));
            dragOffset.y = Math.max(0, Math.min(maxY, currentY));
            
            themeToggleWrapper.style.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px)`;
        }
        
        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            themeToggleWrapper.style.cursor = 'move';
            
            // Save position
            localStorage.setItem(TOGGLE_POSITION_KEY, JSON.stringify(dragOffset));
        }
        
        // Mouse events
        themeToggleWrapper.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        // Touch events for mobile
        themeToggleWrapper.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);
        
        // Load saved position
        loadSavedPosition();
    }
    
    /**
     * Loads saved toggle position
     */
    function loadSavedPosition() {
        if (!themeToggleWrapper) return;
        
        const savedPosition = localStorage.getItem(TOGGLE_POSITION_KEY);
        if (savedPosition) {
            try {
                dragOffset = JSON.parse(savedPosition);
                themeToggleWrapper.style.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px)`;
            } catch (e) {
                console.warn('Failed to load saved theme toggle position:', e);
            }
        }
    }
    
    /**
     * Toggles between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        applyTheme(newTheme);
        showToast(`Switched to ${newTheme} mode`, 'info');
    }
    
    /**
     * Sets up theme selector functionality
     */
    function setupThemeSelector() {
        if (!themeToggle || !themeSelector) return;
        
        // Toggle theme selector
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isDragging) {
                themeSelector.classList.toggle('show');
            }
        });
        
        // Close theme selector when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeSelector.contains(e.target) && !themeToggle.contains(e.target)) {
                themeSelector.classList.remove('show');
            }
        });
        
        // Theme option selection
        const themeOptions = themeSelector.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                const syntax = option.dataset.syntax;
                
                applyTheme(theme);
                applySyntaxTheme(syntax);
                updateActiveThemeOption();
                
                themeSelector.classList.remove('show');
                
                const themeName = option.textContent.trim().split('\n')[0];
                showToast(`Applied ${themeName} theme`, 'success');
            });
        });
        
        updateActiveThemeOption();
    }
    
    /**
     * Initializes the theme system
     */
    function initializeTheme() {
        // Cache DOM elements
        themeToggle = document.getElementById('themeToggle');
        themeSelector = document.getElementById('themeSelector');
        themeToggleWrapper = document.getElementById('themeToggleWrapper');
        sunIcon = document.getElementById('sunIcon');
        moonIcon = document.getElementById('moonIcon');
        
        // Apply the initial theme
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme);
        
        // Set up event listeners
        if (themeToggle) {
            // Add keyboard support
            themeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (themeSelector && themeSelector.classList.contains('show')) {
                        themeSelector.classList.remove('show');
                    } else {
                        toggleTheme();
                    }
                }
            });
        }
        
        // Setup theme selector
        setupThemeSelector();
        
        // Make draggable
        makeDraggable();
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', function(e) {
                // Only apply system preference if user hasn't manually set a theme
                const savedTheme = localStorage.getItem(THEME_KEY);
                if (!savedTheme) {
                    applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });
        }
    }
    
    /**
     * Creates theme toggle HTML if it doesn't exist
     */
    function createThemeToggle() {
        if (document.getElementById('themeToggleWrapper')) return;
        
        const html = `
            <div class="theme-toggle-wrapper" id="themeToggleWrapper">
                <button class="theme-toggle" id="themeToggle" title="Toggle Theme" aria-label="Toggle between light and dark themes">
                    <i class="bi bi-sun-fill sun-icon" id="sunIcon"></i>
                    <i class="bi bi-moon-fill moon-icon" id="moonIcon" style="display: none;"></i>
                </button>
                
                <div class="theme-selector" id="themeSelector">
                    <div class="theme-option" data-theme="light" data-syntax="default">
                        <i class="bi bi-sun-fill"></i>
                        <div>
                            <div>Light Theme</div>
                            <small style="opacity: 0.7;">Default syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="dracula">
                        <i class="bi bi-moon-fill"></i>
                        <div>
                            <div>Dark Dracula</div>
                            <small style="opacity: 0.7;">Dracula syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="monokai">
                        <i class="bi bi-circle-fill" style="color: #272822;"></i>
                        <div>
                            <div>Dark Monokai</div>
                            <small style="opacity: 0.7;">Monokai syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="material">
                        <i class="bi bi-circle-fill" style="color: #263238;"></i>
                        <div>
                            <div>Material Dark</div>
                            <small style="opacity: 0.7;">Material syntax</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    /**
     * Public API for other scripts
     */
    window.ThemeManager = {
        getCurrentTheme: getCurrentTheme,
        getCurrentSyntaxTheme: getCurrentSyntaxTheme,
        applyTheme: applyTheme,
        applySyntaxTheme: applySyntaxTheme,
        toggleTheme: toggleTheme,
        updateActiveThemeOption: updateActiveThemeOption,
        isDarkMode: function() {
            return document.body.classList.contains(DARK_MODE_CLASS);
        },
        THEMES: THEMES,
        SYNTAX_THEMES: SYNTAX_THEMES,
        createThemeToggle: createThemeToggle
    };
    
    // Keyboard shortcut for theme toggle (Ctrl/Cmd + D)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Apply theme immediately to prevent flash of unstyled content
    function applyInitialTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        
        if (savedTheme === THEMES.DARK) {
            document.documentElement.classList.add(DARK_MODE_CLASS);
            if (document.body) {
                document.body.classList.add(DARK_MODE_CLASS);
            }
        } else if (savedTheme === THEMES.LIGHT) {
            document.documentElement.classList.remove(DARK_MODE_CLASS);
            if (document.body) {
                document.body.classList.remove(DARK_MODE_CLASS);
            }
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add(DARK_MODE_CLASS);
                if (document.body) {
                    document.body.classList.add(DARK_MODE_CLASS);
                }
            }
        }
    }
    
    // Apply initial theme immediately
    applyInitialTheme();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }
    
})();