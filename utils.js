/**
 * utils.js - Utility Functions and Performance Helpers
 * Common utilities used throughout the application
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) {
                try {
                    func.apply(this, args);
                } catch (error) {
                    console.error('Error in debounced function:', error);
                    if (window.globalErrorBoundary) {
                        window.globalErrorBoundary.handleError(error, { context: 'debounced_function' });
                    }
                }
            }
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) {
            try {
                func.apply(this, args);
            } catch (error) {
                console.error('Error in immediate debounced function:', error);
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'immediate_debounced_function' });
                }
            }
        }
    };
}

/**
 * Throttle function to limit function calls to once per specified time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    let lastResult;
    
    return function(...args) {
        if (!inThrottle) {
            try {
                lastResult = func.apply(this, args);
            } catch (error) {
                console.error('Error in throttled function:', error);
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'throttled_function' });
                }
            }
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
        return lastResult;
    };
}

/**
 * Request Animation Frame batch utility for smooth animations
 * @param {Function} callback - Function to execute
 */
function rafBatch(callback) {
    if (typeof callback !== 'function') {
        console.error('rafBatch: callback must be a function');
        return;
    }
    
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        requestAnimationFrame(() => {
            try {
                callback();
            } catch (error) {
                console.error('Error in RAF callback:', error);
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'raf_callback' });
                }
            }
        });
    } else {
        // Fallback for environments without requestAnimationFrame
        setTimeout(() => {
            try {
                callback();
            } catch (error) {
                console.error('Error in RAF fallback:', error);
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'raf_fallback' });
                }
            }
        }, 16); // ~60fps
    }
}

/**
 * Safe DOM element selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null} Found element or null
 */
function safeQuerySelector(selector, parent = document) {
    try {
        if (!selector || typeof selector !== 'string') {
            console.warn('Invalid selector provided to safeQuerySelector:', selector);
            return null;
        }
        
        const element = parent.querySelector(selector);
        return element;
        
    } catch (error) {
        console.error('Error in safeQuerySelector:', error, { selector, parent });
        return null;
    }
}

/**
 * Safe DOM element selector for multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList|Array} Found elements or empty array
 */
function safeQuerySelectorAll(selector, parent = document) {
    try {
        if (!selector || typeof selector !== 'string') {
            console.warn('Invalid selector provided to safeQuerySelectorAll:', selector);
            return [];
        }
        
        const elements = parent.querySelectorAll(selector);
        return elements;
        
    } catch (error) {
        console.error('Error in safeQuerySelectorAll:', error, { selector, parent });
        return [];
    }
}

/**
 * Safe element creation with error handling
 * @param {string} tagName - HTML tag name
 * @param {Object} options - Element options
 * @returns {Element|null} Created element or null
 */
function safeCreateElement(tagName, options = {}) {
    try {
        if (!tagName || typeof tagName !== 'string') {
            console.error('Invalid tagName provided to safeCreateElement:', tagName);
            return null;
        }
        
        const element = document.createElement(tagName);
        
        // Set attributes
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                try {
                    element.setAttribute(key, value);
                } catch (error) {
                    console.warn(`Failed to set attribute ${key}:`, error);
                }
            });
        }
        
        // Set properties
        if (options.properties) {
            Object.entries(options.properties).forEach(([key, value]) => {
                try {
                    element[key] = value;
                } catch (error) {
                    console.warn(`Failed to set property ${key}:`, error);
                }
            });
        }
        
        // Set text content
        if (options.textContent) {
            element.textContent = options.textContent;
        }
        
        // Set HTML content (use carefully)
        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }
        
        // Add classes
        if (options.className) {
            if (typeof options.className === 'string') {
                element.className = options.className;
            } else if (Array.isArray(options.className)) {
                element.classList.add(...options.className);
            }
        }
        
        // Set styles
        if (options.styles) {
            Object.entries(options.styles).forEach(([key, value]) => {
                try {
                    element.style[key] = value;
                } catch (error) {
                    console.warn(`Failed to set style ${key}:`, error);
                }
            });
        }
        
        return element;
        
    } catch (error) {
        console.error('Error in safeCreateElement:', error, { tagName, options });
        return null;
    }
}

/**
 * Safe event listener addition with automatic cleanup tracking
 * @param {Element} element - Element to add listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
function safeAddEventListener(element, event, handler, options = {}) {
    try {
        if (!element || typeof element.addEventListener !== 'function') {
            console.error('Invalid element provided to safeAddEventListener:', element);
            return () => {};
        }
        
        if (typeof handler !== 'function') {
            console.error('Invalid handler provided to safeAddEventListener:', handler);
            return () => {};
        }
        
        // Wrap handler for error catching
        const wrappedHandler = function(e) {
            try {
                return handler.call(this, e);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { 
                        context: 'event_handler',
                        event,
                        element: element.tagName || 'unknown'
                    });
                }
            }
        };
        
        element.addEventListener(event, wrappedHandler, options);
        
        // Return cleanup function
        return () => {
            try {
                element.removeEventListener(event, wrappedHandler, options);
            } catch (error) {
                console.warn('Error removing event listener:', error);
            }
        };
        
    } catch (error) {
        console.error('Error in safeAddEventListener:', error);
        return () => {};
    }
}

/**
 * Wait for DOM to be ready
 * @returns {Promise} Promise that resolves when DOM is ready
 */
function waitForDOM() {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

/**
 * Wait for element to exist in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Element>} Promise that resolves with element
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = safeQuerySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const element = safeQuerySelector(selector);
            if (element) {
                observer.disconnect();
                clearTimeout(timeoutId);
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        const timeoutId = setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Validate if an object has required properties
 * @param {Object} obj - Object to validate
 * @param {Array} requiredProps - Required property names
 * @returns {Object} Validation result
 */
function validateObject(obj, requiredProps = []) {
    const result = {
        isValid: true,
        missing: [],
        errors: []
    };
    
    try {
        if (!obj || typeof obj !== 'object') {
            result.isValid = false;
            result.errors.push('Input is not an object');
            return result;
        }
        
        requiredProps.forEach(prop => {
            if (!(prop in obj)) {
                result.missing.push(prop);
                result.isValid = false;
            }
        });
        
    } catch (error) {
        result.isValid = false;
        result.errors.push(error.message);
    }
    
    return result;
}

/**
 * Deep merge objects safely
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} Merged object
 */
function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    
    return deepMerge(target, ...sources);
}

/**
 * Check if value is an object
 * @param {*} item - Item to check
 * @returns {boolean} Is object
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format bytes to human readable string
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            console.log('✅ Text copied to clipboard');
            return true;
        } else {
            // Fallback for older browsers
            return fallbackCopyTextToClipboard(text);
        }
    } catch (error) {
        console.error('Failed to copy text:', error);
        return fallbackCopyTextToClipboard(text);
    }
}

/**
 * Fallback clipboard copy method
 * @param {string} text - Text to copy
 * @returns {boolean} Success
 */
function fallbackCopyTextToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            console.log('✅ Text copied to clipboard (fallback)');
        } else {
            console.warn('❌ Fallback copy failed');
        }
        
        return successful;
        
    } catch (error) {
        console.error('Error in fallback copy:', error);
        return false;
    }
}

/**
 * Animate element with CSS classes
 * @param {Element} element - Element to animate
 * @param {string} animationClass - CSS animation class
 * @param {number} duration - Animation duration
 * @returns {Promise} Promise that resolves when animation completes
 */
function animateElement(element, animationClass, duration = 300) {
    return new Promise(resolve => {
        if (!element || !animationClass) {
            resolve();
            return;
        }
        
        const cleanup = () => {
            element.classList.remove(animationClass);
            element.removeEventListener('animationend', handleAnimationEnd);
            element.removeEventListener('transitionend', handleAnimationEnd);
        };
        
        const handleAnimationEnd = () => {
            cleanup();
            resolve();
        };
        
        element.addEventListener('animationend', handleAnimationEnd);
        element.addEventListener('transitionend', handleAnimationEnd);
        
        element.classList.add(animationClass);
        
        // Fallback timeout
        setTimeout(() => {
            cleanup();
            resolve();
        }, duration + 100);
    });
}

/**
 * Check if element is visible in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} Is visible
 */
function isElementVisible(element, threshold = 0.1) {
    try {
        if (!element || typeof element.getBoundingClientRect !== 'function') {
            return false;
        }
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const verticalVisible = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horizontalVisible = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        if (!verticalVisible || !horizontalVisible) {
            return false;
        }
        
        // Check threshold
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
        const visibleArea = visibleHeight * visibleWidth;
        const totalArea = rect.height * rect.width;
        
        return (visibleArea / totalArea) >= threshold;
        
    } catch (error) {
        console.error('Error checking element visibility:', error);
        return false;
    }
}

/**
 * Smooth scroll to element
 * @param {Element|string} target - Element or selector
 * @param {Object} options - Scroll options
 */
function smoothScrollTo(target, options = {}) {
    try {
        const element = typeof target === 'string' ? safeQuerySelector(target) : target;
        
        if (!element) {
            console.warn('Element not found for smooth scroll:', target);
            return;
        }
        
        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };
        
        element.scrollIntoView({ ...defaultOptions, ...options });
        
    } catch (error) {
        console.error('Error in smooth scroll:', error);
    }
}

/**
 * Load image with promise
 * @param {string} src - Image source
 * @param {number} timeout - Load timeout
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
function loadImage(src, timeout = 10000) {
    return new Promise((resolve, reject) => {
        if (!src) {
            reject(new Error('No image source provided'));
            return;
        }
        
        const img = new Image();
        
        const cleanup = () => {
            clearTimeout(timeoutId);
            img.onload = null;
            img.onerror = null;
        };
        
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error(`Image load timeout: ${src}`));
        }, timeout);
        
        img.onload = () => {
            cleanup();
            resolve(img);
        };
        
        img.onerror = () => {
            cleanup();
            reject(new Error(`Failed to load image: ${src}`));
        };
        
        img.src = src;
    });
}

/**
 * Create safe CSS selector from string
 * @param {string} str - String to convert
 * @returns {string} Safe CSS selector
 */
function createSafeSelector(str) {
    if (!str || typeof str !== 'string') {
        return 'unknown';
    }
    
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-') || 'unknown';
}

/**
 * Get element's computed style property
 * @param {Element} element - Element to check
 * @param {string} property - CSS property name
 * @returns {string} Property value
 */
function getComputedStyleProperty(element, property) {
    try {
        if (!element || !property) {
            return '';
        }
        
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.getPropertyValue(property) || '';
        
    } catch (error) {
        console.error('Error getting computed style:', error);
        return '';
    }
}

/**
 * Check if device supports touch
 * @returns {boolean} Supports touch
 */
function supportsTouchEvents() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device type based on screen size and capabilities
 * @returns {string} Device type
 */
function getDeviceType() {
    const width = window.innerWidth;
    
    if (supportsTouchEvents()) {
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop-touch';
    }
    
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                break;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

/**
 * Create announcement for screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Announcement priority (polite, assertive)
 */
function announceToScreenReader(message, priority = 'polite') {
    try {
        if (!message) return;
        
        let announcer = document.getElementById('screen-reader-announcer');
        
        if (!announcer) {
            announcer = safeCreateElement('div', {
                attributes: {
                    id: 'screen-reader-announcer',
                    'aria-live': priority,
                    'aria-atomic': 'true'
                },
                className: 'sr-only',
                styles: {
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }
            });
            
            if (announcer) {
                document.body.appendChild(announcer);
            }
        }
        
        if (announcer) {
            // Clear and set new message
            announcer.textContent = '';
            setTimeout(() => {
                announcer.textContent = message;
            }, 100);
            
            // Clear after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error announcing to screen reader:', error);
    }
}

/**
 * Storage utilities with error handling
 */
const storage = {
    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            if (!key || typeof key !== 'string') {
                return defaultValue;
            }
            
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
            
        } catch (error) {
            console.warn(`Error getting localStorage item "${key}":`, error);
            return defaultValue;
        }
    },
    
    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success
     */
    set(key, value) {
        try {
            if (!key || typeof key !== 'string') {
                return false;
            }
            
            localStorage.setItem(key, JSON.stringify(value));
            return true;
            
        } catch (error) {
            console.warn(`Error setting localStorage item "${key}":`, error);
            return false;
        }
    },
    
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success
     */
    remove(key) {
        try {
            if (!key || typeof key !== 'string') {
                return false;
            }
            
            localStorage.removeItem(key);
            return true;
            
        } catch (error) {
            console.warn(`Error removing localStorage item "${key}":`, error);
            return false;
        }
    },
    
    /**
     * Clear all localStorage
     * @returns {boolean} Success
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Export utilities to global scope
if (typeof window !== 'undefined') {
    // Performance utilities
    window.debounce = debounce;
    window.throttle = throttle;
    window.rafBatch = rafBatch;
    
    // DOM utilities
    window.safeQuerySelector = safeQuerySelector;
    window.safeQuerySelectorAll = safeQuerySelectorAll;
    window.safeCreateElement = safeCreateElement;
    window.safeAddEventListener = safeAddEventListener;
    window.waitForDOM = waitForDOM;
    window.waitForElement = waitForElement;
    
    // Object utilities
    window.validateObject = validateObject;
    window.deepMerge = deepMerge;
    window.isObject = isObject;
    window.generateId = generateId;
    
    // Helper utilities
    window.formatBytes = formatBytes;
    window.copyToClipboard = copyToClipboard;
    window.animateElement = animateElement;
    window.isElementVisible = isElementVisible;
    window.smoothScrollTo = smoothScrollTo;
    window.loadImage = loadImage;
    window.createSafeSelector = createSafeSelector;
    window.getComputedStyleProperty = getComputedStyleProperty;
    window.supportsTouchEvents = supportsTouchEvents;
    window.getDeviceType = getDeviceType;
    window.retryWithBackoff = retryWithBackoff;
    window.announceToScreenReader = announceToScreenReader;
    
    // Storage utilities
    window.storage = storage;
}