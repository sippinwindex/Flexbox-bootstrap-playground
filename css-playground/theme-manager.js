// js/core/theme-manager.js - Theme Management System

const ThemeManager = {
    // Theme constants
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    },
    
    STORAGE_KEY: 'theme',
    DARK_MODE_CLASS: 'dark-mode',
    
    // Current theme state
    currentTheme: 'auto',
    systemPrefersDark: false,
    
    // Theme change listeners
    listeners: new Set(),
    
    // Initialize theme manager
    init() {
        console.log('🎨 Initializing Theme Manager...');
        
        // Set up system preference detection
        this.setupSystemPreferenceDetection();
        
        // Load saved theme or detect system preference
        this.loadSavedTheme();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Set up theme controls
        this.setupThemeControls();
        
        console.log('✅ Theme Manager initialized');
        return this;
    },
    
    // Set up system preference detection
    setupSystemPreferenceDetection() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemPrefersDark = mediaQuery.matches;
            
            // Listen for system preference changes
            mediaQuery.addEventListener('change', (e) => {
                this.systemPrefersDark = e.matches;
                
                // If current theme is auto, update the display
                if (this.currentTheme === this.THEMES.AUTO) {
                    this.updateDOM();
                    this.notifyListeners();
                }
            });
        }
    },
    
    // Load saved theme from localStorage
    loadSavedTheme() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved && Object.values(this.THEMES).includes(saved)) {
                this.currentTheme = saved;
            }
        } catch (error) {
            console.warn('Failed to load saved theme:', error);
            this.currentTheme = this.THEMES.AUTO;
        }
    },
    
    // Save theme to localStorage
    saveTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    },
    
    // Apply theme
    applyTheme(theme) {
        if (!Object.values(this.THEMES).includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }
        
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.updateDOM();
        this.updateThemeControls();
        this.notifyListeners();
    },
    
    // Update DOM classes based on current theme
    updateDOM() {
        const shouldUseDark = this.shouldUseDarkMode();
        const elements = [document.documentElement, document.body];
        
        elements.forEach(element => {
            if (element) {
                if (shouldUseDark) {
                    element.classList.add(this.DARK_MODE_CLASS);
                } else {
                    element.classList.remove(this.DARK_MODE_CLASS);
                }
            }
        });
        
        // Update meta theme-color for mobile browsers
        this.updateThemeColor();
    },
    
    // Determine if dark mode should be used
    shouldUseDarkMode() {
        switch (this.currentTheme) {
            case this.THEMES.DARK:
                return true;
            case this.THEMES.LIGHT:
                return false;
            case this.THEMES.AUTO:
                return this.systemPrefersDark;
            default:
                return this.systemPrefersDark;
        }
    },
    
    // Update theme color meta tag
    updateThemeColor() {
        const isDark = this.shouldUseDarkMode();
        const color = isDark ? '#1a202c' : '#ffffff';
        
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = color;
    },
    
    // Set up theme control elements
    setupThemeControls() {
        // Look for theme toggle buttons
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
        
        // Look for theme selector dropdowns
        const themeSelectors = document.querySelectorAll('[data-theme-selector]');
        themeSelectors.forEach(selector => {
            selector.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
        });
        
        // Look for individual theme buttons
        Object.values(this.THEMES).forEach(theme => {
            const buttons = document.querySelectorAll(`[data-theme="${theme}"]`);
            buttons.forEach(button => {
                button.addEventListener('click', () => this.applyTheme(theme));
            });
        });
    },
    
    // Update theme control states
    updateThemeControls() {
        // Update theme selectors
        const selectors = document.querySelectorAll('[data-theme-selector]');
        selectors.forEach(selector => {
            selector.value = this.currentTheme;
        });
        
        // Update theme buttons
        Object.values(this.THEMES).forEach(theme => {
            const buttons = document.querySelectorAll(`[data-theme="${theme}"]`);
            buttons.forEach(button => {
                button.classList.toggle('active', theme === this.currentTheme);
            });
        });
        
        // Update toggle button state
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            const icon = toggle.querySelector('i, svg');
            if (icon) {
                // Update icon based on current effective theme
                const isDark = this.shouldUseDarkMode();
                icon.className = icon.className.replace(/bi-\w+-\w+/, isDark ? 'bi-sun-fill' : 'bi-moon-fill');
            }
        });
    },
    
    // Toggle between light and dark (skip auto for simple toggle)
    toggleTheme() {
        const currentEffective = this.shouldUseDarkMode();
        const newTheme = currentEffective ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.applyTheme(newTheme);
    },
    
    // Cycle through all themes (light -> dark -> auto)
    cycleTheme() {
        const themes = Object.values(this.THEMES);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.applyTheme(themes[nextIndex]);
    },
    
    // Get current theme info
    getCurrentTheme() {
        return {
            selected: this.currentTheme,
            effective: this.shouldUseDarkMode() ? this.THEMES.DARK : this.THEMES.LIGHT,
            systemPrefersDark: this.systemPrefersDark
        };
    },
    
    // Check if dark mode is currently active
    isDarkMode() {
        return this.shouldUseDarkMode();
    },
    
    // Get theme-aware color values
    getThemeColor(lightColor, darkColor) {
        return this.shouldUseDarkMode() ? darkColor : lightColor;
    },
    
    // Get CSS custom property value with theme awareness
    getCSSProperty(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    },
    
    // Add theme change listener
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    },
    
    // Remove theme change listener
    removeListener(callback) {
        this.listeners.delete(callback);
    },
    
    // Notify all listeners of theme change
    notifyListeners() {
        const themeInfo = this.getCurrentTheme();
        this.listeners.forEach(callback => {
            try {
                callback(themeInfo);
            } catch (error) {
                console.error('Error in theme change listener:', error);
            }
        });
    },
    
    // Generate theme-aware gradient
    generateGradient(colors, direction = '135deg') {
        const themeColors = colors.map(color => {
            if (typeof color === 'object') {
                return this.getThemeColor(color.light, color.dark);
            }
            return color;
        });
        
        return `linear-gradient(${direction}, ${themeColors.join(', ')})`;
    },
    
    // Create theme-aware CSS rule
    createThemeRule(lightRule, darkRule) {
        const isDark = this.shouldUseDarkMode();
        return isDark ? darkRule : lightRule;
    },
    
    // Update theme for specific element
    updateElementTheme(element, lightClass, darkClass) {
        if (!element) return;
        
        const isDark = this.shouldUseDarkMode();
        element.classList.remove(lightClass, darkClass);
        element.classList.add(isDark ? darkClass : lightClass);
    },
    
    // Generate theme preview
    generatePreview(theme) {
        const tempTheme = this.currentTheme;
        this.currentTheme = theme;
        const colors = {
            background: this.getCSSProperty('--bg-primary'),
            surface: this.getCSSProperty('--surface-color'),
            text: this.getCSSProperty('--text-primary'),
            primary: this.getCSSProperty('--primary-color')
        };
        this.currentTheme = tempTheme;
        return colors;
    },
    
    // Export theme configuration
    exportTheme() {
        return {
            current: this.currentTheme,
            systemPrefersDark: this.systemPrefersDark,
            effective: this.shouldUseDarkMode() ? this.THEMES.DARK : this.THEMES.LIGHT,
            timestamp: new Date().toISOString()
        };
    },
    
    // Import theme configuration
    importTheme(config) {
        if (config && config.current && Object.values(this.THEMES).includes(config.current)) {
            this.applyTheme(config.current);
            return true;
        }
        return false;
    },
    
    // Reset to system preference
    resetToSystem() {
        this.applyTheme(this.THEMES.AUTO);
    },
    
    // Animation for theme transitions
    animateThemeChange() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.8';
        });
        
        // Update theme after brief pause
        setTimeout(() => {
            this.updateDOM();
            
            // Fade out
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 150);
    },
    
    // Smooth theme transition with animation
    applyThemeWithAnimation(theme) {
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.animateThemeChange();
        this.updateThemeControls();
        this.notifyListeners();
    },
    
    // Debug info
    debug() {
        return {
            currentTheme: this.currentTheme,
            systemPrefersDark: this.systemPrefersDark,
            shouldUseDark: this.shouldUseDarkMode(),
            hasListeners: this.listeners.size,
            cssProperties: {
                background: this.getCSSProperty('--bg-primary'),
                text: this.getCSSProperty('--text-primary'),
                primary: this.getCSSProperty('--primary-color')
            }
        };
    }
};

// Make ThemeManager globally available
window.ThemeManager = ThemeManager;