// js/core/event-manager.js - Event Management System

const EventManager = {
    // Event storage
    listeners: new Map(),
    onceListeners: new Map(),
    
    // Event history for debugging
    eventHistory: [],
    maxHistorySize: 100,
    
    // Performance tracking
    eventStats: new Map(),
    
    // Event queue for batching
    eventQueue: [],
    batchTimeout: null,
    batchDelay: 16, // ~60fps
    
    // Initialize event manager
    init() {
        console.log('⚡ Initializing Event Manager...');
        
        // Set up global error handling
        this.setupErrorHandling();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Set up window events
        this.setupWindowEvents();
        
        console.log('✅ Event Manager initialized');
        return this;
    },
    
    // Add event listener
    on(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            console.warn('Event callback must be a function');
            return;
        }
        
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        
        // Store callback with options
        const listenerData = {
            callback,
            options,
            id: this.generateListenerId(),
            createdAt: Date.now()
        };
        
        this.listeners.get(event).add(listenerData);
        
        // Track event registration
        this.trackEventStat(event, 'registered');
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    },
    
    // Add one-time event listener
    once(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            console.warn('Event callback must be a function');
            return;
        }
        
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }
        
        const listenerData = {
            callback,
            options,
            id: this.generateListenerId(),
            createdAt: Date.now()
        };
        
        this.onceListeners.get(event).add(listenerData);
        
        // Return unsubscribe function
        return () => this.offOnce(event, callback);
    },
    
    // Remove event listener
    off(event, callback) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);
            for (const listenerData of eventListeners) {
                if (listenerData.callback === callback) {
                    eventListeners.delete(listenerData);
                    this.trackEventStat(event, 'unregistered');
                    break;
                }
            }
            
            // Clean up empty event sets
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        }
    },
    
    // Remove one-time event listener
    offOnce(event, callback) {
        if (this.onceListeners.has(event)) {
            const eventListeners = this.onceListeners.get(event);
            for (const listenerData of eventListeners) {
                if (listenerData.callback === callback) {
                    eventListeners.delete(listenerData);
                    break;
                }
            }
            
            if (eventListeners.size === 0) {
                this.onceListeners.delete(event);
            }
        }
    },
    
    // Emit event
    emit(event, ...args) {
        const eventData = {
            event,
            args,
            timestamp: Date.now(),
            id: this.generateEventId()
        };
        
        // Add to history
        this.addToHistory(eventData);
        
        // Track event emission
        this.trackEventStat(event, 'emitted');
        
        try {
            // Execute regular listeners
            this.executeListeners(event, args);
            
            // Execute one-time listeners
            this.executeOnceListeners(event, args);
            
        } catch (error) {
            console.error(`Error emitting event "${event}":`, error);
            this.emit('error', error, event, args);
        }
        
        return eventData.id;
    },
    
    // Emit event with delay
    emitDelayed(event, delay, ...args) {
        return setTimeout(() => {
            this.emit(event, ...args);
        }, delay);
    },
    
    // Emit event on next tick
    emitAsync(event, ...args) {
        return new Promise(resolve => {
            setTimeout(() => {
                const eventId = this.emit(event, ...args);
                resolve(eventId);
            }, 0);
        });
    },
    
    // Batch emit events
    emitBatch(events) {
        events.forEach(({ event, args = [] }) => {
            this.emit(event, ...args);
        });
    },
    
    // Queue event for batched emission
    queueEvent(event, ...args) {
        this.eventQueue.push({ event, args, timestamp: Date.now() });
        
        // Set up batch processing
        if (!this.batchTimeout) {
            this.batchTimeout = setTimeout(() => {
                this.processBatchedEvents();
            }, this.batchDelay);
        }
    },
    
    // Process batched events
    processBatchedEvents() {
        const events = [...this.eventQueue];
        this.eventQueue = [];
        this.batchTimeout = null;
        
        // Group events by type for efficient processing
        const groupedEvents = new Map();
        events.forEach(({ event, args, timestamp }) => {
            if (!groupedEvents.has(event)) {
                groupedEvents.set(event, []);
            }
            groupedEvents.get(event).push({ args, timestamp });
        });
        
        // Emit grouped events
        groupedEvents.forEach((eventArgs, event) => {
            this.emit(`batch:${event}`, eventArgs);
            
            // Also emit individual events if requested
            if (this.hasListeners(event)) {
                eventArgs.forEach(({ args }) => {
                    this.emit(event, ...args);
                });
            }
        });
    },
    
    // Execute regular listeners
    executeListeners(event, args) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);
            
            for (const listenerData of eventListeners) {
                try {
                    // Check if listener should be throttled
                    if (this.shouldThrottle(listenerData)) {
                        continue;
                    }
                    
                    // Execute callback
                    const result = listenerData.callback(...args);
                    
                    // Handle promise returns
                    if (result instanceof Promise) {
                        result.catch(error => {
                            console.error(`Promise error in listener for "${event}":`, error);
                        });
                    }
                    
                } catch (error) {
                    console.error(`Error in listener for "${event}":`, error);
                    // Continue executing other listeners
                }
            }
        }
    },
    
    // Execute one-time listeners
    executeOnceListeners(event, args) {
        if (this.onceListeners.has(event)) {
            const eventListeners = this.onceListeners.get(event);
            const listenersToRemove = [];
            
            for (const listenerData of eventListeners) {
                try {
                    listenerData.callback(...args);
                    listenersToRemove.push(listenerData);
                } catch (error) {
                    console.error(`Error in once listener for "${event}":`, error);
                    listenersToRemove.push(listenerData);
                }
            }
            
            // Remove executed listeners
            listenersToRemove.forEach(listenerData => {
                eventListeners.delete(listenerData);
            });
            
            // Clean up empty event sets
            if (eventListeners.size === 0) {
                this.onceListeners.delete(event);
            }
        }
    },
    
    // Check if event has listeners
    hasListeners(event) {
        return (this.listeners.has(event) && this.listeners.get(event).size > 0) ||
               (this.onceListeners.has(event) && this.onceListeners.get(event).size > 0);
    },
    
    // Get listener count for event
    getListenerCount(event) {
        const regular = this.listeners.has(event) ? this.listeners.get(event).size : 0;
        const once = this.onceListeners.has(event) ? this.onceListeners.get(event).size : 0;
        return regular + once;
    },
    
    // Get all registered events
    getEvents() {
        const events = new Set();
        this.listeners.forEach((_, event) => events.add(event));
        this.onceListeners.forEach((_, event) => events.add(event));
        return Array.from(events);
    },
    
    // Remove all listeners for an event
    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
        } else {
            // Remove all listeners for all events
            this.listeners.clear();
            this.onceListeners.clear();
        }
    },
    
    // Set up global error handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.emit('global:error', event.error, event);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.emit('global:unhandledRejection', event.reason, event);
        });
    },
    
    // Set up performance monitoring
    setupPerformanceMonitoring() {
        // Monitor long-running listeners
        this.on('*', () => {
            // This could be used for performance tracking
        });
    },
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            const shortcut = this.getKeyboardShortcut(event);
            if (shortcut) {
                this.emit('keyboard:shortcut', shortcut, event);
                this.emit(`keyboard:${shortcut}`, event);
            }
        });
    },
    
    // Set up window events
    setupWindowEvents() {
        const windowEvents = [
            'resize', 'scroll', 'focus', 'blur', 'beforeunload',
            'load', 'DOMContentLoaded', 'visibilitychange'
        ];
        
        windowEvents.forEach(eventType => {
            window.addEventListener(eventType, (event) => {
                this.emit(`window:${eventType}`, event);
            });
        });
    },
    
    // Get keyboard shortcut string
    getKeyboardShortcut(event) {
        const parts = [];
        
        if (event.ctrlKey || event.metaKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        
        // Add key name
        if (event.key && event.key.length === 1) {
            parts.push(event.key.toLowerCase());
        } else if (event.code) {
            parts.push(event.code.toLowerCase());
        }
        
        return parts.length > 1 ? parts.join('+') : null;
    },
    
    // Check if listener should be throttled
    shouldThrottle(listenerData) {
        if (!listenerData.options.throttle) return false;
        
        const now = Date.now();
        const lastCall = listenerData.lastCall || 0;
        const throttleDelay = listenerData.options.throttle;
        
        if (now - lastCall < throttleDelay) {
            return true;
        }
        
        listenerData.lastCall = now;
        return false;
    },
    
    // Generate unique listener ID
    generateListenerId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Generate unique event ID
    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Add event to history
    addToHistory(eventData) {
        this.eventHistory.push(eventData);
        
        // Trim history if it gets too large
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
        }
    },
    
    // Track event statistics
    trackEventStat(event, type) {
        if (!this.eventStats.has(event)) {
            this.eventStats.set(event, {
                registered: 0,
                unregistered: 0,
                emitted: 0
            });
        }
        
        this.eventStats.get(event)[type]++;
    },
    
    // Get event statistics
    getEventStats(event) {
        if (event) {
            return this.eventStats.get(event) || { registered: 0, unregistered: 0, emitted: 0 };
        }
        
        // Return all stats
        const allStats = {};
        this.eventStats.forEach((stats, eventName) => {
            allStats[eventName] = { ...stats };
        });
        return allStats;
    },
    
    // Get event history
    getEventHistory(limit = 50) {
        return this.eventHistory.slice(-limit);
    },
    
    // Create event namespace
    namespace(prefix) {
        return {
            on: (event, callback, options) => this.on(`${prefix}:${event}`, callback, options),
            once: (event, callback, options) => this.once(`${prefix}:${event}`, callback, options),
            emit: (event, ...args) => this.emit(`${prefix}:${event}`, ...args),
            off: (event, callback) => this.off(`${prefix}:${event}`, callback),
            hasListeners: (event) => this.hasListeners(`${prefix}:${event}`),
            removeAllListeners: (event) => this.removeAllListeners(`${prefix}:${event}`)
        };
    },
    
    // Debug information
    debug() {
        return {
            activeListeners: this.listeners.size,
            activeOnceListeners: this.onceListeners.size,
            totalEvents: this.getEvents().length,
            historySize: this.eventHistory.length,
            stats: this.getEventStats(),
            queueSize: this.eventQueue.length
        };
    },
    
    // Export event data
    export() {
        return {
            stats: this.getEventStats(),
            history: this.getEventHistory(),
            events: this.getEvents(),
            timestamp: new Date().toISOString()
        };
    }
};

// Make EventManager globally available
window.EventManager = EventManager;