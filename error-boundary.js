/**
 * error-boundary.js - Enhanced Global Error Handling and Security Monitoring
 * Comprehensive error handling with security features and threat detection
 */

class EnhancedGlobalErrorBoundary {
    constructor() {
        this.errorLog = [];
        this.securityLog = [];
        this.performanceMetrics = new Map();
        this.maxErrors = 100;
        this.maxSecurityEvents = 50;
        this.suspiciousActivityThreshold = 10;
        this.rateLimiter = new Map();
        
        this.setupErrorHandling();
        this.setupSecurityMonitoring();
        this.notificationContainer = this.createNotificationContainer();
        this.initializeSecurityUtils();
        
        console.log('🛡️ Enhanced Error Boundary initialized with security monitoring');
    }
    
    setupErrorHandling() {
        // Enhanced JavaScript error handling
        window.addEventListener('error', (event) => {
            this.handleError(event.error, {
                type: 'javascript_error',
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                message: event.message,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            });
        });
        
        // Enhanced promise rejection handling
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'unhandled_promise_rejection',
                promise: event.promise,
                timestamp: Date.now()
            });
        });
        
        // Resource loading error handling with security checks
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleResourceError(event);
            }
        }, true);

        // CSP violation detection
        document.addEventListener('securitypolicyviolation', (event) => {
            this.handleSecurityViolation(event);
        });
    }

    setupSecurityMonitoring() {
        // DOM mutation monitoring for security threats
        if (window.MutationObserver) {
            this.mutationObserver = new MutationObserver((mutations) => {
                this.checkDOMMutations(mutations);
            });
            
            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['onclick', 'onload', 'onerror', 'src', 'href']
            });
        }

        // Monitor console for suspicious activity
        this.monitorConsole();

        // Performance monitoring
        this.setupPerformanceMonitoring();

        // Network request monitoring
        this.monitorNetworkRequests();
    }

    initializeSecurityUtils() {
        // Rate limiting for various actions
        this.actionLimits = {
            error_notifications: { max: 20, window: 60000 }, // 20 per minute
            security_violations: { max: 5, window: 30000 },  // 5 per 30 seconds
            dom_mutations: { max: 100, window: 10000 },      // 100 per 10 seconds
            console_warnings: { max: 50, window: 60000 }     // 50 per minute
        };
    }

    // Enhanced error handling with security context
    handleError(error, context = {}) {
        try {
            // Check for rate limiting
            if (!this.checkRateLimit('error_notifications')) {
                return false;
            }

            const errorInfo = {
                id: this.generateSecureId(),
                timestamp: new Date().toISOString(),
                message: this.sanitizeErrorMessage(error?.message || String(error) || 'Unknown error'),
                stack: this.sanitizeStackTrace(error?.stack || 'No stack trace available'),
                context: this.sanitizeContext(context),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: this.getUserId(),
                sessionId: this.getSessionId(),
                severity: this.calculateErrorSeverity(error, context),
                securityRisk: this.assessSecurityRisk(error, context)
            };
            
            // Add to error log with size management
            this.addToErrorLog(errorInfo);
            
            // Enhanced console logging with security context
            if (errorInfo.securityRisk > 0.7) {
                console.error('🚨 High Security Risk Error:', errorInfo);
            } else if (errorInfo.severity === 'critical') {
                console.error('❌ Critical Error:', errorInfo);
            } else {
                console.warn('⚠️ Application Error:', errorInfo);
            }
            
            // Show user notification with enhanced security
            this.showSecureNotification(error, errorInfo);
            
            // Send to monitoring service with security classification
            this.sendToSecureMonitoring(errorInfo);
            
            // Check for attack patterns
            this.analyzeForAttackPatterns(errorInfo);
            
            return true;
            
        } catch (handlerError) {
            console.error('Error in enhanced error handler:', handlerError);
            this.fallbackErrorHandling(error, handlerError);
        }
    }

    // Security violation handling
    handleSecurityViolation(event) {
        if (!this.checkRateLimit('security_violations')) {
            return;
        }

        const violationInfo = {
            id: this.generateSecureId(),
            timestamp: new Date().toISOString(),
            type: 'csp_violation',
            violatedDirective: event.violatedDirective,
            blockedURI: event.blockedURI,
            originalPolicy: event.originalPolicy,
            sourceFile: event.sourceFile,
            lineNumber: event.lineNumber,
            columnNumber: event.columnNumber,
            disposition: event.disposition,
            severity: 'high',
            securityRisk: 0.9
        };

        this.addToSecurityLog(violationInfo);
        console.error('🚨 Security Policy Violation:', violationInfo);
        
        // Show critical security notification
        this.showSecurityAlert(violationInfo);
        
        // Immediate security response
        this.handleSecurityIncident(violationInfo);
    }

    // DOM mutation security checking
    checkDOMMutations(mutations) {
        if (!this.checkRateLimit('dom_mutations')) {
            return;
        }

        const suspiciousPatterns = [
            /javascript:/i,
            /vbscript:/i,
            /data:text\/html/i,
            /<script/i,
            /on\w+\s*=/i,
            /eval\s*\(/i,
            /document\.write/i
        ];

        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.scanElementForThreats(node, suspiciousPatterns);
                    }
                });
            } else if (mutation.type === 'attributes') {
                this.scanAttributeForThreats(mutation.target, mutation.attributeName);
            }
        });
    }

    // Scan elements for security threats
    scanElementForThreats(element, patterns) {
        try {
            // Check element content
            const content = element.innerHTML || element.textContent || '';
            const hasThreats = patterns.some(pattern => pattern.test(content));
            
            if (hasThreats) {
                this.reportSecurityThreat({
                    type: 'suspicious_dom_content',
                    element: element.tagName,
                    content: content.substring(0, 200), // Limited for security
                    location: window.location.href
                });
                
                // Neutralize threat
                this.neutralizeThreat(element);
            }

            // Check attributes
            if (element.attributes) {
                Array.from(element.attributes).forEach(attr => {
                    if (patterns.some(pattern => pattern.test(attr.value))) {
                        this.reportSecurityThreat({
                            type: 'suspicious_attribute',
                            element: element.tagName,
                            attribute: attr.name,
                            value: attr.value.substring(0, 100)
                        });
                        
                        // Remove suspicious attribute
                        element.removeAttribute(attr.name);
                    }
                });
            }
        } catch (error) {
            console.warn('Error scanning element for threats:', error);
        }
    }

    // Enhanced resource error handling
    handleResourceError(event) {
        const element = event.target;
        const errorInfo = {
            type: 'resource_error',
            tagName: element.tagName,
            src: this.sanitizeURL(element.src || element.href),
            message: `Failed to load ${element.tagName.toLowerCase()}`,
            timestamp: new Date().toISOString(),
            securityRisk: this.assessResourceSecurityRisk(element)
        };
        
        console.warn('📦 Resource loading error:', errorInfo);
        this.addToErrorLog(errorInfo);
        
        // Handle specific resource types with security considerations
        if (element.tagName === 'IMG') {
            this.handleSecureImageError(element);
        } else if (element.tagName === 'SCRIPT') {
            this.handleSecureScriptError(element);
        } else if (element.tagName === 'LINK') {
            this.handleSecureLinkError(element);
        }
    }

    // Secure image error handling
    handleSecureImageError(imgElement) {
        // Replace with secure placeholder
        const secureplaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y4ZjlmYSIgc3Ryb2tlPSIjZGVlMmU2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZjNzU3ZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
        
        imgElement.src = secureplaceholder;
        imgElement.alt = 'Image failed to load';
        imgElement.classList.add('error-image', 'security-safe');
        imgElement.onerror = null; // Prevent infinite loops
    }

    // Secure script error handling
    handleSecureScriptError(scriptElement) {
        const errorInfo = {
            type: 'script_load_failure',
            src: this.sanitizeURL(scriptElement.src),
            async: scriptElement.async,
            defer: scriptElement.defer,
            crossOrigin: scriptElement.crossOrigin
        };
        
        console.error('📜 Script loading failed:', errorInfo);
        
        // Remove failed script to prevent security issues
        if (scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
        }
        
        this.showSecureNotification(
            new Error('Required script failed to load'),
            { type: 'script_error', ...errorInfo }
        );
    }

    // Performance monitoring with security context
    setupPerformanceMonitoring() {
        if (window.PerformanceObserver) {
            try {
                // Monitor various performance metrics
                const perfObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.recordPerformanceMetric(entry);
                    });
                });
                
                perfObserver.observe({ 
                    entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
                });
                
            } catch (error) {
                console.warn('Performance observer setup failed:', error);
            }
        }

        // Memory monitoring with leak detection
        if (performance.memory) {
            this.memoryMonitorInterval = setInterval(() => {
                this.checkMemoryUsage();
            }, 30000);
        }
    }

    // Enhanced notification system with security features
    showSecureNotification(error, errorInfo) {
        try {
            if (!this.checkRateLimit('error_notifications')) {
                return;
            }

            const notification = this.createSecureNotificationElement(error, errorInfo);
            this.notificationContainer.appendChild(notification);
            
            // Animate in
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
            
            // Auto-dismiss based on severity
            const dismissTime = this.calculateDismissTime(errorInfo);
            if (dismissTime > 0) {
                setTimeout(() => this.dismissNotification(notification), dismissTime);
            }
            
        } catch (notificationError) {
            console.error('Error showing secure notification:', notificationError);
            this.fallbackNotification(error);
        }
    }

    // Create enhanced notification container
    createNotificationContainer() {
        let container = document.getElementById('secure-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'secure-notification-container';
            container.className = 'secure-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                pointer-events: none;
                max-width: 420px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;
            
            // Security: Only append if body exists
            if (document.body) {
                document.body.appendChild(container);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(container);
                });
            }
        }
        return container;
    }

    // Utility methods for security
    sanitizeErrorMessage(message) {
        if (typeof message !== 'string') return 'Invalid error message';
        
        // Remove potentially sensitive information
        return message
            .replace(/password\s*[=:]\s*[^\s]+/gi, 'password=***')
            .replace(/token\s*[=:]\s*[^\s]+/gi, 'token=***')
            .replace(/key\s*[=:]\s*[^\s]+/gi, 'key=***')
            .replace(/secret\s*[=:]\s*[^\s]+/gi, 'secret=***')
            .substring(0, 500); // Limit length
    }

    sanitizeStackTrace(stack) {
        if (typeof stack !== 'string') return 'No stack trace';
        
        // Remove sensitive paths and limit size
        return stack
            .replace(/file:\/\/[^\s]+/g, '[local-file]')
            .replace(/C:\\[^\s]+/g, '[local-path]')
            .replace(/\/Users\/[^\s]+/g, '[user-path]')
            .substring(0, 2000);
    }

    sanitizeURL(url) {
        if (!url || typeof url !== 'string') return '';
        
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch {
            return url.replace(/[<>'"]/g, ''); // Basic sanitization
        }
    }

    sanitizeContext(context) {
        if (!context || typeof context !== 'object') return {};
        
        const sanitized = {};
        Object.keys(context).forEach(key => {
            if (typeof context[key] === 'string') {
                sanitized[key] = context[key].substring(0, 200);
            } else if (typeof context[key] === 'number') {
                sanitized[key] = context[key];
            } else {
                sanitized[key] = '[object]';
            }
        });
        
        return sanitized;
    }

    // Rate limiting implementation
    checkRateLimit(action) {
        const now = Date.now();
        const limit = this.actionLimits[action];
        
        if (!limit) return true;
        
        if (!this.rateLimiter.has(action)) {
            this.rateLimiter.set(action, []);
        }
        
        const timestamps = this.rateLimiter.get(action);
        
        // Remove old timestamps
        while (timestamps.length > 0 && timestamps[0] < now - limit.window) {
            timestamps.shift();
        }
        
        // Check if limit exceeded
        if (timestamps.length >= limit.max) {
            console.warn(`Rate limit exceeded for action: ${action}`);
            return false;
        }
        
        // Add current timestamp
        timestamps.push(now);
        return true;
    }

    // Security risk assessment
    assessSecurityRisk(error, context) {
        let risk = 0;
        
        const message = error?.message?.toLowerCase() || '';
        const stack = error?.stack?.toLowerCase() || '';
        
        // High-risk patterns
        if (message.includes('script') || message.includes('eval')) risk += 0.3;
        if (message.includes('injection') || message.includes('xss')) risk += 0.4;
        if (stack.includes('javascript:') || stack.includes('data:')) risk += 0.3;
        if (context.type === 'csp_violation') risk += 0.5;
        
        return Math.min(risk, 1.0);
    }

    // Generate secure IDs
    generateSecureId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        const counter = (this.errorLog.length + this.securityLog.length).toString(36);
        return `${timestamp}-${random}-${counter}`;
    }

    // Enhanced error logging with size management
    addToErrorLog(errorInfo) {
        this.errorLog.push(errorInfo);
        
        // Manage log size
        if (this.errorLog.length > this.maxErrors) {
            this.errorLog.splice(0, this.errorLog.length - this.maxErrors);
        }
    }

    // Security event logging
    addToSecurityLog(securityInfo) {
        this.securityLog.push(securityInfo);
        
        if (this.securityLog.length > this.maxSecurityEvents) {
            this.securityLog.splice(0, this.securityLog.length - this.maxSecurityEvents);
        }
    }

    // Public API for security monitoring
    getSecurityReport() {
        return {
            timestamp: new Date().toISOString(),
            errorCount: this.errorLog.length,
            securityEventCount: this.securityLog.length,
            highRiskEvents: this.securityLog.filter(event => event.securityRisk > 0.7).length,
            recentErrors: this.errorLog.slice(-5),
            recentSecurityEvents: this.securityLog.slice(-5),
            performanceMetrics: Object.fromEntries(this.performanceMetrics),
            memoryUsage: this.getCurrentMemoryInfo()
        };
    }

    // Cleanup with security considerations
    cleanup() {
        try {
            // Clear intervals
            if (this.memoryMonitorInterval) {
                clearInterval(this.memoryMonitorInterval);
            }
            
            // Disconnect observers
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
            }
            
            // Clear sensitive data
            this.errorLog = [];
            this.securityLog = [];
            this.rateLimiter.clear();
            this.performanceMetrics.clear();
            
            console.log('🧹 Enhanced Error Boundary cleaned up securely');
            
        } catch (error) {
            console.error('Error in enhanced cleanup:', error);
        }
    }

    // Fallback methods for critical failures
    fallbackErrorHandling(originalError, handlerError) {
        try {
            console.error('Fallback error handling activated:', {
                original: originalError?.message,
                handler: handlerError?.message
            });
            
            // Simple notification without dependencies
            if (window.alert && this.calculateErrorSeverity(originalError) === 'critical') {
                alert('A critical error occurred. Please refresh the page.');
            }
        } catch (fallbackError) {
            // Last resort - log to console only
            console.error('Total error handling failure:', fallbackError);
        }
    }

    getCurrentMemoryInfo() {
        if (!performance.memory) return null;
        
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.totalJSHeapSize / 1048576),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
    }
}

// Enhanced Performance Monitor with security features
class SecurePerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.memorySnapshots = [];
        this.securityMetrics = new Map();
        this.observers = [];
        this.thresholds = {
            memoryGrowth: 1048576, // 1MB per minute
            slowOperation: 100,     // 100ms
            excessiveErrors: 10     // 10 errors per minute
        };
        
        this.startSecureMonitoring();
    }
    
    startSecureMonitoring() {
        // Secure memory monitoring
        if (performance.memory) {
            this.memoryInterval = setInterval(() => {
                this.captureSecureMemorySnapshot();
            }, 30000);
        }
        
        // Performance observers with security validation
        this.setupSecureObservers();
    }
    
    setupSecureObservers() {
        if (!window.PerformanceObserver) return;
        
        try {
            // Paint timing observer
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
                    this.recordSecureMetric('paint', entry.name, entry.startTime);
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(paintObserver);
            
        } catch (error) {
            console.warn('Secure observer setup failed:', error);
        }
    }
    
    recordSecureMetric(category, name, value) {
        if (!this.metrics.has(category)) {
            this.metrics.set(category, new Map());
        }
        
        const categoryMetrics = this.metrics.get(category);
        if (!categoryMetrics.has(name)) {
            categoryMetrics.set(name, []);
        }
        
        const metrics = categoryMetrics.get(name);
        metrics.push({
            value,
            timestamp: Date.now()
        });
        
        // Limit metric history
        if (metrics.length > 100) {
            metrics.splice(0, 50);
        }
    }
    
    captureSecureMemorySnapshot() {
        if (!performance.memory) return;
        
        const snapshot = {
            timestamp: Date.now(),
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };
        
        this.memorySnapshots.push(snapshot);
        
        if (this.memorySnapshots.length > 50) {
            this.memorySnapshots.shift();
        }
        
        this.analyzeMemoryTrends();
    }
    
    analyzeMemoryTrends() {
        if (this.memorySnapshots.length < 3) return;
        
        const recent = this.memorySnapshots.slice(-3);
        const growth = recent[2].used - recent[0].used;
        const timeSpan = recent[2].timestamp - recent[0].timestamp;
        
        if (growth > this.thresholds.memoryGrowth && timeSpan < 60000) {
            console.warn('🚨 Memory leak detected:', {
                growth: `${(growth / 1048576).toFixed(2)} MB`,
                timeSpan: `${timeSpan / 1000}s`
            });
            
            this.recordSecureMetric('security', 'memory_leak_warning', growth);
        }
    }
    
    getSecurePerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            memoryUsage: this.getCurrentMemoryUsage(),
            metricsCount: this.metrics.size,
            securityMetrics: Object.fromEntries(this.securityMetrics),
            recentSnapshots: this.memorySnapshots.slice(-5)
        };
    }
    
    cleanup() {
        if (this.memoryInterval) {
            clearInterval(this.memoryInterval);
        }
        
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.error('Error disconnecting secure observer:', error);
            }
        });
        
        this.observers = [];
        this.metrics.clear();
        this.securityMetrics.clear();
        this.memorySnapshots = [];
    }
}

// Export enhanced classes with security features
if (typeof window !== 'undefined') {
    window.EnhancedGlobalErrorBoundary = EnhancedGlobalErrorBoundary;
    window.SecurePerformanceMonitor = SecurePerformanceMonitor;
    
    // Auto-initialize if not in a module environment
    if (!window.globalErrorBoundary) {
        window.globalErrorBoundary = new EnhancedGlobalErrorBoundary();
        window.performanceMonitor = new SecurePerformanceMonitor();
    }
}