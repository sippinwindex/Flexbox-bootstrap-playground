/**
 * Enhanced Secure Utility Functions - Compatible with existing platform
 * Combines basic utilities with advanced security features
 */

// Security context for utility functions
const SecurityContext = {
    rateLimiters: new Map(),
    securityLog: [],
    trustedDomains: new Set(['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'vercel.app']),
    suspiciousPatterns: [
        /javascript:/gi,
        /vbscript:/gi,
        /data:text\/html/gi,
        /<script/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /Function\s*\(/gi
    ],
    maxLogSize: 100,
    
    // Log security events
    logSecurityEvent(type, details) {
        const event = {
            id: generateSecureId(),
            type,
            timestamp: new Date().toISOString(),
            details: sanitizeLogDetails(details),
            userAgent: navigator.userAgent.substring(0, 100),
            url: window.location.href
        };
        
        this.securityLog.push(event);
        
        if (this.securityLog.length > this.maxLogSize) {
            this.securityLog.splice(0, 50);
        }
        
        if (window.devMode) {
            console.warn('🔒 Security Event:', event);
        }
    },
    
    // Check rate limits
    checkRateLimit(key, limit = 10, window = 1000) {
        const now = Date.now();
        
        if (!this.rateLimiters.has(key)) {
            this.rateLimiters.set(key, []);
        }
        
        const timestamps = this.rateLimiters.get(key);
        
        // Remove old timestamps
        while (timestamps.length > 0 && timestamps[0] < now - window) {
            timestamps.shift();
        }
        
        if (timestamps.length >= limit) {
            this.logSecurityEvent('rate_limit_exceeded', { key, limit, window });
            return false;
        }
        
        timestamps.push(now);
        return true;
    },
    
    // Validate input for security
    validateInput(input, type = 'string') {
        if (typeof input !== type) {
            this.logSecurityEvent('invalid_input_type', { expected: type, received: typeof input });
            return false;
        }
        
        if (type === 'string') {
            const hasSuspiciousPattern = this.suspiciousPatterns.some(pattern => pattern.test(input));
            if (hasSuspiciousPattern) {
                this.logSecurityEvent('suspicious_pattern_detected', { input: input.substring(0, 100) });
                return false;
            }
        }
        
        return true;
    }
};

/**
 * Generate secure ID with crypto random values
 */
function generateSecureId(prefix = 'id') {
    try {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(16);
            window.crypto.getRandomValues(array);
            const random = Array.from(array, byte => byte.toString(36)).join('');
            return `${prefix}-${Date.now().toString(36)}-${random}`;
        } else {
            return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 16)}`;
        }
    } catch (error) {
        console.warn('Error generating secure ID, using fallback:', error);
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 16)}`;
    }
}

/**
 * Sanitize log details to prevent log injection
 */
function sanitizeLogDetails(details) {
    if (!details || typeof details !== 'object') return {};
    
    const sanitized = {};
    Object.entries(details).forEach(([key, value]) => {
        if (typeof value === 'string') {
            sanitized[key] = value
                .substring(0, 200)
                .replace(/[\r\n\t]/g, ' ')
                .replace(/[<>'"]/g, '');
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitized[key] = value;
        } else {
            sanitized[key] = '[object]';
        }
    });
    
    return sanitized;
}

// Scroll to top functionality with security
function scrollToTop() {
    try {
        if (!SecurityContext.checkRateLimit('scroll_to_top', 5, 5000)) {
            console.warn('🚫 Scroll to top rate limit exceeded');
            return;
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Scroll to top error:', error);
        SecurityContext.logSecurityEvent('scroll_to_top_error', { error: error.message });
    }
}

// Enhanced debounce function with security validation
function debounce(func, wait, immediate = false) {
    if (typeof func !== 'function') {
        SecurityContext.logSecurityEvent('invalid_debounce_function', { funcType: typeof func });
        return () => {};
    }
    
    if (!SecurityContext.checkRateLimit('debounce_creation', 50, 10000)) {
        console.warn('🚫 Debounce creation rate limit exceeded');
        return () => {};
    }
    
    let timeout;
    let callCount = 0;
    const maxCalls = 1000; // Prevent infinite execution
    
    return function executedFunction(...args) {
        callCount++;
        
        if (callCount > maxCalls) {
            SecurityContext.logSecurityEvent('debounce_call_limit_exceeded', { callCount });
            return;
        }
        
        const later = () => {
            timeout = null;
            if (!immediate) {
                try {
                    func.apply(this, args);
                } catch (error) {
                    console.error('Error in debounced function:', error);
                    SecurityContext.logSecurityEvent('debounced_function_error', { error: error.message });
                }
            }
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, Math.min(Math.max(wait, 1), 10000)); // Limit wait time
        
        if (callNow) {
            try {
                func.apply(this, args);
            } catch (error) {
                console.error('Error in immediate debounced function:', error);
                SecurityContext.logSecurityEvent('immediate_debounced_function_error', { error: error.message });
            }
        }
    };
}

// Enhanced throttle function with security validation
function throttle(func, limit) {
    if (typeof func !== 'function') {
        SecurityContext.logSecurityEvent('invalid_throttle_function', { funcType: typeof func });
        return () => {};
    }
    
    if (!SecurityContext.checkRateLimit('throttle_creation', 50, 10000)) {
        console.warn('🚫 Throttle creation rate limit exceeded');
        return () => {};
    }
    
    let inThrottle;
    let lastResult;
    let callCount = 0;
    const maxCalls = 1000;
    
    return function(...args) {
        callCount++;
        
        if (callCount > maxCalls) {
            SecurityContext.logSecurityEvent('throttle_call_limit_exceeded', { callCount });
            return lastResult;
        }
        
        if (!inThrottle) {
            try {
                lastResult = func.apply(this, args);
            } catch (error) {
                console.error('Error in throttled function:', error);
                SecurityContext.logSecurityEvent('throttled_function_error', { error: error.message });
            }
            inThrottle = true;
            setTimeout(() => inThrottle = false, Math.min(Math.max(limit, 1), 10000));
        }
        return lastResult;
    };
}

// Download blob as file
function downloadBlob(blob, filename) {
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
    }
}

// Enhanced secure clipboard operations
async function copyToClipboard(text) {
    try {
        if (!SecurityContext.validateInput(text, 'string')) {
            return false;
        }
        
        if (!SecurityContext.checkRateLimit('clipboard_copy', 10, 60000)) {
            console.warn('🚫 Clipboard copy rate limit exceeded');
            return false;
        }
        
        // Limit text length
        const sanitizedText = String(text).substring(0, 100000);
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(sanitizedText);
            return true;
        } else {
            // Secure fallback
            const textArea = document.createElement('textarea');
            textArea.value = sanitizedText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        }
    } catch (error) {
        console.error('Copy to clipboard error:', error);
        SecurityContext.logSecurityEvent('clipboard_copy_error', { error: error.message });
        return false;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Unescape HTML
function unescapeHtml(safe) {
    return safe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

// Check if element is visible
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get element offset from top of page
function getElementOffset(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
}

// Add CSS class with animation support
function addClass(element, className, animationDuration = 300) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
        if (animationDuration > 0) {
            element.style.transition = `all ${animationDuration}ms ease`;
        }
    }
}

// Remove CSS class with animation support
function removeClass(element, className, animationDuration = 300) {
    if (element.classList.contains(className)) {
        if (animationDuration > 0) {
            element.style.transition = `all ${animationDuration}ms ease`;
            setTimeout(() => {
                element.classList.remove(className);
            }, animationDuration);
        } else {
            element.classList.remove(className);
        }
    }
}

// Toggle CSS class with animation support
function toggleClass(element, className, animationDuration = 300) {
    if (element.classList.contains(className)) {
        removeClass(element, className, animationDuration);
    } else {
        addClass(element, className, animationDuration);
    }
}

// Parse query string
function parseQueryString(queryString = window.location.search) {
    const params = {};
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

// Update URL without page reload
function updateURL(params, replaceState = false) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    
    if (replaceState) {
        window.history.replaceState({}, '', url);
    } else {
        window.history.pushState({}, '', url);
    }
}

// Wait for element to exist
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// Simple event emitter
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error('Event listener error:', error);
            }
        });
    }
}

// Enhanced secure storage utilities
const storage = {
    encryptionKey: null,
    maxValueSize: 1000000, // 1MB limit
    
    // Initialize encryption if available
    initializeEncryption() {
        if (window.crypto && window.crypto.getRandomValues) {
            try {
                const keyMaterial = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                this.encryptionKey = keyMaterial;
            } catch (error) {
                console.warn('Storage encryption initialization failed:', error);
            }
        }
    },
    
    // Simple obfuscation
    obfuscate(text) {
        if (!this.encryptionKey || !text) return text;
        
        try {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(char ^ keyChar);
            }
            return btoa(result);
        } catch (error) {
            console.warn('Storage obfuscation failed:', error);
            return text;
        }
    },
    
    // Simple deobfuscation
    deobfuscate(obfuscatedText) {
        if (!this.encryptionKey || !obfuscatedText) return obfuscatedText;
        
        try {
            const decoded = atob(obfuscatedText);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const char = decoded.charCodeAt(i);
                const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(char ^ keyChar);
            }
            return result;
        } catch (error) {
            console.warn('Storage deobfuscation failed:', error);
            return obfuscatedText;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            if (!SecurityContext.validateInput(key, 'string')) {
                return defaultValue;
            }
            
            if (!SecurityContext.checkRateLimit('storage_get', 100, 10000)) {
                console.warn('🚫 Storage get rate limit exceeded');
                return defaultValue;
            }
            
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            try {
                const deobfuscated = storage.deobfuscate(item);
                return JSON.parse(deobfuscated);
            } catch (parseError) {
                // Try parsing without deobfuscation (backward compatibility)
                return JSON.parse(item);
            }
            
        } catch (error) {
            console.warn(`Error getting storage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_get_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            if (!SecurityContext.validateInput(key, 'string')) {
                return false;
            }
            
            if (!SecurityContext.checkRateLimit('storage_set', 50, 10000)) {
                console.warn('🚫 Storage set rate limit exceeded');
                return false;
            }
            
            const serialized = JSON.stringify(value);
            
            if (serialized.length > storage.maxValueSize) {
                SecurityContext.logSecurityEvent('storage_value_too_large', { 
                    key: key.substring(0, 50),
                    size: serialized.length 
                });
                return false;
            }
            
            const obfuscated = storage.obfuscate(serialized);
            localStorage.setItem(key, obfuscated);
            return true;
            
        } catch (error) {
            console.warn(`Error setting storage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_set_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return false;
        }
    },
    
    remove: (key) => {
        try {
            if (!SecurityContext.validateInput(key, 'string')) {
                return false;
            }
            
            if (!SecurityContext.checkRateLimit('storage_remove', 50, 10000)) {
                console.warn('🚫 Storage remove rate limit exceeded');
                return false;
            }
            
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing storage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_remove_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return false;
        }
    },
    
    clear: () => {
        try {
            if (!SecurityContext.checkRateLimit('storage_clear', 5, 60000)) {
                console.warn('🚫 Storage clear rate limit exceeded');
                return false;
            }
            
            localStorage.clear();
            SecurityContext.logSecurityEvent('storage_cleared');
            return true;
        } catch (error) {
            console.warn('Error clearing storage:', error);
            SecurityContext.logSecurityEvent('storage_clear_error', { error: error.message });
            return false;
        }
    }
};

// Progress tracking utility
function updateProgress() {
    try {
        const progressIndicator = document.getElementById('progress-indicator');
        if (!progressIndicator) return;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressIndicator.style.width = Math.min(scrolled, 100) + '%';
    } catch (error) {
        console.error('Update progress error:', error);
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    try {
        const backToTopBtn = document.getElementById('back-to-top');
        
        const scrollHandler = throttle(() => {
            try {
                updateProgress();
                
                if (backToTopBtn) {
                    if (window.scrollY > 300) {
                        backToTopBtn.classList.add('show');
                    } else {
                        backToTopBtn.classList.remove('show');
                    }
                }
            } catch (error) {
                console.error('Scroll handler error:', error);
            }
        }, 16); // ~60fps
        
        window.addEventListener('scroll', scrollHandler);
        
    } catch (error) {
        console.error('Initialize scroll effects error:', error);
    }
}

// Initialize navigation
function initializeNavigation() {
    try {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                try {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } catch (error) {
                    console.error('Anchor navigation error:', error);
                }
            });
        });
    } catch (error) {
        console.error('Initialize navigation error:', error);
    }
}

// Error handling wrapper
function safeExecute(fn, fallback = null) {
    try {
        return fn();
    } catch (error) {
        console.error('Safe execute error:', error);
        return fallback;
    }
}

// Export enhanced utilities for use in other scripts with backward compatibility
window.Utils = {
    // Core utilities (enhanced with security)
    scrollToTop,
    debounce,
    throttle,
    downloadBlob,
    copyToClipboard,
    formatFileSize,
    generateUUID,
    escapeHtml,
    unescapeHtml,
    isElementVisible,
    getElementOffset,
    addClass,
    removeClass,
    toggleClass,
    parseQueryString,
    updateURL,
    waitForElement,
    EventEmitter,
    storage,
    updateProgress,
    initializeScrollEffects,
    initializeNavigation,
    safeExecute,
    
    // Enhanced secure utilities
    generateSecureId,
    SecurityContext,
    
    // Security utilities for advanced use
    validateInput: SecurityContext.validateInput.bind(SecurityContext),
    checkRateLimit: SecurityContext.checkRateLimit.bind(SecurityContext),
    getSecurityReport: () => ({
        timestamp: new Date().toISOString(),
        securityEvents: SecurityContext.securityLog.slice(-20),
        rateLimitStatus: Object.fromEntries(SecurityContext.rateLimiters),
        trustedDomains: Array.from(SecurityContext.trustedDomains)
    })
};

// Initialize secure storage encryption
if (typeof window !== 'undefined') {
    storage.initializeEncryption();
    
    // Set development mode flag for enhanced logging
    window.devMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.search.includes('debug=true');
}