/**
 * utils.js - Enhanced Secure Utility Functions and Performance Helpers
 * Common utilities with comprehensive security features and defensive programming
 */

// Security context for utility functions
const SecurityContext = {
    rateLimiters: new Map(),
    securityLog: [],
    trustedDomains: new Set(['cdn.jsdelivr.net', 'cdnjs.cloudflare.com']),
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
        
        console.warn('🔒 Security Event in Utils:', event);
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
 * @param {string} prefix - ID prefix
 * @returns {string} Secure unique ID
 */
function generateSecureId(prefix = 'id') {
    try {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(16);
            window.crypto.getRandomValues(array);
            const random = Array.from(array, byte => byte.toString(36)).join('');
            return `${prefix}-${Date.now().toString(36)}-${random}`;
        } else {
            // Fallback for environments without crypto
            return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 16)}`;
        }
    } catch (error) {
        console.warn('Error generating secure ID, using fallback:', error);
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 16)}`;
    }
}

/**
 * Sanitize log details to prevent log injection
 * @param {Object} details - Details to sanitize
 * @returns {Object} Sanitized details
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

/**
 * Enhanced debounce function with security validation
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
function secureDebounce(func, wait, immediate = false) {
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
                    console.error('Error in secure debounced function:', error);
                    SecurityContext.logSecurityEvent('debounced_function_error', { error: error.message });
                    if (window.globalErrorBoundary) {
                        window.globalErrorBoundary.handleError(error, { context: 'secure_debounced_function' });
                    }
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
                console.error('Error in immediate secure debounced function:', error);
                SecurityContext.logSecurityEvent('immediate_debounced_function_error', { error: error.message });
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'immediate_secure_debounced_function' });
                }
            }
        }
    };
}

/**
 * Enhanced throttle function with security validation
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function secureThrottle(func, limit) {
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
                console.error('Error in secure throttled function:', error);
                SecurityContext.logSecurityEvent('throttled_function_error', { error: error.message });
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { context: 'secure_throttled_function' });
                }
            }
            inThrottle = true;
            setTimeout(() => inThrottle = false, Math.min(Math.max(limit, 1), 10000));
        }
        return lastResult;
    };
}

/**
 * Enhanced RAF batch utility with security
 * @param {Function} callback - Function to execute
 */
function secureRafBatch(callback) {
    if (typeof callback !== 'function') {
        SecurityContext.logSecurityEvent('invalid_raf_callback', { callbackType: typeof callback });
        return;
    }
    
    if (!SecurityContext.checkRateLimit('raf_batch', 100, 1000)) {
        console.warn('🚫 RAF batch rate limit exceeded');
        return;
    }
    
    const secureCallback = () => {
        try {
            callback();
        } catch (error) {
            console.error('Error in secure RAF callback:', error);
            SecurityContext.logSecurityEvent('raf_callback_error', { error: error.message });
            if (window.globalErrorBoundary) {
                window.globalErrorBoundary.handleError(error, { context: 'secure_raf_callback' });
            }
        }
    };
    
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        requestAnimationFrame(secureCallback);
    } else {
        setTimeout(secureCallback, 16);
    }
}

/**
 * Enhanced safe DOM element selector with security validation
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null} Found element or null
 */
function secureSafeQuerySelector(selector, parent = document) {
    try {
        if (!SecurityContext.validateInput(selector, 'string')) {
            return null;
        }
        
        if (!selector || selector.length > 500) {
            SecurityContext.logSecurityEvent('invalid_selector', { 
                selector: selector ? selector.substring(0, 100) : 'null',
                length: selector ? selector.length : 0
            });
            return null;
        }
        
        // Check for dangerous selectors
        const dangerousPatterns = [
            /javascript:/gi,
            /expression\s*\(/gi,
            /url\s*\(/gi,
            /@import/gi
        ];
        
        const isDangerous = dangerousPatterns.some(pattern => pattern.test(selector));
        if (isDangerous) {
            SecurityContext.logSecurityEvent('dangerous_selector_blocked', { selector: selector.substring(0, 100) });
            return null;
        }
        
        if (!parent || typeof parent.querySelector !== 'function') {
            SecurityContext.logSecurityEvent('invalid_parent_element', { parentType: typeof parent });
            return null;
        }
        
        const element = parent.querySelector(selector);
        return element;
        
    } catch (error) {
        console.error('Error in secure safeQuerySelector:', error);
        SecurityContext.logSecurityEvent('query_selector_error', { 
            error: error.message,
            selector: selector ? selector.substring(0, 100) : 'unknown'
        });
        return null;
    }
}

/**
 * Enhanced safe DOM element selector for multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList|Array} Found elements or empty array
 */
function secureSafeQuerySelectorAll(selector, parent = document) {
    try {
        if (!SecurityContext.validateInput(selector, 'string')) {
            return [];
        }
        
        if (!selector || selector.length > 500) {
            SecurityContext.logSecurityEvent('invalid_selector_all', { 
                selector: selector ? selector.substring(0, 100) : 'null',
                length: selector ? selector.length : 0
            });
            return [];
        }
        
        if (!parent || typeof parent.querySelectorAll !== 'function') {
            SecurityContext.logSecurityEvent('invalid_parent_element_all', { parentType: typeof parent });
            return [];
        }
        
        const elements = parent.querySelectorAll(selector);
        
        // Limit number of returned elements to prevent DoS
        if (elements.length > 1000) {
            SecurityContext.logSecurityEvent('excessive_elements_found', { count: elements.length });
            return Array.from(elements).slice(0, 1000);
        }
        
        return elements;
        
    } catch (error) {
        console.error('Error in secure safeQuerySelectorAll:', error);
        SecurityContext.logSecurityEvent('query_selector_all_error', { 
            error: error.message,
            selector: selector ? selector.substring(0, 100) : 'unknown'
        });
        return [];
    }
}

/**
 * Enhanced safe element creation with comprehensive security validation
 * @param {string} tagName - HTML tag name
 * @param {Object} options - Element options
 * @returns {Element|null} Created element or null
 */
function secureSafeCreateElement(tagName, options = {}) {
    try {
        if (!SecurityContext.validateInput(tagName, 'string')) {
            return null;
        }
        
        // Whitelist of allowed tag names
        const allowedTags = [
            'div', 'span', 'p', 'a', 'button', 'input', 'textarea', 'label',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
            'img', 'canvas', 'svg', 'path', 'circle', 'rect',
            'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
            'form', 'fieldset', 'legend', 'select', 'option',
            'article', 'section', 'nav', 'header', 'footer', 'main',
            'aside', 'figure', 'figcaption', 'details', 'summary'
        ];
        
        if (!allowedTags.includes(tagName.toLowerCase())) {
            SecurityContext.logSecurityEvent('disallowed_tag_blocked', { tagName });
            return null;
        }
        
        const element = document.createElement(tagName);
        
        // Secure attribute setting
        if (options.attributes) {
            const allowedAttributes = [
                'id', 'class', 'data-*', 'aria-*', 'role', 'title',
                'alt', 'src', 'href', 'target', 'type', 'value',
                'placeholder', 'disabled', 'readonly', 'required',
                'width', 'height', 'style'
            ];
            
            Object.entries(options.attributes).forEach(([key, value]) => {
                try {
                    // Validate attribute name
                    const isAllowed = allowedAttributes.some(allowed => {
                        if (allowed.endsWith('*')) {
                            return key.startsWith(allowed.slice(0, -1));
                        }
                        return key === allowed;
                    });
                    
                    if (!isAllowed) {
                        SecurityContext.logSecurityEvent('disallowed_attribute_blocked', { key, tagName });
                        return;
                    }
                    
                    // Validate attribute value
                    if (!SecurityContext.validateInput(String(value), 'string')) {
                        return;
                    }
                    
                    // Special validation for specific attributes
                    if (key === 'src' || key === 'href') {
                        if (!validateURL(String(value))) {
                            SecurityContext.logSecurityEvent('invalid_url_blocked', { key, value: String(value).substring(0, 100) });
                            return;
                        }
                    }
                    
                    element.setAttribute(key, String(value));
                } catch (error) {
                    console.warn(`Failed to set secure attribute ${key}:`, error);
                    SecurityContext.logSecurityEvent('attribute_setting_error', { key, error: error.message });
                }
            });
        }
        
        // Secure property setting
        if (options.properties) {
            const allowedProperties = [
                'textContent', 'className', 'id', 'title',
                'disabled', 'checked', 'selected', 'value'
            ];
            
            Object.entries(options.properties).forEach(([key, value]) => {
                try {
                    if (!allowedProperties.includes(key)) {
                        SecurityContext.logSecurityEvent('disallowed_property_blocked', { key, tagName });
                        return;
                    }
                    
                    element[key] = value;
                } catch (error) {
                    console.warn(`Failed to set secure property ${key}:`, error);
                    SecurityContext.logSecurityEvent('property_setting_error', { key, error: error.message });
                }
            });
        }
        
        // Secure text content setting
        if (options.textContent) {
            if (SecurityContext.validateInput(options.textContent, 'string')) {
                element.textContent = String(options.textContent).substring(0, 10000); // Limit length
            }
        }
        
        // Secure HTML content setting (very restricted)
        if (options.innerHTML && tagName.toLowerCase() !== 'script') {
            const sanitizedHTML = sanitizeHTML(String(options.innerHTML));
            if (sanitizedHTML) {
                element.innerHTML = sanitizedHTML;
            }
        }
        
        // Secure class setting
        if (options.className) {
            if (typeof options.className === 'string') {
                const safeClassName = sanitizeClassName(options.className);
                if (safeClassName) {
                    element.className = safeClassName;
                }
            } else if (Array.isArray(options.className)) {
                const safeClasses = options.className
                    .map(cls => sanitizeClassName(String(cls)))
                    .filter(cls => cls);
                element.classList.add(...safeClasses);
            }
        }
        
        // Secure style setting
        if (options.styles) {
            Object.entries(options.styles).forEach(([key, value]) => {
                try {
                    if (validateCSSProperty(key, String(value))) {
                        element.style[key] = String(value);
                    }
                } catch (error) {
                    console.warn(`Failed to set secure style ${key}:`, error);
                    SecurityContext.logSecurityEvent('style_setting_error', { key, error: error.message });
                }
            });
        }
        
        return element;
        
    } catch (error) {
        console.error('Error in secure safeCreateElement:', error);
        SecurityContext.logSecurityEvent('element_creation_error', { 
            tagName: tagName || 'unknown',
            error: error.message 
        });
        return null;
    }
}

/**
 * Validate URL for security
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid and safe
 */
function validateURL(url) {
    try {
        if (!url || typeof url !== 'string') return false;
        
        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'vbscript:', 'data:text/html', 'file:'];
        const lowerUrl = url.toLowerCase();
        
        if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
            return false;
        }
        
        // Allow relative URLs, data: for images, and standard web protocols
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            return true;
        }
        
        if (url.startsWith('data:image/')) {
            return true;
        }
        
        if (url.startsWith('blob:')) {
            return true;
        }
        
        // Validate absolute URLs
        const urlObj = new URL(url);
        const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
        
        if (!allowedProtocols.includes(urlObj.protocol)) {
            return false;
        }
        
        // Check against trusted domains for external resources
        if (urlObj.protocol === 'https:' && !SecurityContext.trustedDomains.has(urlObj.hostname)) {
            SecurityContext.logSecurityEvent('untrusted_domain_blocked', { 
                hostname: urlObj.hostname,
                url: url.substring(0, 100)
            });
        }
        
        return true;
        
    } catch (error) {
        SecurityContext.logSecurityEvent('url_validation_error', { 
            url: url ? url.substring(0, 100) : 'null',
            error: error.message 
        });
        return false;
    }
}

/**
 * Sanitize HTML content
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';
    
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/vbscript:/gi, '') // Remove vbscript: URLs
        .replace(/data:text\/html/gi, 'data:text/plain') // Neutralize data URLs
        .replace(/<iframe\b[^>]*>/gi, '') // Remove iframe tags
        .replace(/<object\b[^>]*>/gi, '') // Remove object tags
        .replace(/<embed\b[^>]*>/gi, '') // Remove embed tags
        .substring(0, 50000); // Limit length
}

/**
 * Sanitize CSS class name
 * @param {string} className - Class name to sanitize
 * @returns {string} Sanitized class name
 */
function sanitizeClassName(className) {
    if (!className || typeof className !== 'string') return '';
    
    return className
        .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Allow only safe characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 200); // Limit length
}

/**
 * Validate CSS property for security
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @returns {boolean} Is valid and safe
 */
function validateCSSProperty(property, value) {
    if (!property || !value || typeof property !== 'string' || typeof value !== 'string') {
        return false;
    }
    
    // Block dangerous CSS
    const dangerousPatterns = [
        /javascript:/gi,
        /vbscript:/gi,
        /expression\s*\(/gi,
        /@import/gi,
        /url\s*\(\s*javascript:/gi,
        /url\s*\(\s*vbscript:/gi,
        /url\s*\(\s*data:text\/html/gi
    ];
    
    const isDangerous = dangerousPatterns.some(pattern => 
        pattern.test(property) || pattern.test(value)
    );
    
    if (isDangerous) {
        SecurityContext.logSecurityEvent('dangerous_css_blocked', { 
            property: property.substring(0, 50),
            value: value.substring(0, 100)
        });
        return false;
    }
    
    return true;
}

/**
 * Enhanced safe event listener addition with comprehensive security
 * @param {Element} element - Element to add listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
function secureSafeAddEventListener(element, event, handler, options = {}) {
    try {
        if (!element || typeof element.addEventListener !== 'function') {
            SecurityContext.logSecurityEvent('invalid_event_element', { elementType: typeof element });
            return () => {};
        }
        
        if (!SecurityContext.validateInput(event, 'string')) {
            return () => {};
        }
        
        if (typeof handler !== 'function') {
            SecurityContext.logSecurityEvent('invalid_event_handler', { handlerType: typeof handler });
            return () => {};
        }
        
        // Rate limit event listener creation
        if (!SecurityContext.checkRateLimit('event_listener_creation', 100, 10000)) {
            console.warn('🚫 Event listener creation rate limit exceeded');
            return () => {};
        }
        
        // Whitelist allowed events
        const allowedEvents = [
            'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
            'mousemove', 'mouseenter', 'mouseleave', 'contextmenu',
            'keydown', 'keyup', 'keypress',
            'focus', 'blur', 'focusin', 'focusout',
            'input', 'change', 'submit', 'reset',
            'load', 'unload', 'resize', 'scroll',
            'touchstart', 'touchend', 'touchmove', 'touchcancel',
            'dragstart', 'dragend', 'dragover', 'drop',
            'animationend', 'transitionend'
        ];
        
        if (!allowedEvents.includes(event.toLowerCase())) {
            SecurityContext.logSecurityEvent('disallowed_event_blocked', { event });
            return () => {};
        }
        
        // Create secure wrapper for event handler
        let callCount = 0;
        const maxCalls = 10000; // Prevent excessive calls
        
        const secureWrapper = function(e) {
            callCount++;
            
            if (callCount > maxCalls) {
                SecurityContext.logSecurityEvent('event_handler_call_limit_exceeded', { 
                    event,
                    callCount,
                    element: element.tagName || 'unknown'
                });
                return;
            }
            
            // Validate event object
            if (!e || typeof e !== 'object') {
                SecurityContext.logSecurityEvent('invalid_event_object', { event });
                return;
            }
            
            // Check if event is trusted (user-initiated)
            if (e.isTrusted === false) {
                SecurityContext.logSecurityEvent('untrusted_event_blocked', { 
                    event,
                    element: element.tagName || 'unknown'
                });
                return;
            }
            
            try {
                return handler.call(this, e);
            } catch (error) {
                console.error(`Error in secure event handler for ${event}:`, error);
                SecurityContext.logSecurityEvent('event_handler_error', { 
                    event,
                    error: error.message,
                    element: element.tagName || 'unknown'
                });
                
                if (window.globalErrorBoundary) {
                    window.globalErrorBoundary.handleError(error, { 
                        context: 'secure_event_handler',
                        event,
                        element: element.tagName || 'unknown'
                    });
                }
            }
        };
        
        element.addEventListener(event, secureWrapper, options);
        
        // Return secure cleanup function
        return () => {
            try {
                element.removeEventListener(event, secureWrapper, options);
            } catch (error) {
                console.warn('Error removing secure event listener:', error);
                SecurityContext.logSecurityEvent('event_listener_removal_error', { 
                    event,
                    error: error.message 
                });
            }
        };
        
    } catch (error) {
        console.error('Error in secure safeAddEventListener:', error);
        SecurityContext.logSecurityEvent('event_listener_creation_error', { 
            event: event || 'unknown',
            error: error.message 
        });
        return () => {};
    }
}

/**
 * Enhanced secure clipboard operations
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success
 */
async function secureCopyToClipboard(text) {
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
            console.log('✅ Text copied to clipboard securely');
            return true;
        } else {
            return secureBackupCopyTextToClipboard(sanitizedText);
        }
    } catch (error) {
        console.error('Failed to copy text securely:', error);
        SecurityContext.logSecurityEvent('clipboard_copy_error', { error: error.message });
        return secureBackupCopyTextToClipboard(text);
    }
}

/**
 * Secure fallback clipboard copy method
 * @param {string} text - Text to copy
 * @returns {boolean} Success
 */
function secureBackupCopyTextToClipboard(text) {
    try {
        const textArea = secureSafeCreateElement('textarea', {
            properties: { value: String(text) },
            styles: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '2em',
                height: '2em',
                padding: '0',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
                zIndex: '-1000'
            }
        });
        
        if (!textArea) {
            SecurityContext.logSecurityEvent('backup_copy_element_creation_failed');
            return false;
        }
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            console.log('✅ Text copied to clipboard (secure fallback)');
        } else {
            console.warn('❌ Secure fallback copy failed');
        }
        
        return successful;
        
    } catch (error) {
        console.error('Error in secure backup copy:', error);
        SecurityContext.logSecurityEvent('backup_copy_error', { error: error.message });
        return false;
    }
}

/**
 * Enhanced secure storage utilities with encryption support
 */
const secureStorage = {
    encryptionKey: null,
    maxValueSize: 1000000, // 1MB limit
    
    // Initialize encryption if available
    initializeEncryption() {
        if (window.crypto && window.crypto.subtle) {
            try {
                // Generate a simple key for basic obfuscation
                const keyMaterial = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                this.encryptionKey = keyMaterial;
            } catch (error) {
                console.warn('Storage encryption initialization failed:', error);
            }
        }
    },
    
    // Simple obfuscation (not true encryption, but better than plain text)
    obfuscate(text) {
        if (!this.encryptionKey || !text) return text;
        
        try {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(char ^ keyChar);
            }
            return btoa(result); // Base64 encode
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
    
    /**
     * Secure get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
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
                const deobfuscated = this.deobfuscate(item);
                return JSON.parse(deobfuscated);
            } catch (parseError) {
                // Try parsing without deobfuscation (backward compatibility)
                return JSON.parse(item);
            }
            
        } catch (error) {
            console.warn(`Error getting secure localStorage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_get_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return defaultValue;
        }
    },
    
    /**
     * Secure set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success
     */
    set(key, value) {
        try {
            if (!SecurityContext.validateInput(key, 'string')) {
                return false;
            }
            
            if (!SecurityContext.checkRateLimit('storage_set', 50, 10000)) {
                console.warn('🚫 Storage set rate limit exceeded');
                return false;
            }
            
            const serialized = JSON.stringify(value);
            
            if (serialized.length > this.maxValueSize) {
                SecurityContext.logSecurityEvent('storage_value_too_large', { 
                    key: key.substring(0, 50),
                    size: serialized.length 
                });
                return false;
            }
            
            const obfuscated = this.obfuscate(serialized);
            localStorage.setItem(key, obfuscated);
            return true;
            
        } catch (error) {
            console.warn(`Error setting secure localStorage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_set_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return false;
        }
    },
    
    /**
     * Secure remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success
     */
    remove(key) {
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
            console.warn(`Error removing secure localStorage item "${key}":`, error);
            SecurityContext.logSecurityEvent('storage_remove_error', { 
                key: key.substring(0, 50),
                error: error.message 
            });
            return false;
        }
    },
    
    /**
     * Secure clear all localStorage
     * @returns {boolean} Success
     */
    clear() {
        try {
            if (!SecurityContext.checkRateLimit('storage_clear', 5, 60000)) {
                console.warn('🚫 Storage clear rate limit exceeded');
                return false;
            }
            
            localStorage.clear();
            SecurityContext.logSecurityEvent('storage_cleared');
            return true;
        } catch (error) {
            console.warn('Error clearing secure localStorage:', error);
            SecurityContext.logSecurityEvent('storage_clear_error', { error: error.message });
            return false;
        }
    }
};

/**
 * Enhanced secure image loading with validation
 * @param {string} src - Image source
 * @param {number} timeout - Load timeout
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
function secureLoadImage(src, timeout = 10000) {
    return new Promise((resolve, reject) => {
        try {
            if (!SecurityContext.validateInput(src, 'string')) {
                reject(new Error('Invalid image source'));
                return;
            }
            
            if (!validateURL(src)) {
                SecurityContext.logSecurityEvent('invalid_image_url_blocked', { src: src.substring(0, 100) });
                reject(new Error('Invalid or unsafe image URL'));
                return;
            }
            
            if (!SecurityContext.checkRateLimit('image_load', 20, 10000)) {
                console.warn('🚫 Image load rate limit exceeded');
                reject(new Error('Image load rate limit exceeded'));
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
                SecurityContext.logSecurityEvent('image_load_timeout', { src: src.substring(0, 100) });
                reject(new Error(`Secure image load timeout: ${src}`));
            }, Math.min(timeout, 30000)); // Max 30s timeout
            
            img.onload = () => {
                cleanup();
                resolve(img);
            };
            
            img.onerror = () => {
                cleanup();
                SecurityContext.logSecurityEvent('image_load_error', { src: src.substring(0, 100) });
                reject(new Error(`Failed to load secure image: ${src}`));
            };
            
            img.src = src;
            
        } catch (error) {
            SecurityContext.logSecurityEvent('image_load_setup_error', { 
                src: src ? src.substring(0, 100) : 'null',
                error: error.message 
            });
            reject(error);
        }
    });
}

/**
 * Enhanced secure smooth scroll with validation
 * @param {Element|string} target - Element or selector
 * @param {Object} options - Scroll options
 */
function secureSmootScrollTo(target, options = {}) {
    try {
        if (!SecurityContext.checkRateLimit('smooth_scroll', 10, 5000)) {
            console.warn('🚫 Smooth scroll rate limit exceeded');
            return;
        }
        
        let element;
        if (typeof target === 'string') {
            element = secureSafeQuerySelector(target);
        } else if (target && typeof target.scrollIntoView === 'function') {
            element = target;
        }
        
        if (!element) {
            SecurityContext.logSecurityEvent('smooth_scroll_element_not_found', { 
                target: typeof target === 'string' ? target.substring(0, 100) : 'unknown'
            });
            return;
        }
        
        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };
        
        // Sanitize options
        const safeOptions = {};
        Object.entries({ ...defaultOptions, ...options }).forEach(([key, value]) => {
            if (['behavior', 'block', 'inline'].includes(key)) {
                safeOptions[key] = value;
            }
        });
        
        element.scrollIntoView(safeOptions);
        
    } catch (error) {
        console.error('Error in secure smooth scroll:', error);
        SecurityContext.logSecurityEvent('smooth_scroll_error', { error: error.message });
    }
}

/**
 * Get security report for utilities
 * @returns {Object} Security report
 */
function getUtilsSecurityReport() {
    return {
        timestamp: new Date().toISOString(),
        securityEvents: SecurityContext.securityLog.slice(-20),
        rateLimitStatus: Object.fromEntries(SecurityContext.rateLimiters),
        trustedDomains: Array.from(SecurityContext.trustedDomains),
        securityContextSize: SecurityContext.securityLog.length
    };
}

// Initialize secure storage encryption
if (typeof window !== 'undefined') {
    secureStorage.initializeEncryption();
}

// Export enhanced secure utilities to global scope
if (typeof window !== 'undefined') {
    // Enhanced secure performance utilities
    window.secureDebounce = secureDebounce;
    window.secureThrottle = secureThrottle;
    window.secureRafBatch = secureRafBatch;
    
    // Enhanced secure DOM utilities
    window.secureSafeQuerySelector = secureSafeQuerySelector;
    window.secureSafeQuerySelectorAll = secureSafeQuerySelectorAll;
    window.secureSafeCreateElement = secureSafeCreateElement;
    window.secureSafeAddEventListener = secureSafeAddEventListener;
    
    // Enhanced secure helper utilities
    window.generateSecureId = generateSecureId;
    window.secureCopyToClipboard = secureCopyToClipboard;
    window.secureLoadImage = secureLoadImage;
    window.secureSmootScrollTo = secureSmootScrollTo;
    window.validateURL = validateURL;
    window.sanitizeHTML = sanitizeHTML;
    window.sanitizeClassName = sanitizeClassName;
    window.validateCSSProperty = validateCSSProperty;
    
    // Enhanced secure storage utilities
    window.secureStorage = secureStorage;
    
    // Security reporting
    window.getUtilsSecurityReport = getUtilsSecurityReport;
    
    // Backward compatibility (wrapped with security)
    window.debounce = secureDebounce;
    window.throttle = secureThrottle;
    window.rafBatch = secureRafBatch;
    window.safeQuerySelector = secureSafeQuerySelector;
    window.safeQuerySelectorAll = secureSafeQuerySelectorAll;
    window.safeCreateElement = secureSafeCreateElement;
    window.safeAddEventListener = secureSafeAddEventListener;
    window.copyToClipboard = secureCopyToClipboard;
    window.loadImage = secureLoadImage;
    window.smoothScrollTo = secureSmootScrollTo;
    window.storage = secureStorage;
    window.generateId = generateSecureId;
}