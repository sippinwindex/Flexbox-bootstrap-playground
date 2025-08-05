/**
 * Toast Notification System - Theme-aware notifications
 */

(function() {
    'use strict';
    
    // Toast configuration
    const TOAST_CONFIG = {
        duration: 4000,
        maxToasts: 5,
        position: 'top-right', // top-right, top-left, bottom-right, bottom-left
        animations: {
            slideIn: 'slideInToast',
            slideOut: 'slideOutToast'
        }
    };
    
    // Toast types and their configurations
    const TOAST_TYPES = {
        success: {
            icon: 'check-circle',
            color: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderColor: '#28a745'
        },
        error: {
            icon: 'x-circle',
            color: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderColor: '#dc3545'
        },
        warning: {
            icon: 'exclamation-triangle',
            color: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderColor: '#ffc107'
        },
        info: {
            icon: 'info-circle',
            color: '#17a2b8',
            backgroundColor: 'rgba(23, 162, 184, 0.1)',
            borderColor: '#17a2b8'
        }
    };
    
    let toastContainer = null;
    let toastQueue = [];
    let toastCounter = 0;
    
    /**
     * Initialize toast container
     */
    function initializeToastContainer() {
        if (toastContainer) return;
        
        toastContainer = document.getElementById('toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Apply positioning styles
        applyContainerStyles();
    }
    
    /**
     * Apply container positioning styles
     */
    function applyContainerStyles() {
        if (!toastContainer) return;
        
        const styles = {
            position: 'fixed',
            zIndex: '1050',
            maxWidth: '400px',
            pointerEvents: 'none'
        };
        
        // Position based on configuration
        switch (TOAST_CONFIG.position) {
            case 'top-right':
                styles.top = '20px';
                styles.right = '20px';
                break;
            case 'top-left':
                styles.top = '20px';
                styles.left = '20px';
                break;
            case 'bottom-right':
                styles.bottom = '20px';
                styles.right = '20px';
                break;
            case 'bottom-left':
                styles.bottom = '20px';
                styles.left = '20px';
                break;
        }
        
        Object.assign(toastContainer.style, styles);
    }
    
    /**
     * Create toast element
     */
    function createToastElement(message, type, options = {}) {
        const toastId = `toast-${++toastCounter}`;
        const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;
        
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'toast-custom';
        toast.style.pointerEvents = 'auto';
        
        // Apply theme-aware styling
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        toast.innerHTML = `
            <div class="toast-content d-flex align-items-center">
                <div class="toast-icon me-3">
                    <i class="bi bi-${toastType.icon}" style="color: ${toastType.color}; font-size: 1.2rem;"></i>
                </div>
                <div class="toast-message flex-grow-1">
                    ${message}
                </div>
                ${options.closable !== false ? `
                    <button type="button" class="toast-close btn-close ${isDarkMode ? 'btn-close-white' : ''} ms-3" 
                            onclick="window.ToastManager.close('${toastId}')" 
                            aria-label="Close">
                    </button>
                ` : ''}
            </div>
            ${options.action ? `
                <div class="toast-action mt-2">
                    <button type="button" class="btn btn-sm btn-outline-primary" 
                            onclick="${options.action.handler}">
                        ${options.action.text}
                    </button>
                </div>
            ` : ''}
        `;
        
        // Apply custom styling
        if (toastType.backgroundColor) {
            toast.style.setProperty('--toast-bg', toastType.backgroundColor);
        }
        
        if (toastType.borderColor) {
            toast.style.setProperty('--toast-border', toastType.borderColor);
        }
        
        return toast;
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info', options = {}) {
        try {
            if (!message) return null;
            
            initializeToastContainer();
            
            // Limit number of toasts
            if (toastQueue.length >= TOAST_CONFIG.maxToasts) {
                const oldestToast = toastQueue.shift();
                if (oldestToast && oldestToast.parentNode) {
                    closeToast(oldestToast, false);
                }
            }
            
            const toast = createToastElement(message, type, options);
            toastContainer.appendChild(toast);
            toastQueue.push(toast);
            
            // Trigger show animation
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
            
            // Auto-close if duration is set
            const duration = options.duration !== undefined ? options.duration : TOAST_CONFIG.duration;
            if (duration > 0) {
                setTimeout(() => {
                    closeToast(toast);
                }, duration);
            }
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('toastShown', {
                detail: { message, type, toast }
            }));
            
            return toast;
            
        } catch (error) {
            console.error('Show toast error:', error);
            return null;
        }
    }
    
    /**
     * Close specific toast
     */
    function closeToast(toast, animate = true) {
        try {
            if (!toast || !toast.parentNode) return;
            
            if (animate) {
                toast.style.animation = 'slideInToast 0.3s ease reverse';
                setTimeout(() => {
                    removeToast(toast);
                }, 300);
            } else {
                removeToast(toast);
            }
            
        } catch (error) {
            console.error('Close toast error:', error);
        }
    }
    
    /**
     * Remove toast from DOM and queue
     */
    function removeToast(toast) {
        try {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            
            const index = toastQueue.indexOf(toast);
            if (index > -1) {
                toastQueue.splice(index, 1);
            }
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('toastClosed', {
                detail: { toast }
            }));
            
        } catch (error) {
            console.error('Remove toast error:', error);
        }
    }
    
    /**
     * Close toast by ID
     */
    function closeToastById(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            closeToast(toast);
        }
    }
    
    /**
     * Clear all toasts
     */
    function clearAllToasts() {
        try {
            toastQueue.forEach(toast => {
                closeToast(toast, false);
            });
            toastQueue = [];
        } catch (error) {
            console.error('Clear all toasts error:', error);
        }
    }
    
    /**
     * Update toast position
     */
    function updatePosition(position) {
        TOAST_CONFIG.position = position;
        if (toastContainer) {
            applyContainerStyles();
        }
    }
    
    /**
     * Quick toast methods
     */
    const quickMethods = {
        success: (message, options) => showToast(message, 'success', options),
        error: (message, options) => showToast(message, 'error', options),
        warning: (message, options) => showToast(message, 'warning', options),
        info: (message, options) => showToast(message, 'info', options)
    };
    
    // Add CSS animations if not already present
    function addToastStyles() {
        if (document.getElementById('toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInToast {
                from { 
                    transform: translateX(100%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes slideOutToast {
                from { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                to { 
                    transform: translateX(100%) scale(0.8); 
                    opacity: 0; 
                }
            }
            
            .toast-custom {
                background: var(--glass-bg, rgba(255, 255, 255, 0.9));
                backdrop-filter: blur(20px);
                color: var(--theme-text-primary);
                border: 1px solid var(--toast-border, var(--theme-border-color));
                border-radius: 12px;
                box-shadow: var(--theme-shadow-lg);
                padding: 1rem;
                margin-bottom: 0.75rem;
                min-width: 320px;
                position: relative;
                overflow: hidden;
                opacity: 0;
                transform: translateX(100%) scale(0.8);
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .toast-custom::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: var(--toast-border, var(--theme-border-focus));
            }
            
            .toast-custom.show {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            
            .toast-custom:hover {
                transform: translateX(0) scale(1.02);
                box-shadow: var(--theme-shadow-lg);
            }
            
            .toast-content {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
            }
            
            .toast-message {
                flex: 1;
                line-height: 1.4;
                font-size: 0.9rem;
            }
            
            .toast-close {
                margin-left: auto;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            
            .toast-close:hover {
                opacity: 1;
            }
            
            .toast-action {
                margin-top: 0.75rem;
                padding-top: 0.75rem;
                border-top: 1px solid var(--theme-border-color);
            }
            
            .dark-mode .toast-custom {
                background: var(--glass-bg, rgba(0, 0, 0, 0.8));
                color: var(--theme-text-primary);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialize on DOM ready
    function initialize() {
        addToastStyles();
        
        // Listen for theme changes to update toast styles
        window.addEventListener('themeChanged', () => {
            // Update existing toasts if needed
            toastQueue.forEach(toast => {
                const isDarkMode = document.body.classList.contains('dark-mode');
                const closeBtn = toast.querySelector('.toast-close');
                if (closeBtn) {
                    if (isDarkMode) {
                        closeBtn.classList.add('btn-close-white');
                    } else {
                        closeBtn.classList.remove('btn-close-white');
                    }
                }
            });
        });
    }
    
    // Public API
    window.ToastManager = {
        show: showToast,
        close: closeToastById,
        clearAll: clearAllToasts,
        updatePosition: updatePosition,
        ...quickMethods
    };
    
    // Backward compatibility
    window.showToast = showToast;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();