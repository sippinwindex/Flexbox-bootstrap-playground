/**
 * Advanced Toast Notification System for CSS Playground
 * Handles different types of notifications with animations, positioning, and queuing
 */

class ToastSystem {
    constructor(options = {}) {
        this.options = {
            container: null, // Auto-create if null
            position: 'top-right', // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
            maxToasts: 5,
            defaultDuration: 4000,
            animationDuration: 300,
            gap: 10,
            offset: 20,
            allowHtml: false,
            pauseOnHover: true,
            showProgress: true,
            closeButton: true,
            sound: false,
            groupSimilar: true,
            queueLimit: 10,
            ...options
        };

        this.toasts = new Map();
        this.queue = [];
        this.container = null;
        this.eventManager = window.eventManager;
        this.sounds = new Map();
        
        this.init();
    }

    init() {
        this.createContainer();
        this.bindEvents();
        this.loadSounds();
        
        // Auto-cleanup old toasts periodically
        setInterval(() => this.cleanup(), 30000);
    }

    createContainer() {
        if (this.options.container) {
            this.container = document.querySelector(this.options.container);
        }
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }

        this.container.className = `toast-container toast-${this.options.position}`;
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'false');
        
        // Position the container
        this.positionContainer();
    }

    positionContainer() {
        const positions = {
            'top-left': { top: `${this.options.offset}px`, left: `${this.options.offset}px` },
            'top-right': { top: `${this.options.offset}px`, right: `${this.options.offset}px` },
            'top-center': { top: `${this.options.offset}px`, left: '50%', transform: 'translateX(-50%)' },
            'bottom-left': { bottom: `${this.options.offset}px`, left: `${this.options.offset}px` },
            'bottom-right': { bottom: `${this.options.offset}px`, right: `${this.options.offset}px` },
            'bottom-center': { bottom: `${this.options.offset}px`, left: '50%', transform: 'translateX(-50%)' }
        };

        const pos = positions[this.options.position] || positions['top-right'];
        Object.assign(this.container.style, {
            position: 'fixed',
            zIndex: '10000',
            pointerEvents: 'none',
            ...pos
        });
    }

    bindEvents() {
        // Global event listeners
        this.eventManager?.on('toast:show', (data) => this.show(data));
        this.eventManager?.on('toast:hide', (data) => this.hide(data.id));
        this.eventManager?.on('toast:clear', () => this.clear());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && event.ctrlKey) {
                this.clear();
            }
        });

        // Window events
        window.addEventListener('focus', () => this.resumeAll());
        window.addEventListener('blur', () => this.pauseAll());
    }

    loadSounds() {
        if (!this.options.sound) return;

        const soundFiles = {
            success: 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABA...',
            error: 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABA...',
            warning: 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABA...',
            info: 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABA...'
        };

        Object.entries(soundFiles).forEach(([type, dataUrl]) => {
            const audio = new Audio();
            audio.src = dataUrl;
            audio.volume = 0.3;
            this.sounds.set(type, audio);
        });
    }

    show(message, type = 'info', options = {}) {
        // Handle different parameter formats
        if (typeof message === 'object') {
            options = { ...message };
            message = options.message || options.text || '';
            type = options.type || 'info';
        }

        const config = {
            message,
            type,
            duration: options.duration ?? this.options.defaultDuration,
            persistent: options.persistent || false,
            action: options.action || null,
            html: options.html || this.options.allowHtml,
            icon: options.icon || this.getDefaultIcon(type),
            className: options.className || '',
            onClick: options.onClick || null,
            onClose: options.onClose || null,
            ...options
        };

        // Check for similar toasts if grouping is enabled
        if (this.options.groupSimilar) {
            const similar = this.findSimilarToast(config);
            if (similar) {
                return this.updateToast(similar.id, config);
            }
        }

        // Check toast limits
        if (this.toasts.size >= this.options.maxToasts) {
            if (this.queue.length >= this.options.queueLimit) {
                this.queue.shift(); // Remove oldest queued toast
            }
            this.queue.push(config);
            return null;
        }

        return this.createToast(config);
    }

    createToast(config) {
        const toastId = this.generateId();
        const toastElement = this.createToastElement(toastId, config);
        
        // Store toast data
        const toast = {
            id: toastId,
            element: toastElement,
            config,
            startTime: Date.now(),
            pausedTime: null,
            timer: null,
            progressBar: null
        };

        this.toasts.set(toastId, toast);
        
        // Add to DOM
        this.container.appendChild(toastElement);
        
        // Trigger show animation
        requestAnimationFrame(() => {
            toastElement.classList.add('toast-show');
            this.updateToastPositions();
        });

        // Set up auto-hide timer
        if (!config.persistent && config.duration > 0) {
            this.startTimer(toast);
        }

        // Play sound
        this.playSound(config.type);
        
        // Emit event
        this.eventManager?.emit('toast:created', { id: toastId, toast, config });
        
        return toastId;
    }

    createToastElement(id, config) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${config.type} ${config.className}`;
        toast.setAttribute('data-toast-id', id);
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.style.pointerEvents = 'auto';

        const content = this.createToastContent(config);
        toast.appendChild(content);

        // Add progress bar if enabled
        if (this.options.showProgress && !config.persistent && config.duration > 0) {
            const progressBar = this.createProgressBar();
            toast.appendChild(progressBar);
        }

        // Bind events
        this.bindToastEvents(toast, config);

        return toast;
    }

    createToastContent(config) {
        const content = document.createElement('div');
        content.className = 'toast-content';

        // Icon
        if (config.icon) {
            const iconEl = document.createElement('div');
            iconEl.className = 'toast-icon';
            iconEl.innerHTML = `<i class="icon-${config.icon}"></i>`;
            content.appendChild(iconEl);
        }

        // Message
        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        
        if (config.html && this.options.allowHtml) {
            messageEl.innerHTML = config.message;
        } else {
            messageEl.textContent = config.message;
        }
        
        content.appendChild(messageEl);

        // Action button
        if (config.action) {
            const actionEl = document.createElement('button');
            actionEl.className = 'toast-action';
            actionEl.textContent = config.action.text || 'Action';
            actionEl.setAttribute('aria-label', config.action.text || 'Action');
            
            actionEl.addEventListener('click', (event) => {
                event.stopPropagation();
                if (typeof config.action.handler === 'function') {
                    config.action.handler(config, event);
                }
                if (config.action.dismissOnClick !== false) {
                    this.hide(config.id);
                }
            });
            
            content.appendChild(actionEl);
        }

        // Close button
        if (this.options.closeButton && !config.action) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.innerHTML = '<i class="icon-x"></i>';
            closeBtn.setAttribute('aria-label', 'Close notification');
            
            closeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                this.hide(config.id);
            });
            
            content.appendChild(closeBtn);
        }

        return content;
    }

    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'toast-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress-bar';
        
        progressContainer.appendChild(progressBar);
        return progressContainer;
    }

    bindToastEvents(toastEl, config) {
        const toastId = toastEl.getAttribute('data-toast-id');
        const toast = this.toasts.get(toastId);

        // Click handler
        if (config.onClick) {
            toastEl.style.cursor = 'pointer';
            toastEl.addEventListener('click', (event) => {
                config.onClick(config, event);
            });
        }

        // Hover pause/resume
        if (this.options.pauseOnHover && !config.persistent) {
            toastEl.addEventListener('mouseenter', () => this.pauseTimer(toast));
            toastEl.addEventListener('mouseleave', () => this.resumeTimer(toast));
        }

        // Touch events for mobile
        toastEl.addEventListener('touchstart', (event) => {
            this.handleToastTouch(event, toast);
        });

        // Keyboard accessibility
        toastEl.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hide(toastId);
            }
        });
    }

    handleToastTouch(event, toast) {
        const touch = event.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        let moved = false;

        const handleTouchMove = (moveEvent) => {
            const moveTouch = moveEvent.touches[0];
            const deltaX = moveTouch.clientX - startX;
            const deltaY = moveTouch.clientY - startY;
            
            // Check if it's a swipe gesture
            if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
                moved = true;
                toast.element.style.transform = `translateX(${deltaX}px)`;
                toast.element.style.opacity = Math.max(0.3, 1 - Math.abs(deltaX) / 200);
            }
        };

        const handleTouchEnd = () => {
            if (moved) {
                const deltaX = parseFloat(toast.element.style.transform.match(/-?\d+/) || 0);
                if (Math.abs(deltaX) > 100) {
                    this.hide(toast.id);
                } else {
                    // Snap back
                    toast.element.style.transform = '';
                    toast.element.style.opacity = '';
                }
            }
            
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }

    startTimer(toast) {
        if (toast.timer) {
            clearTimeout(toast.timer);
        }

        const duration = toast.config.duration;
        const progressBar = toast.element.querySelector('.toast-progress-bar');
        
        if (progressBar) {
            progressBar.style.animationDuration = `${duration}ms`;
            progressBar.classList.add('toast-progress-active');
        }

        toast.timer = setTimeout(() => {
            this.hide(toast.id);
        }, duration);
    }

    pauseTimer(toast) {
        if (!toast.timer) return;

        clearTimeout(toast.timer);
        toast.pausedTime = Date.now();
        
        const progressBar = toast.element.querySelector('.toast-progress-bar');
        if (progressBar) {
            progressBar.style.animationPlayState = 'paused';
        }
    }

    resumeTimer(toast) {
        if (!toast.pausedTime) return;

        const elapsed = toast.pausedTime - toast.startTime;
        const remaining = Math.max(0, toast.config.duration - elapsed);
        
        toast.pausedTime = null;
        toast.startTime = Date.now() - elapsed;
        
        const progressBar = toast.element.querySelector('.toast-progress-bar');
        if (progressBar) {
            progressBar.style.animationPlayState = 'running';
            progressBar.style.animationDuration = `${remaining}ms`;
        }

        if (remaining > 0) {
            toast.timer = setTimeout(() => {
                this.hide(toast.id);
            }, remaining);
        }
    }

    pauseAll() {
        this.toasts.forEach(toast => {
            if (!toast.config.persistent) {
                this.pauseTimer(toast);
            }
        });
    }

    resumeAll() {
        this.toasts.forEach(toast => {
            if (!toast.config.persistent && toast.pausedTime) {
                this.resumeTimer(toast);
            }
        });
    }

    hide(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return false;

        // Clear timer
        if (toast.timer) {
            clearTimeout(toast.timer);
        }

        // Call onClose callback
        if (typeof toast.config.onClose === 'function') {
            toast.config.onClose(toast.config);
        }

        // Animate out
        toast.element.classList.add('toast-hide');
        
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.remove();
            }
            this.toasts.delete(toastId);
            this.updateToastPositions();
            this.processQueue();
            
            // Emit event
            this.eventManager?.emit('toast:removed', { id: toastId, toast });
        }, this.options.animationDuration);

        return true;
    }

    updateToast(toastId, newConfig) {
        const toast = this.toasts.get(toastId);
        if (!toast) return false;

        // Update configuration
        Object.assign(toast.config, newConfig);
        
        // Update message
        const messageEl = toast.element.querySelector('.toast-message');
        if (messageEl) {
            if (newConfig.html && this.options.allowHtml) {
                messageEl.innerHTML = newConfig.message;
            } else {
                messageEl.textContent = newConfig.message;
            }
        }

        // Update type class
        if (newConfig.type) {
            toast.element.className = toast.element.className.replace(/toast-\w+/, `toast-${newConfig.type}`);
        }

        // Reset timer if duration changed
        if (newConfig.duration !== undefined && !toast.config.persistent) {
            toast.startTime = Date.now();
            this.startTimer(toast);
        }

        return true;
    }

    findSimilarToast(config) {
        for (const toast of this.toasts.values()) {
            if (toast.config.message === config.message && 
                toast.config.type === config.type) {
                return toast;
            }
        }
        return null;
    }

    updateToastPositions() {
        const toasts = Array.from(this.container.children);
        const isBottom = this.options.position.includes('bottom');
        
        toasts.forEach((toastEl, index) => {
            const offset = index * (this.getToastHeight(toastEl) + this.options.gap);
            const property = isBottom ? 'bottom' : 'top';
            toastEl.style[property] = `${offset}px`;
        });
    }

    getToastHeight(toastEl) {
        return toastEl.offsetHeight || 60; // Default height
    }

    processQueue() {
        if (this.queue.length === 0 || this.toasts.size >= this.options.maxToasts) {
            return;
        }

        const nextToast = this.queue.shift();
        this.createToast(nextToast);
    }

    clear(type = null) {
        const toastsToRemove = type 
            ? Array.from(this.toasts.values()).filter(toast => toast.config.type === type)
            : Array.from(this.toasts.values());

        toastsToRemove.forEach(toast => {
            this.hide(toast.id);
        });

        // Clear queue as well
        if (!type) {
            this.queue.length = 0;
        } else {
            this.queue = this.queue.filter(config => config.type !== type);
        }
    }

    getDefaultIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info',
            loading: 'loader'
        };
        return icons[type] || 'info';
    }

    playSound(type) {
        if (!this.options.sound) return;
        
        const sound = this.sounds.get(type);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {
                // Ignore audio play errors
            });
        }
    }

    generateId() {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    cleanup() {
        // Remove very old toasts that might have gotten stuck
        const now = Date.now();
        const maxAge = 60000; // 1 minute

        this.toasts.forEach((toast, id) => {
            if (now - toast.startTime > maxAge) {
                this.hide(id);
            }
        });
    }

    // Convenience methods for different toast types
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { duration: 6000, ...options });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', { duration: 5000, ...options });
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    loading(message, options = {}) {
        return this.show(message, 'loading', { persistent: true, ...options });
    }

    // Batch operations
    showMultiple(toasts) {
        const ids = [];
        toasts.forEach(toastConfig => {
            const id = this.show(toastConfig);
            if (id) ids.push(id);
        });
        return ids;
    }

    // Configuration methods
    setPosition(position) {
        this.options.position = position;
        this.positionContainer();
        this.updateToastPositions();
    }

    setMaxToasts(max) {
        this.options.maxToasts = max;
        
        // Remove excess toasts if needed
        while (this.toasts.size > max) {
            const firstToast = this.toasts.values().next().value;
            this.hide(firstToast.id);
        }
    }

    // Statistics and debugging
    getStats() {
        return {
            activeToasts: this.toasts.size,
            queuedToasts: this.queue.length,
            maxToasts: this.options.maxToasts,
            position: this.options.position,
            totalCreated: this.generateId().split('-')[1] // Rough estimate
        };
    }

    getActiveToasts() {
        return Array.from(this.toasts.values()).map(toast => ({
            id: toast.id,
            type: toast.config.type,
            message: toast.config.message,
            age: Date.now() - toast.startTime
        }));
    }

    // Destroy method
    destroy() {
        this.clear();
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.toasts.clear();
        this.queue.length = 0;
        this.sounds.clear();
    }
}

// Global toast instance and convenience functions
let globalToast = null;

function initToast(options = {}) {
    if (!globalToast) {
        globalToast = new ToastSystem(options);
    }
    return globalToast;
}

// Global convenience functions
function toast(message, type = 'info', options = {}) {
    if (!globalToast) initToast();
    return globalToast.show(message, type, options);
}

function toastSuccess(message, options = {}) {
    if (!globalToast) initToast();
    return globalToast.success(message, options);
}

function toastError(message, options = {}) {
    if (!globalToast) initToast();
    return globalToast.error(message, options);
}

function toastWarning(message, options = {}) {
    if (!globalToast) initToast();
    return globalToast.warning(message, options);
}

function toastInfo(message, options = {}) {
    if (!globalToast) initToast();
    return globalToast.info(message, options);
}

function toastLoading(message, options = {}) {
    if (!globalToast) initToast();
    return globalToast.loading(message, options);
}

function clearToasts(type = null) {
    if (globalToast) {
        globalToast.clear(type);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ToastSystem, 
        initToast, 
        toast, 
        toastSuccess, 
        toastError, 
        toastWarning, 
        toastInfo, 
        toastLoading, 
        clearToasts 
    };
} else {
    window.ToastSystem = ToastSystem;
    window.initToast = initToast;
    window.toast = toast;
    window.toastSuccess = toastSuccess;
    window.toastError = toastError;
    window.toastWarning = toastWarning;
    window.toastInfo = toastInfo;
    window.toastLoading = toastLoading;
    window.clearToasts = clearToasts;
}