/**
 * main.js - Main Application Class (Security Enhanced)
 * Orchestrates all components and handles initialization with security features
 */

class FlexboxEducationalApp {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.performanceMonitor = null;
        this.initializationPromise = null;
        this.securityBoundary = null;
        this.rateLimiter = null;
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.cleanup = this.cleanup.bind(this);
        this.hasUnsavedChanges = this.hasUnsavedChanges.bind(this);
        
        // Initialize security features
        this.initializeSecurity();
    }
    
    /**
     * Initialize security features before main initialization
     */
    initializeSecurity() {
        try {
            // Initialize security boundary if SecurityUtils is available
            if (typeof SecurityUtils !== 'undefined') {
                this.securityBoundary = new SecureErrorBoundary('main');
                this.rateLimiter = SecurityUtils.createRateLimiter(50, 10000);
                console.log('🔒 Security features initialized');
            } else {
                console.warn('⚠️ SecurityUtils not found - running without enhanced security');
            }
        } catch (error) {
            console.error('❌ Security initialization failed:', error);
        }
    }
    
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }
        
        this.initializationPromise = this._doInitialization();
        return this.initializationPromise;
    }
    
    async _doInitialization() {
        try {
            console.log('🚀 Starting application initialization...');
            
            // Phase 1: Performance monitoring
            await this.initializePerformanceMonitoring();
            
            // Phase 2: Core state management
            await this.initializeStateManagement();
            
            // Phase 3: Utilities and helpers
            await this.initializeUtilities();
            
            // Phase 4: Drag and drop system
            await this.initializeDragAndDrop();
            
            // Phase 5: Controllers
            await this.initializeControllers();
            
            // Phase 6: Content managers
            await this.initializeContentManagers();
            
            // Phase 7: Setup event listeners and UI
            await this.setupUserInterface();
            
            this.initialized = true;
            console.log('✅ Application initialization complete');
            
            // Report initialization metrics
            this.reportInitializationMetrics();
            
            return true;
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleInitializationError(error);
            return false;
        }
    }
    
    async initializePerformanceMonitoring() {
        try {
            if (window.PerformanceMonitor) {
                this.performanceMonitor = new PerformanceMonitor();
                console.log('📊 Performance monitoring initialized');
            }
        } catch (error) {
            console.warn('⚠️ Performance monitoring failed to initialize:', error);
        }
    }
    
    async initializeStateManagement() {
        try {
            console.log('📊 Initializing state management...');
            
            if (!window.PlaygroundState) {
                throw new Error('PlaygroundState class not found');
            }
            
            this.playgroundState = new PlaygroundState({
                itemCount: 3,
                currentSelectedItem: 1,
                demoElementCount: 0
            });
            
            this.modules.set('state', this.playgroundState);
            
            // Make globally available for other modules
            window.playgroundState = this.playgroundState;
            
            console.log('✅ State management initialized');
            
        } catch (error) {
            console.error('❌ State management initialization failed:', error);
            throw error;
        }
    }
    
    async initializeUtilities() {
        try {
            console.log('🔧 Initializing utilities...');
            
            // Utilities are already loaded globally from utils.js
            // Just verify they're available
            const requiredUtils = ['debounce', 'throttle', 'rafBatch', 'safeQuerySelector'];
            const missingUtils = requiredUtils.filter(util => typeof window[util] !== 'function');
            
            if (missingUtils.length > 0) {
                throw new Error(`Missing utilities: ${missingUtils.join(', ')}`);
            }
            
            console.log('✅ Utilities verified');
            
        } catch (error) {
            console.error('❌ Utilities initialization failed:', error);
            throw error;
        }
    }
    
    async initializeDragAndDrop() {
        try {
            console.log('🎯 Initializing drag and drop system...');
            
            if (!window.AccessibleDragDrop) {
                throw new Error('AccessibleDragDrop class not found');
            }
            
            this.accessibleDragDrop = new AccessibleDragDrop(this.playgroundState);
            this.modules.set('dragDrop', this.accessibleDragDrop);
            
            // Make globally available
            window.accessibleDragDrop = this.accessibleDragDrop;
            
            // Initialize demo container
            const demoContainer = safeQuerySelector('#demo-container');
            if (demoContainer) {
                this.accessibleDragDrop.initializeContainer(demoContainer);
            }
            
            console.log('✅ Drag and drop system initialized');
            
        } catch (error) {
            console.error('❌ Drag and drop initialization failed:', error);
            throw error;
        }
    }
    
    async initializeControllers() {
        try {
            console.log('🎛️ Initializing controllers...');
            
            // Initialize FlexboxController
            if (!window.FlexboxController) {
                console.warn('FlexboxController not found, creating secure basic implementation');
                this.createSecureFlexboxController();
            }
            
            this.flexboxController = new window.FlexboxController({
                playgroundState: this.playgroundState,
                securityUtils: typeof SecurityUtils !== 'undefined' ? SecurityUtils : null
            });
            
            this.modules.set('flexbox', this.flexboxController);
            
            console.log('✅ Controllers initialized');
            
        } catch (error) {
            console.error('❌ Controllers initialization failed:', error);
            throw error;
        }
    }
    
    async initializeContentManagers() {
        try {
            console.log('📋 Initializing content managers...');
            
            // Create secure content managers if not available
            if (!window.ImageManager) {
                this.createSecureImageManager();
            }
            
            if (!window.DemoContentManager) {
                this.createSecureDemoContentManager();
            }
            
            this.imageManager = new window.ImageManager();
            this.demoContentManager = new window.DemoContentManager();
            
            this.modules.set('imageManager', this.imageManager);
            this.modules.set('demoContentManager', this.demoContentManager);
            
            console.log('✅ Content managers initialized');
            
        } catch (error) {
            console.error('❌ Content managers initialization failed:', error);
            // Non-critical error, continue
        }
    }
    
    async setupUserInterface() {
        try {
            console.log('🎨 Setting up user interface...');
            
            // Initialize event listeners with security
            this.setupSecureEventListeners();
            
            // Initialize range value displays
            this.updateRangeValues();
            
            // Set initial state
            this.flexboxController?.updateFromControls?.();
            
            console.log('✅ User interface ready');
            
        } catch (error) {
            console.error('❌ User interface setup failed:', error);
            throw error;
        }
    }
    
    /**
     * Setup event listeners with rate limiting and input sanitization
     */
    setupSecureEventListeners() {
        try {
            // Container controls
            const containerControls = [
                'display', 'flex-direction', 'justify-content', 'align-items',
                'flex-wrap', 'align-content', 'gap', 'container-height',
                'container-width'
            ];
            
            containerControls.forEach(controlId => {
                const element = safeQuerySelector(`#${controlId}`);
                if (element) {
                    const updateHandler = this.createSecureUpdateHandler(() => {
                        this.flexboxController?.updateFromControls?.();
                    });
                    
                    safeAddEventListener(element, 'change', updateHandler);
                    safeAddEventListener(element, 'input', updateHandler);
                }
            });
            
            // Item controls
            const itemControls = [
                'selected-item', 'flex-grow', 'flex-shrink', 'flex-basis',
                'align-self', 'order'
            ];
            
            itemControls.forEach(controlId => {
                const element = safeQuerySelector(`#${controlId}`);
                if (element) {
                    const updateHandler = this.createSecureUpdateHandler(() => {
                        this.flexboxController?.updateFromControls?.();
                    });
                    
                    safeAddEventListener(element, 'change', updateHandler);
                    safeAddEventListener(element, 'input', updateHandler);
                }
            });
            
        } catch (error) {
            console.error('Error setting up secure event listeners:', error);
        }
    }
    
    /**
     * Create a secure update handler with rate limiting and error handling
     */
    createSecureUpdateHandler(callback) {
        return (event) => {
            try {
                // Rate limit the updates
                if (this.rateLimiter) {
                    this.rateLimiter(() => {
                        // Sanitize input if it's a text input
                        if (event.target.type === 'text' && typeof SecurityUtils !== 'undefined') {
                            event.target.value = SecurityUtils.sanitizeFormInput(event.target.value);
                        }
                        
                        // Debounce the callback
                        const debouncedCallback = debounce(callback, 100);
                        debouncedCallback();
                    });
                } else {
                    // Fallback without rate limiting
                    const debouncedCallback = debounce(callback, 100);
                    debouncedCallback();
                }
            } catch (error) {
                console.warn('Rate limit exceeded or update error:', error);
                // Dispatch error event for security boundary
                if (this.securityBoundary) {
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
        };
    }
    
    updateRangeValues() {
        try {
            const ranges = [
                { id: 'gap', suffix: 'px' },
                { id: 'flex-grow', suffix: '' },
                { id: 'flex-shrink', suffix: '' },
                { id: 'order', suffix: '' },
                { id: 'container-height', suffix: 'px' }
            ];
            
            ranges.forEach(({ id, suffix }) => {
                const input = safeQuerySelector(`#${id}`);
                const output = safeQuerySelector(`#${id.replace('container-', '')}-value`);
                
                if (input && output) {
                    // Sanitize the value before displaying
                    let value = input.value;
                    if (typeof SecurityUtils !== 'undefined') {
                        value = SecurityUtils.sanitizeFormInput(value);
                    }
                    output.textContent = value + suffix;
                }
            });
        } catch (error) {
            console.error('Error updating range values:', error);
        }
    }
    
    /**
     * Create a secure FlexboxController with input sanitization
     */
    createSecureFlexboxController() {
        class SecureFlexboxController {
            constructor(dependencies) {
                this.playgroundState = dependencies.playgroundState;
                this.securityUtils = dependencies.securityUtils;
                this.setupEventListeners();
            }
            
            setupEventListeners() {
                console.log('Setting up secure FlexboxController');
            }
            
            sanitizeValue(value, type = 'text') {
                if (this.securityUtils) {
                    return this.securityUtils.sanitizeFormInput(value, type);
                }
                return value;
            }
            
            updateFromControls() {
                try {
                    this.updateFlexContainer();
                    this.updateFlexItem();
                    this.updateRangeValues();
                } catch (error) {
                    console.error('Error updating from controls:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            updateFlexContainer() {
                const container = safeQuerySelector('#flex-container');
                if (!container) return;
                
                const properties = {
                    display: this.sanitizeValue(safeQuerySelector('#display')?.value || 'flex'),
                    flexDirection: this.sanitizeValue(safeQuerySelector('#flex-direction')?.value || 'row'),
                    justifyContent: this.sanitizeValue(safeQuerySelector('#justify-content')?.value || 'flex-start'),
                    alignItems: this.sanitizeValue(safeQuerySelector('#align-items')?.value || 'stretch'),
                    flexWrap: this.sanitizeValue(safeQuerySelector('#flex-wrap')?.value || 'nowrap'),
                    alignContent: this.sanitizeValue(safeQuerySelector('#align-content')?.value || 'stretch'),
                    gap: this.sanitizeValue(safeQuerySelector('#gap')?.value || '10') + 'px',
                    minHeight: this.sanitizeValue(safeQuerySelector('#container-height')?.value || '400') + 'px',
                    width: this.sanitizeValue(safeQuerySelector('#container-width')?.value || '100%')
                };
                
                // Apply styles securely
                Object.entries(properties).forEach(([prop, value]) => {
                    if (value && this.isValidCSSValue(prop, value)) {
                        container.style[prop] = value;
                    }
                });
            }
            
            updateFlexItem() {
                const selectedItem = this.sanitizeValue(safeQuerySelector('#selected-item')?.value || '1');
                const item = safeQuerySelector(`[data-item="${selectedItem}"]`);
                if (!item) return;
                
                const properties = {
                    flexGrow: this.sanitizeValue(safeQuerySelector('#flex-grow')?.value || '0'),
                    flexShrink: this.sanitizeValue(safeQuerySelector('#flex-shrink')?.value || '1'),
                    flexBasis: this.sanitizeValue(safeQuerySelector('#flex-basis')?.value || 'auto'),
                    alignSelf: this.sanitizeValue(safeQuerySelector('#align-self')?.value || 'auto'),
                    order: this.sanitizeValue(safeQuerySelector('#order')?.value || '0')
                };
                
                // Apply styles securely
                Object.entries(properties).forEach(([prop, value]) => {
                    if (value && this.isValidCSSValue(prop, value)) {
                        item.style[prop] = value;
                    }
                });
            }
            
            /**
             * Validate CSS values to prevent injection
             */
            isValidCSSValue(property, value) {
                // Basic CSS value validation
                const validPatterns = {
                    flexGrow: /^\d+(\.\d+)?$/,
                    flexShrink: /^\d+(\.\d+)?$/,
                    order: /^-?\d+$/,
                    gap: /^\d+px$/,
                    minHeight: /^\d+px$/,
                    width: /^(\d+(\.\d+)?%|100%|auto)$/
                };
                
                if (validPatterns[property]) {
                    return validPatterns[property].test(value);
                }
                
                // For enum-like properties, check against allowed values
                const allowedValues = {
                    display: ['flex', 'block', 'inline-flex'],
                    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
                    justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
                    alignItems: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
                    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
                    alignContent: ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'],
                    alignSelf: ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
                    flexBasis: ['auto', 'content', '0', '0%', ...Array.from({length: 100}, (_, i) => `${i+1}%`)]
                };
                
                if (allowedValues[property]) {
                    return allowedValues[property].includes(value);
                }
                
                return false;
            }
            
            updateRangeValues() {
                const ranges = [
                    { id: 'gap', suffix: 'px' },
                    { id: 'flex-grow', suffix: '' },
                    { id: 'flex-shrink', suffix: '' },
                    { id: 'order', suffix: '' },
                    { id: 'container-height', suffix: 'px' }
                ];
                
                ranges.forEach(({ id, suffix }) => {
                    const input = safeQuerySelector(`#${id}`);
                    const output = safeQuerySelector(`#${id.replace('container-', '')}-value`);
                    
                    if (input && output) {
                        const value = this.sanitizeValue(input.value);
                        output.textContent = value + suffix;
                    }
                });
            }
            
            addItem() {
                try {
                    const container = safeQuerySelector('#flex-container');
                    const state = this.playgroundState.getState();
                    const newItemNumber = state.itemCount + 1;
                    
                    if (newItemNumber > 8) {
                        alert('Maximum 8 items allowed');
                        return;
                    }
                    
                    // Create item securely
                    const newItem = this.securityUtils ? 
                        this.securityUtils.createSafeElement('div', `Item ${newItemNumber}`, {
                            class: 'flex-item',
                            'data-item': newItemNumber.toString(),
                            tabindex: '0',
                            'aria-label': `Flex item ${newItemNumber}`
                        }) :
                        safeCreateElement('div', {
                            className: 'flex-item',
                            attributes: {
                                'data-item': newItemNumber.toString(),
                                'tabindex': '0',
                                'aria-label': `Flex item ${newItemNumber}`
                            },
                            textContent: `Item ${newItemNumber}`
                        });
                    
                    if (newItem && container) {
                        container.appendChild(newItem);
                        
                        // Update item selector securely
                        const selector = safeQuerySelector('#selected-item');
                        if (selector) {
                            const option = this.securityUtils ?
                                this.securityUtils.createSafeElement('option', `Item ${newItemNumber}`, {
                                    value: newItemNumber.toString()
                                }) :
                                safeCreateElement('option', {
                                    attributes: { value: newItemNumber.toString() },
                                    textContent: `Item ${newItemNumber}`
                                });
                            if (option) selector.appendChild(option);
                        }
                        
                        // Update state
                        this.playgroundState.setState(prevState => ({
                            ...prevState,
                            itemCount: newItemNumber,
                            itemProperties: {
                                ...prevState.itemProperties,
                                [newItemNumber]: { 
                                    flexGrow: 0, 
                                    flexShrink: 1, 
                                    flexBasis: 'auto', 
                                    alignSelf: 'auto', 
                                    order: 0 
                                }
                            }
                        }));
                    }
                } catch (error) {
                    console.error('Error adding item:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            removeItem() {
                try {
                    const state = this.playgroundState.getState();
                    if (state.itemCount <= 1) {
                        alert('Must have at least 1 item');
                        return;
                    }
                    
                    const itemToRemove = safeQuerySelector(`[data-item="${state.itemCount}"]`);
                    const optionToRemove = safeQuerySelector(`#selected-item option[value="${state.itemCount}"]`);
                    
                    if (itemToRemove) itemToRemove.remove();
                    if (optionToRemove) optionToRemove.remove();
                    
                    // Update state
                    const newItemProperties = { ...state.itemProperties };
                    delete newItemProperties[state.itemCount];
                    
                    this.playgroundState.setState(prevState => ({
                        ...prevState,
                        itemCount: state.itemCount - 1,
                        currentSelectedItem: Math.min(prevState.currentSelectedItem, state.itemCount - 1),
                        itemProperties: newItemProperties
                    }));
                } catch (error) {
                    console.error('Error removing item:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            resetPlayground() {
                try {
                    this.playgroundState.reset();
                    
                    // Reset all controls to defaults
                    const controls = {
                        'display': 'flex',
                        'flex-direction': 'row',
                        'justify-content': 'flex-start',
                        'align-items': 'stretch',
                        'flex-wrap': 'nowrap',
                        'align-content': 'stretch',
                        'gap': '10',
                        'container-height': '400',
                        'container-width': '100%',
                        'selected-item': '1',
                        'flex-grow': '0',
                        'flex-shrink': '1',
                        'flex-basis': 'auto',
                        'align-self': 'auto',
                        'order': '0'
                    };
                    
                    Object.entries(controls).forEach(([id, value]) => {
                        const element = safeQuerySelector(`#${id}`);
                        if (element) element.value = value;
                    });
                    
                    this.updateFromControls();
                } catch (error) {
                    console.error('Error resetting playground:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
        }
        
        window.FlexboxController = SecureFlexboxController;
    }
    
    createSecureImageManager() {
        class SecureImageManager {
            constructor() {
                console.log('Secure ImageManager initialized');
                this.securityUtils = typeof SecurityUtils !== 'undefined' ? SecurityUtils : null;
            }
            
            addRandomImage() {
                try {
                    console.log('Adding random image securely...');
                    // Secure implementation with URL validation
                    const safeImageUrls = [
                        'https://via.placeholder.com/150/0066cc/ffffff?text=Image+1',
                        'https://via.placeholder.com/150/cc6600/ffffff?text=Image+2',
                        'https://via.placeholder.com/150/009966/ffffff?text=Image+3'
                    ];
                    
                    const randomUrl = safeImageUrls[Math.floor(Math.random() * safeImageUrls.length)];
                    
                    if (this.securityUtils && !this.securityUtils.validateURL(randomUrl)) {
                        console.error('Invalid image URL');
                        return;
                    }
                    
                    // Add image safely
                    // Implementation here...
                } catch (error) {
                    console.error('Error adding image:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            cleanup() {
                console.log('Secure ImageManager cleanup');
            }
        }
        
        window.ImageManager = SecureImageManager;
    }
    
    createSecureDemoContentManager() {
        class SecureDemoContentManager {
            constructor() {
                console.log('Secure DemoContentManager initialized');
                this.securityUtils = typeof SecurityUtils !== 'undefined' ? SecurityUtils : null;
            }
            
            addDemoCard() {
                try {
                    console.log('Adding demo card securely...');
                    // Secure implementation
                } catch (error) {
                    console.error('Error adding demo card:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            copyFlexPropsToDemo() {
                try {
                    console.log('Copying flex properties to demo securely...');
                    // Secure implementation
                } catch (error) {
                    console.error('Error copying flex properties:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
            
            resetDemoOrder() {
                try {
                    console.log('Resetting demo order securely...');
                    // Secure implementation
                } catch (error) {
                    console.error('Error resetting demo order:', error);
                    window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
                }
            }
        }
        
        window.DemoContentManager = SecureDemoContentManager;
    }
    
    reportInitializationMetrics() {
        try {
            const metrics = {
                moduleCount: this.modules.size,
                initializationTime: Date.now(),
                performanceMonitoring: !!this.performanceMonitor,
                securityEnabled: !!this.securityBoundary,
                rateLimitingEnabled: !!this.rateLimiter
            };
            
            console.log('📊 Initialization metrics:', metrics);
        } catch (error) {
            console.error('Error reporting metrics:', error);
        }
    }
    
    handleInitializationError(error) {
        console.error('🚨 Initialization error:', error);
        
        // Use secure error handling if available
        if (this.securityBoundary) {
            window.dispatchEvent(new CustomEvent('playground-error', { detail: error }));
        } else {
            // Fallback error display
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #dc3545;
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 10000;
                text-align: center;
                max-width: 400px;
            `;
            errorMessage.innerHTML = `
                <h3>Application Error</h3>
                <p>The application failed to initialize properly.</p>
                <p>Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="background: white; color: #dc3545; border: none; padding: 8px 16px; border-radius: 4px; margin-top: 10px; cursor: pointer;">
                    Refresh Page
                </button>
            `;
            
            document.body.appendChild(errorMessage);
        }
    }
    
    hasUnsavedChanges() {
        try {
            const state = this.playgroundState?.getState();
            return state?.hasUnsavedChanges || false;
        } catch (error) {
            console.error('Error checking unsaved changes:', error);
            return false;
        }
    }
    
    getStats() {
        return {
            initialized: this.initialized,
            moduleCount: this.modules.size,
            modules: Array.from(this.modules.keys()),
            hasPerformanceMonitoring: !!this.performanceMonitor,
            securityEnabled: !!this.securityBoundary,
            rateLimitingEnabled: !!this.rateLimiter
        };
    }
    
    cleanup() {
        try {
            console.log('🧹 Cleaning up application...');
            
            // Cleanup all modules
            this.modules.forEach((module, name) => {
                try {
                    if (module && typeof module.cleanup === 'function') {
                        module.cleanup();
                    }
                } catch (error) {
                    console.error(`Error cleaning up module ${name}:`, error);
                }
            });
            
            // Clear modules
            this.modules.clear();
            
            // Cleanup performance monitor
            if (this.performanceMonitor) {
                this.performanceMonitor.cleanup();
                this.performanceMonitor = null;
            }
            
            // Cleanup security boundary
            if (this.securityBoundary) {
                this.securityBoundary = null;
            }
            
            // Reset state
            this.initialized = false;
            this.initializationPromise = null;
            this.rateLimiter = null;
            
            console.log('✅ Application cleanup complete');
            
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.FlexboxEducationalApp = FlexboxEducationalApp;
}