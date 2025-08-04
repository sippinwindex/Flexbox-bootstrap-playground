// js/dark-mode.js - Dark mode toggle functionality

(function() {
  'use strict';
  
  const THEME_KEY = 'theme';
  const DARK_MODE_CLASS = 'dark-mode';
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };
  
  // Cache DOM elements
  let themeToggle = null;
  let sunIcon = null;
  let moonIcon = null;
  
  /**
   * Updates the visibility of sun and moon icons based on current theme
   * @param {boolean} isDarkMode - Whether dark mode is currently active
   */
  function updateIcons(isDarkMode) {
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDarkMode ? 'inline-block' : 'none';
      moonIcon.style.display = isDarkMode ? 'none' : 'inline-block';
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
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  }
  
  /**
   * Applies the given theme to the document
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    const isDarkMode = theme === THEMES.DARK;
    
    if (isDarkMode) {
      document.body.classList.add(DARK_MODE_CLASS);
    } else {
      document.body.classList.remove(DARK_MODE_CLASS);
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
   * Toggles between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    applyTheme(newTheme);
  }
  
  /**
   * Initializes the theme system
   */
  function initializeTheme() {
    // Apply the initial theme
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    
    // Cache DOM elements
    themeToggle = document.getElementById('theme-toggle');
    sunIcon = document.getElementById('theme-toggle-sun');
    moonIcon = document.getElementById('theme-toggle-moon');
    
    // Set up event listeners
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
      
      // Add keyboard support
      themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
      
      // Set initial icon state
      const isDarkMode = document.body.classList.contains(DARK_MODE_CLASS);
      updateIcons(isDarkMode);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      // Only apply system preference if user hasn't manually set a theme
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (!savedTheme) {
        applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    });
  }
  
  /**
   * Public API for other scripts
   */
  window.ThemeManager = {
    getCurrentTheme: getCurrentTheme,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme,
    isDarkMode: function() {
      return document.body.classList.contains(DARK_MODE_CLASS);
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
  
})();