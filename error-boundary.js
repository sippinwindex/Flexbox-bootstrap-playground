/**
 * error-boundary.js - Global Error Handling and Performance Monitoring
 * Handles all application errors with user-friendly feedback
 */

class GlobalErrorBoundary {
    constructor() {
        this.errorLog = [];
        this.maxErrors = 50;
        this.setupErrorHandling();
        this.notificationContainer = this.createNotificationContainer();
    }
    
    setupErrorHandling() {
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, {
                type: 'javascript_error',
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                message: event.message
            });
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'unhandled_promise_rejection',
                promise: event.promise
            });
        });
        
        // Catch resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleResourceError(event);
            }
        }, true);
    }
    
    handleError(error, context = {}) {
        try {
            const errorInfo = {
                id: this.generateErrorId(),
                timestamp: new Date().toISOString(),
                message: error?.message || String(error) || 'Unknown error',
                stack: error?.stack || 'No stack trace available',
                context,
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: this.getUserId() // For debugging user-specific issues
            };
            
            // Add to error log
            this.errorLog.push(errorInfo);
            if (this.errorLog.length > this.maxErrors) {
                this.errorLog.shift();
            }
            
            // Log to console for development
            console.error('🚨 Application Error:', errorInfo);
            
            // Show user notification
            this.showUserNotification(error, errorInfo);
            
            // Send to monitoring service in production
            this.sendToMonitoring(errorInfo);
            
        } catch (handlerError) {
            console.error('Error in error handler:', handlerError);
        }
    }
    
    handleResourceError(event) {
        const element = event.target;
        const errorInfo = {
            type: 'resource_error',
            tagName: element.tagName,
            src: element.src || element.href,
            message: `Failed to load ${element.tagName.toLowerCase()}: ${element.src || element.href}`,
            timestamp: new Date().toISOString()
        };
        
        console.warn('Resource loading error:', errorInfo);
        
        // Handle specific resource types
        if (element.tagName === 'IMG') {
            this.handleImageError(element);
        } else if (element.tagName === 'SCRIPT') {
            this.handleScriptError(element);
        }
    }
    
    handleImageError(imgElement) {
        // Replace broken image with placeholder
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y4ZjlmYSIgc3Ryb2tlPSIjZGVlMmU2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZjNzU3ZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
        imgElement.alt = 'Image failed to load';
        imgElement.classList.add('error-image');
    }
    
    handleScriptError(scriptElement) {
        console.error(`Failed to load script: ${scriptElement.src}`);
        this.showUserNotification(
            new Error('Failed to load required script'),
            { type: 'script_error', src: scriptElement.src }
        );
    }
    
    showUserNotification(error, errorInfo) {
        try {
            const notification = this.createNotificationElement(error, errorInfo);
            this.notificationContainer.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Auto-dismiss after 5 seconds for non-critical errors
            if (!this.isCriticalError(error)) {
                setTimeout(() => this.dismissNotification(notification), 5000);
            }
            
        } catch (notificationError) {
            console.error('Error showing notification:', notificationError);
            // Fallback to alert for critical errors
            if (this.isCriticalError(error)) {
                alert(`Something went wrong: ${error.message || 'Unknown error'}`);
            }
        }
    }
    
    createNotificationContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }
    
    createNotificationElement(error, errorInfo) {
        const notification = document.createElement('div');
        notification.className = `notification ${this.getNotificationSeverity(error)}`;
        notification.style.cssText = `
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            position: relative;
        `;
        
        const severity = this.getNotificationSeverity(error);
        const severityColors = {
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.borderLeftColor = severityColors[severity];
        notification.style.borderLeftWidth = '4px';
        
        const title = this.getErrorTitle(error);
        const message = this.getErrorMessage(error);
        const actions = this.getErrorActions(error, errorInfo);
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="margin: 0; color: #495057; font-size: 14px; font-weight: 600;">${title}</h4>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; color: #6c757d;"
                        aria-label="Dismiss notification">×</button>
            </div>
            <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 13px; line-height: 1.4;">${message}</p>
            ${actions ? `<div style="margin-top: 12px;">${actions}</div>` : ''}
        `;
        
        return notification;
    }
    
    getNotificationSeverity(error) {
        const message = error?.message?.toLowerCase() || '';
        
        if (message.includes('network') || message.includes('fetch')) {
            return 'warning';
        }
        
        if (this.isCriticalError(error)) {
            return 'error';
        }
        
        return 'info';
    }
    
    isCriticalError(error) {
        const criticalPatterns = [
            'cannot read properties of undefined',
            'is not a function',
            'script error',
            'out of memory',
            'maximum call stack'
        ];
        
        const message = error?.message?.toLowerCase() || '';
        return criticalPatterns.some(pattern => message.includes(pattern));
    }
    
    getErrorTitle(error) {
        if (this.isCriticalError(error)) {
            return '⚠️ Something went wrong';
        }
        return '🔧 Minor issue detected';
    }
    
    getErrorMessage(error) {
        const message = error?.message || 'An unknown error occurred';
        
        if (message.includes('Cannot read properties of undefined')) {
            return 'A component is trying to access data that isn\'t ready yet. The app should recover automatically.';
        }
        
        if (message.includes('is not a function')) {
            return 'A feature may be temporarily unavailable. Try refreshing if the issue persists.';
        }
        
        if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
            return 'Having trouble loading external content. Check your internet connection.';
        }
        
        return 'The application will try to recover automatically. You can continue using other features.';
    }
    
    getErrorActions(error, errorInfo) {
        if (this.isCriticalError(error)) {
            return `
                <button onclick="location.reload()" 
                        style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">
                    Refresh Page
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Dismiss
                </button>
            `;
        }
        
        return null;
    }
    
    dismissNotification(notification) {
        try {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    }
    
    generateErrorId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getUserId() {
        // Generate a session-based user ID for debugging
        let userId = sessionStorage.getItem('debug-user-id');
        if (!userId) {
            userId = 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            sessionStorage.setItem('debug-user-id', userId);
        }
        return userId;
    }
    
    sendToMonitoring(errorInfo) {
        // Only send in production environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return;
        }
        
        try {
            // Example monitoring service integration
            if (window.gtag) {
                window.gtag('event', 'exception', {
                    description: errorInfo.message,
                    fatal: this.isCriticalError({ message: errorInfo.message })
                });
            }
            
            // Could also send to services like Sentry, LogRocket, etc.
            
        } catch (monitoringError) {
            console.error('Error sending to monitoring service:', monitoringError);
        }
    }
    
    // Public API methods
    getErrorLog() {
        return [...this.errorLog];
    }
    
    clearErrorLog() {
        this.errorLog = [];
        console.log('Error log cleared');
    }
    
    reportCustomError(message, context = {}) {
        this.handleError(new Error(message), { type: 'custom', ...context });
    }
}

// Performance monitoring utilities
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.memorySnapshots = [];
        this.observers = [];
        this.startMonitoring();
    }
    
    startMonitoring() {
        // Memory monitoring (if available)
        if (performance.memory) {
            this.memoryInterval = setInterval(() => {
                this.captureMemorySnapshot();
            }, 30000); // Every 30 seconds
        }
        
        // Performance Observer for paint metrics
        if (window.PerformanceObserver) {
            try {
                const paintObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
                    }
                });
                paintObserver.observe({ entryTypes: ['paint'] });
                this.observers.push(paintObserver);
            } catch (error) {
                console.warn('Paint observer not supported:', error);
            }
        }
    }
    
    captureMemorySnapshot() {
        if (!performance.memory) return;
        
        const snapshot = {
            timestamp: Date.now(),
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
        
        this.memorySnapshots.push(snapshot);
        
        // Keep only last 100 snapshots
        if (this.memorySnapshots.length > 100) {
            this.memorySnapshots.shift();
        }
        
        this.checkForMemoryLeaks();
    }
    
    checkForMemoryLeaks() {
        if (this.memorySnapshots.length < 10) return;
        
        const recent = this.memorySnapshots.slice(-10);
        const first = recent[0];
        const last = recent[recent.length - 1];
        
        const memoryGrowth = last.usedJSHeapSize - first.usedJSHeapSize;
        const timeElapsed = last.timestamp - first.timestamp;
        const growthRate = memoryGrowth / timeElapsed; // bytes per millisecond
        
        // Alert if growing more than 1MB per minute
        if (growthRate > 17.3) { // ~1MB per minute
            console.warn('🚨 Potential memory leak detected:', {
                growthRate: `${(growthRate * 60000 / 1048576).toFixed(2)} MB/min`,
                currentMemory: `${(last.usedJSHeapSize / 1048576).toFixed(2)} MB`
            });
        }
    }
    
    measureOperation(name, operation) {
        const startTime = performance.now();
        const startMemory = performance.memory?.usedJSHeapSize || 0;
        
        let result;
        try {
            result = operation();
        } catch (error) {
            console.error(`Operation "${name}" failed:`, error);
            throw error;
        }
        
        const endTime = performance.now();
        const endMemory = performance.memory?.usedJSHeapSize || 0;
        
        const metric = {
            duration: endTime - startTime,
            memoryDelta: endMemory - startMemory,
            timestamp: Date.now()
        };
        
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name).push(metric);
        
        // Log slow operations
        if (metric.duration > 100) {
            console.warn(`⏱️ Slow operation: "${name}" took ${metric.duration.toFixed(2)}ms`);
        }
        
        return result;
    }
    
    getPerformanceReport() {
        const report = {
            metrics: {},
            memoryTrend: this.getMemoryTrend(),
            currentMemory: this.getCurrentMemoryUsage(),
            recommendations: []
        };
        
        this.metrics.forEach((measurements, name) => {
            const durations = measurements.map(m => m.duration);
            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
            
            report.metrics[name] = {
                count: measurements.length,
                avgDuration: Math.round(avgDuration * 100) / 100,
                maxDuration: Math.round(Math.max(...durations) * 100) / 100,
                minDuration: Math.round(Math.min(...durations) * 100) / 100
            };
            
            if (avgDuration > 50) {
                report.recommendations.push(`Consider optimizing "${name}" operation (avg: ${avgDuration.toFixed(2)}ms)`);
            }
        });
        
        return report;
    }
    
    getMemoryTrend() {
        if (this.memorySnapshots.length < 2) return 'insufficient_data';
        
        const recent = this.memorySnapshots.slice(-5);
        const growth = recent[recent.length - 1].usedJSHeapSize - recent[0].usedJSHeapSize;
        
        if (growth > 1048576) return 'increasing'; // More than 1MB growth
        if (growth < -1048576) return 'decreasing';
        return 'stable';
    }
    
    getCurrentMemoryUsage() {
        if (!performance.memory) return null;
        
        return {
            used: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            total: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            limit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
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
                console.error('Error disconnecting observer:', error);
            }
        });
        
        this.observers = [];
        this.metrics.clear();
        this.memorySnapshots = [];
    }
}

// Export classes
if (typeof window !== 'undefined') {
    window.GlobalErrorBoundary = GlobalErrorBoundary;
    window.PerformanceMonitor = PerformanceMonitor;
}