/**
 * playground-state.js - Centralized State Management
 * Handles all application state with defensive programming and error recovery
 */

class PlaygroundState {
    constructor(initialState = {}) {
        // Initialize all properties with safe defaults - FIXED: undefined property access
        this.state = {
            // Core counters
            itemCount: 3,
            currentSelectedItem: 1,
            demoElementCount: 0,
            
            // Drag and drop state
            dragState: {
                draggedElement: null,
                draggedIndex: null,
                isDragging: false,
                dropTarget: null
            },
            
            // Flex item properties for each item
            itemProperties: {
                1: { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                2: { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                3: { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }
            },
            
            // Container properties
            containerProperties: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                alignContent: 'stretch',
                gap: '10px',
                minHeight: '400px',
                width: '100%'
            },
            
            // Image and media management
            imageCache: new Map(),
            loadedImages: new Set(),
            
            // Undo/Redo system - FIXED: Initialize as arrays
            undoStack: [],
            redoStack: [],
            
            // UI state
            isLoading: false,
            hasUnsavedChanges: false,
            lastSaveTime: null,
            
            // Error state
            errors: [],
            warnings: []
        };
        
        // Merge with initial state
        this.state = { ...this.state, ...initialState };
        
        // Subscribers for state changes
        this.subscribers = new Set();
        this.maxUndoSteps = 50;
        this.isUpdating = false;
        
        // Performance monitoring
        this.stateChangeCount = 0;
        this.lastStateChange = Date.now();
        
        // Validate initial state
        this.validateState(this.state);
        
        console.log('📊 PlaygroundState initialized with safe defaults');
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call when state changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        if (typeof callback !== 'function') {
            console.error('PlaygroundState.subscribe: callback must be a function');
            return () => {};
        }
        
        this.subscribers.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }

    /**
     * Update state with validation and undo support
     * @param {Object|Function} updater - New state object or updater function
     * @param {Object} options - Update options
     */
    setState(updater, options = {}) {
        // Prevent recursive updates
        if (this.isUpdating) {
            console.warn('State update during render cycle detected');
            return false;
        }
        
        try {
            this.isUpdating = true;
            
            let newState;
            if (typeof updater === 'function') {
                // Pass a deep copy to prevent mutations
                newState = updater(this.deepClone(this.state));
            } else if (typeof updater === 'object' && updater !== null) {
                newState = { ...this.state, ...updater };
            } else {
                console.error('Invalid state updater:', updater);
                return false;
            }
            
            // Validate state before setting
            this.validateState(newState);
            
            // Add to undo stack for reversible actions
            if (this.shouldAddToUndo(newState, options)) {
                this.addToUndoStack();
            }
            
            // Update state
            const oldState = this.state;
            this.state = Object.freeze(newState);
            
            // Track changes
            this.stateChangeCount++;
            this.lastStateChange = Date.now();
            
            // Notify subscribers
            this.notifySubscribers(oldState, newState);
            
            return true;
            
        } catch (error) {
            console.error('Error in setState:', error);
            
            // Report to error boundary
            if (window.globalErrorBoundary) {
                window.globalErrorBoundary.handleError(error, { 
                    method: 'setState', 
                    updater: typeof updater === 'function' ? 'function' : updater 
                });
            }
            
            return false;
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Validate state structure and fix common issues
     * @param {Object} state - State to validate
     */
    validateState(state) {
        try {
            // Ensure required arrays exist - FIXED: array operations
            const requiredArrays = ['undoStack', 'redoStack', 'errors', 'warnings'];
            requiredArrays.forEach(key => {
                if (!Array.isArray(state[key])) {
                    console.warn(`State property "${key}" should be an array, fixing...`);
                    state[key] = [];
                }
            });
            
            // Ensure required numbers exist
            const requiredNumbers = ['itemCount', 'currentSelectedItem', 'demoElementCount'];
            requiredNumbers.forEach(key => {
                if (typeof state[key] !== 'number' || !Number.isFinite(state[key])) {
                    console.warn(`State property "${key}" should be a number, fixing...`);
                    state[key] = key === 'itemCount' ? 3 : 0;
                }
            });
            
            // Ensure Maps and Sets exist
            if (!(state.imageCache instanceof Map)) {
                console.warn('imageCache should be a Map, fixing...');
                state.imageCache = new Map();
            }
            
            if (!(state.loadedImages instanceof Set)) {
                console.warn('loadedImages should be a Set, fixing...');
                state.loadedImages = new Set();
            }
            
            // Validate itemProperties
            if (!state.itemProperties || typeof state.itemProperties !== 'object') {
                console.warn('itemProperties missing or invalid, fixing...');
                state.itemProperties = this.createDefaultItemProperties(state.itemCount);
            }
            
            // Validate containerProperties
            if (!state.containerProperties || typeof state.containerProperties !== 'object') {
                console.warn('containerProperties missing or invalid, fixing...');
                state.containerProperties = this.createDefaultContainerProperties();
            }
            
            // Validate dragState
            if (!state.dragState || typeof state.dragState !== 'object') {
                console.warn('dragState missing or invalid, fixing...');
                state.dragState = {
                    draggedElement: null,
                    draggedIndex: null,
                    isDragging: false,
                    dropTarget: null
                };
            }
            
            // Ensure currentSelectedItem is valid
            if (state.currentSelectedItem > state.itemCount || state.currentSelectedItem < 1) {
                state.currentSelectedItem = Math.min(state.itemCount, Math.max(1, state.currentSelectedItem));
            }
            
        } catch (error) {
            console.error('Error validating state:', error);
            // If validation fails, reset to safe defaults
            Object.assign(state, this.createSafeDefaults());
        }
    }

    /**
     * Create default item properties
     * @param {number} count - Number of items
     * @returns {Object} Default properties
     */
    createDefaultItemProperties(count = 3) {
        const properties = {};
        for (let i = 1; i <= count; i++) {
            properties[i] = {
                flexGrow: 0,
                flexShrink: 1,
                flexBasis: 'auto',
                alignSelf: 'auto',
                order: 0
            };
        }
        return properties;
    }

    /**
     * Create default container properties
     * @returns {Object} Default container properties
     */
    createDefaultContainerProperties() {
        return {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            flexWrap: 'nowrap',
            alignContent: 'stretch',
            gap: '10px',
            minHeight: '400px',
            width: '100%'
        };
    }

    /**
     * Create completely safe default state
     * @returns {Object} Safe default state
     */
    createSafeDefaults() {
        return {
            itemCount: 3,
            currentSelectedItem: 1,
            demoElementCount: 0,
            dragState: {
                draggedElement: null,
                draggedIndex: null,
                isDragging: false,
                dropTarget: null
            },
            itemProperties: this.createDefaultItemProperties(3),
            containerProperties: this.createDefaultContainerProperties(),
            imageCache: new Map(),
            loadedImages: new Set(),
            undoStack: [],
            redoStack: [],
            isLoading: false,
            hasUnsavedChanges: false,
            lastSaveTime: null,
            errors: [],
            warnings: []
        };
    }

    /**
     * Check if state change should be added to undo stack
     * @param {Object} newState - New state
     * @param {Object} options - Update options
     * @returns {boolean} Should add to undo
     */
    shouldAddToUndo(newState, options = {}) {
        if (options.skipUndo) return false;
        
        // Don't add temporary state changes
        const temporaryChanges = ['isLoading', 'dragState', 'errors', 'warnings'];
        const hasOnlyTemporaryChanges = Object.keys(newState).every(key => 
            temporaryChanges.includes(key) || newState[key] === this.state[key]
        );
        
        if (hasOnlyTemporaryChanges) return false;
        
        // Add for meaningful changes
        return (
            newState.itemProperties !== this.state.itemProperties ||
            newState.containerProperties !== this.state.containerProperties ||
            newState.itemCount !== this.state.itemCount ||
            newState.demoElementCount !== this.state.demoElementCount
        );
    }

    /**
     * Add current state to undo stack
     */
    addToUndoStack() {
        try {
            // FIXED: Ensure undoStack exists before push operation
            if (!Array.isArray(this.state.undoStack)) {
                this.state.undoStack = [];
            }
            
            // Create a deep clone of current state for undo
            const stateSnapshot = this.deepClone(this.state);
            this.state.undoStack.push(stateSnapshot);
            
            // Limit undo stack size
            if (this.state.undoStack.length > this.maxUndoSteps) {
                this.state.undoStack.shift();
            }
            
            // Clear redo stack on new action
            this.state.redoStack = [];
            
        } catch (error) {
            console.error('Error adding to undo stack:', error);
        }
    }

    /**
     * Get current state (read-only)
     * @returns {Object} Current state
     */
    getState() {
        return this.state;
    }

    /**
     * Undo last action
     * @returns {boolean} Success
     */
    undo() {
        try {
            if (!Array.isArray(this.state.undoStack) || this.state.undoStack.length === 0) {
                console.warn('Nothing to undo');
                return false;
            }
            
            // Ensure redo stack exists
            if (!Array.isArray(this.state.redoStack)) {
                this.state.redoStack = [];
            }
            
            // Move current state to redo stack
            this.state.redoStack.push(this.deepClone(this.state));
            
            // Restore previous state
            this.state = this.state.undoStack.pop();
            
            // Validate restored state
            this.validateState(this.state);
            
            // Notify subscribers
            this.notifySubscribers(null, this.state, { type: 'undo' });
            
            console.log('✅ Undo successful');
            return true;
            
        } catch (error) {
            console.error('Error in undo:', error);
            return false;
        }
    }

    /**
     * Redo last undone action
     * @returns {boolean} Success
     */
    redo() {
        try {
            if (!Array.isArray(this.state.redoStack) || this.state.redoStack.length === 0) {
                console.warn('Nothing to redo');
                return false;
            }
            
            // Ensure undo stack exists
            if (!Array.isArray(this.state.undoStack)) {
                this.state.undoStack = [];
            }
            
            // Move current state to undo stack
            this.state.undoStack.push(this.deepClone(this.state));
            
            // Restore redo state
            this.state = this.state.redoStack.pop();
            
            // Validate restored state
            this.validateState(this.state);
            
            // Notify subscribers
            this.notifySubscribers(null, this.state, { type: 'redo' });
            
            console.log('✅ Redo successful');
            return true;
            
        } catch (error) {
            console.error('Error in redo:', error);
            return false;
        }
    }

    /**
     * Reset state to defaults
     * @param {Object} options - Reset options
     */
    reset(options = {}) {
        try {
            const defaultState = this.createSafeDefaults();
            
            if (!options.skipUndo) {
                this.addToUndoStack();
            }
            
            this.state = Object.freeze(defaultState);
            this.notifySubscribers(null, this.state, { type: 'reset' });
            
            console.log('🔄 State reset to defaults');
            return true;
            
        } catch (error) {
            console.error('Error resetting state:', error);
            return false;
        }
    }

    /**
     * Deep clone object (handles Maps, Sets, Dates)
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Map) {
            const cloned = new Map();
            obj.forEach((value, key) => {
                cloned.set(key, this.deepClone(value));
            });
            return cloned;
        }
        
        if (obj instanceof Set) {
            const cloned = new Set();
            obj.forEach(value => {
                cloned.add(this.deepClone(value));
            });
            return cloned;
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = this.deepClone(obj[key]);
        });
        
        return cloned;
    }

    /**
     * Notify all subscribers of state changes
     * @param {Object} oldState - Previous state
     * @param {Object} newState - New state
     * @param {Object} meta - Additional metadata
     */
    notifySubscribers(oldState, newState, meta = {}) {
        this.subscribers.forEach(callback => {
            try {
                callback(newState, oldState, meta);
            } catch (error) {
                console.error('Error in state subscriber:', error);
                
                // Remove faulty subscriber
                this.subscribers.delete(callback);
            }
        });
    }

    /**
     * Add error to state
     * @param {Error|string} error - Error to add
     * @param {Object} context - Error context
     */
    addError(error, context = {}) {
        const errorObj = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            message: error?.message || String(error),
            timestamp: new Date().toISOString(),
            context
        };
        
        this.setState(prevState => ({
            ...prevState,
            errors: [...(prevState.errors || []), errorObj]
        }), { skipUndo: true });
    }

    /**
     * Clear errors from state
     */
    clearErrors() {
        this.setState(prevState => ({
            ...prevState,
            errors: []
        }), { skipUndo: true });
    }

    /**
     * Get performance metrics
     * @returns {Object} Metrics
     */
    getMetrics() {
        return {
            stateChangeCount: this.stateChangeCount,
            lastStateChange: this.lastStateChange,
            subscriberCount: this.subscribers.size,
            undoStackSize: this.state.undoStack?.length || 0,
            redoStackSize: this.state.redoStack?.length || 0,
            memoryUsage: {
                imageCache: this.state.imageCache?.size || 0,
                loadedImages: this.state.loadedImages?.size || 0
            }
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        try {
            // Clear all subscribers
            this.subscribers.clear();
            
            // Clean up loaded images
            if (this.state.loadedImages) {
                this.state.loadedImages.forEach(url => {
                    if (url.startsWith('blob:')) {
                        URL.revokeObjectURL(url);
                    }
                });
                this.state.loadedImages.clear();
            }
            
            // Clear caches
            if (this.state.imageCache) {
                this.state.imageCache.clear();
            }
            
            console.log('🧹 PlaygroundState cleaned up successfully');
            
        } catch (error) {
            console.error('Error in PlaygroundState cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PlaygroundState = PlaygroundState;
}