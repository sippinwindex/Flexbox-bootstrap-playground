/**
 * Advanced Theme Manager - Complete dark mode system
 * Handles theme switching, persistence, and syntax highlighting
 */

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
        MATERIAL: 'material',
        NORD: 'nord',
        BASE16_LIGHT: 'base16-light'
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
     */
    function updateIcons(isDarkMode) {
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDarkMode ? 'none' : 'inline-block';
            moonIcon.style.display = isDarkMode ? 'inline-block' : 'none';
        }
    }
    
    /**
     * Gets the current theme from localStorage or system preference
     */
    function getCurrentTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        
        if (savedTheme === THEMES.DARK || savedTheme === THEMES.LIGHT) {
            return savedTheme;
        }
        
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? THEMES.DARK 
            : THEMES.LIGHT;
    }
    
    /**
     * Gets the current syntax theme from localStorage
     */
    function getCurrentSyntaxTheme() {
        return localStorage.getItem(SYNTAX_THEME_KEY) || SYNTAX_THEMES.DRACULA;
    }
    
    /**
     * Applies the given theme to the document
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
        
        localStorage.setItem(THEME_KEY, theme);
        updateIcons(isDarkMode);
        
        // Update syntax highlighting if applicable
        updateSyntaxHighlighting();
        
        // Show toast notification if function exists
        if (typeof showToast === 'function') {
            showToast(`Switched to ${theme} mode`, 'info');
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, isDarkMode }
        }));
    }
    
    /**
     * Applies syntax theme to code blocks and editors
     */
    function applySyntaxTheme(syntaxTheme) {
        localStorage.setItem(SYNTAX_THEME_KEY, syntaxTheme);
        updateSyntaxHighlighting();
        
        // Update CodeMirror instances if they exist
        if (window.platform && window.platform.state && window.platform.state.codeMirrorInstances) {
            Object.values(window.platform.state.codeMirrorInstances).forEach(instance => {
                if (instance) {
                    instance.setOption('theme', syntaxTheme);
                }
            });
        }
        
        window.dispatchEvent(new CustomEvent('syntaxThemeChanged', {
            detail: { syntaxTheme }
        }));
    }
    
    /**
     * Updates syntax highlighting based on current theme
     */
    function updateSyntaxHighlighting() {
        const syntaxTheme = getCurrentSyntaxTheme();
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            switch(syntaxTheme) {
                case SYNTAX_THEMES.DRACULA:
                    block.style.background = 'linear-gradient(135deg, #282a36, #44475a)';
                    block.style.color = '#f8f8f2';
                    break;
                case SYNTAX_THEMES.MONOKAI:
                    block.style.background = 'linear-gradient(135deg, #272822, #3e3d32)';
                    block.style.color = '#f8f8f2';
                    break;
                case SYNTAX_THEMES.MATERIAL:
                    block.style.background = 'linear-gradient(135deg, #263238, #37474f)';
                    block.style.color = '#eeffff';
                    break;
                case SYNTAX_THEMES.NORD:
                    block.style.background = 'linear-gradient(135deg, #2e3440, #3b4252)';
                    block.style.color = '#d8dee9';
                    break;
                case SYNTAX_THEMES.BASE16_LIGHT:
                    block.style.background = 'linear-gradient(135deg, #f5f5f5, #e8e8e8)';
                    block.style.color = '#383838';
                    break;
                default:
                    block.style.background = 'linear-gradient(135deg, #1e1e1e, #2d2d2d)';
                    block.style.color = '#e2e8f0';
            }
        });
    }
    
    /**
     * Updates active theme option in selector
     */
    function updateActiveThemeOption() {
        if (!themeSelector) return;
        
        const currentTheme = getCurrentTheme();
        const currentSyntax = getCurrentSyntaxTheme();
        const themeOptions = themeSelector.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === currentTheme && option.dataset.syntax === currentSyntax) {
                option.classList.add('active');
            }
        });
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
        updateActiveThemeOption();
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
                if (typeof showToast === 'function') {
                    showToast(`Applied ${themeName} theme`, 'success');
                }
            });
        });
        
        updateActiveThemeOption();
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
                    <div class="theme-option" data-theme="light" data-syntax="base16-light">
                        <i class="bi bi-sun-fill"></i>
                        <div>
                            <div>Light Theme</div>
                            <small>Light syntax</small>
                        </div>
                    </div>
                    <div class="theme-option active" data-theme="dark" data-syntax="dracula">
                        <i class="bi bi-moon-fill"></i>
                        <div>
                            <div>Dark Dracula</div>
                            <small>Dracula syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="monokai">
                        <i class="bi bi-circle-fill" style="color: #a6e22e;"></i>
                        <div>
                            <div>Dark Monokai</div>
                            <small>Monokai syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="material">
                        <i class="bi bi-circle-fill" style="color: #80cbc4;"></i>
                        <div>
                            <div>Material Dark</div>
                            <small>Material syntax</small>
                        </div>
                    </div>
                    <div class="theme-option" data-theme="dark" data-syntax="nord">
                        <i class="bi bi-circle-fill" style="color: #88c0d0;"></i>
                        <div>
                            <div>Nord Dark</div>
                            <small>Nord syntax</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    /**
     * Initializes the theme system
     */
    function initializeTheme() {
        // Create theme toggle if it doesn't exist
        createThemeToggle();
        
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
                const savedTheme = localStorage.getItem(THEME_KEY);
                if (!savedTheme) {
                    applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });
        }
    }
    
    /**
     * Apply theme immediately to prevent flash of unstyled content
     */
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
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add(DARK_MODE_CLASS);
                if (document.body) {
                    document.body.classList.add(DARK_MODE_CLASS);
                }
            }
        }
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
        createThemeToggle: createThemeToggle,
        updateSyntaxHighlighting: updateSyntaxHighlighting
    };
    
    // Apply initial theme immediately
    applyInitialTheme();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }
    
})();