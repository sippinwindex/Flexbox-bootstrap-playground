/**
 * main.js - Main Application Class
 * Orchestrates all components and handles initialization
 */

class FlexboxEducationalApp {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.performanceMonitor = null;
        this.initializationPromise = null;
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.cleanup = this.cleanup.bind(this);
        this.hasUnsavedChanges = this.hasUnsavedChanges.bind(this);
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
                console.warn('FlexboxController not found, creating basic implementation');
                this.createBasicFlexboxController();
            }
            
            this.flexboxController = new window.FlexboxController({
                playgroundState: this.playgroundState
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
            
            // Create basic content managers if not available
            if (!window.ImageManager) {
                this.createBasicImageManager();
            }
            
            if (!window.DemoContentManager) {
                this.createBasicDemoContentManager();
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
            
            // Initialize event listeners
            this.setupEventListeners();
            
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
    
    setupEventListeners() {
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
                    const updateHandler = debounce(() => {
                        this.flexboxController?.updateFromControls?.();
                    }, 100);
                    
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
                    const updateHandler = debounce(() => {
                        this.flexboxController?.updateFromControls?.();
                    }, 100);
                    
                    safeAddEventListener(element, 'change', updateHandler);
                    safeAddEventListener(element, 'input', updateHandler);
                }
            });
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
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
                    output.textContent = input.value + suffix;
                }
            });
        } catch (error) {
            console.error('Error updating range values:', error);
        }
    }
    
    createBasicFlexboxController() {
        // Basic fallback implementation
        class BasicFlexboxController {
            constructor(dependencies) {
                this.playgroundState = dependencies.playgroundState;
                this.setupEventListeners();
            }
            
            setupEventListeners() {
                // Basic event listener setup
                console.log('Setting up basic FlexboxController');
            }
            
            updateFromControls() {
                try {
                    this.updateFlexContainer();
                    this.updateFlexItem();
                    this.updateRangeValues();
                } catch (error) {
                    console.error('Error updating from controls:', error);
                }
            }
            
            updateFlexContainer() {
                const container = safeQuerySelector('#flex-container');
                if (!container) return;
                
                const properties = {
                    display: safeQuerySelector('#display')?.value || 'flex',
                    flexDirection: safeQuerySelector('#flex-direction')?.value || 'row',
                    justifyContent: safeQuerySelector('#justify-content')?.value || 'flex-start',
                    alignItems: safeQuerySelector('#align-items')?.value || 'stretch',
                    flexWrap: safeQuerySelector('#flex-wrap')?.value || 'nowrap',
                    alignContent: safeQuerySelector('#align-content')?.value || 'stretch',
                    gap: (safeQuerySelector('#gap')?.value || '10') + 'px',
                    minHeight: (safeQuerySelector('#container-height')?.value || '400') + 'px',
                    width: safeQuerySelector('#container-width')?.value || '100%'
                };
                
                Object.entries(properties).forEach(([prop, value]) => {
                    if (value) container.style[prop] = value;
                });
            }
            
            updateFlexItem() {
                const selectedItem = safeQuerySelector('#selected-item')?.value || '1';
                const item = safeQuerySelector(`[data-item="${selectedItem}"]`);
                if (!item) return;
                
                const properties = {
                    flexGrow: safeQuerySelector('#flex-grow')?.value || '0',
                    flexShrink: safeQuerySelector('#flex-shrink')?.value || '1',
                    flexBasis: safeQuerySelector('#flex-basis')?.value || 'auto',
                    alignSelf: safeQuerySelector('#align-self')?.value || 'auto',
                    order: safeQuerySelector('#order')?.value || '0'
                };
                
                Object.entries(properties).forEach(([prop, value]) => {
                    if (value) item.style[prop] = value;
                });
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
                        output.textContent = input.value + suffix;
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
                    
                    const newItem = safeCreateElement('div', {
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
                        
                        // Update item selector
                        const selector = safeQuerySelector('#selected-item');
                        if (selector) {
                            const option = safeCreateElement('option', {
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
                }
            }
        }
        
        window.FlexboxController = BasicFlexboxController;
    }
    
    createBasicImageManager() {
        class BasicImageManager {
            constructor() {
                console.log('Basic ImageManager initialized');
            }
            
            addRandomImage() {
                console.log('Adding random image...');
                // Basic implementation
            }
            
            cleanup() {
                console.log('ImageManager cleanup');
            }
        }
        
        window.ImageManager = BasicImageManager;
    }
    
    createBasicDemoContentManager() {
        class BasicDemoContentManager {
            constructor() {
                console.log('Basic DemoContentManager initialized');
            }
            
            addDemoCard() {
                console.log('Adding demo card...');
                // Basic implementation
            }
            
            copyFlexPropsToDemo() {
                console.log('Copying flex properties to demo...');
                // Basic implementation
            }
            
            resetDemoOrder() {
                console.log('Resetting demo order...');
                // Basic implementation
            }
        }
        
        window.DemoContentManager = BasicDemoContentManager;
    }
    
    reportInitializationMetrics() {
        try {
            const metrics = {
                moduleCount: this.modules.size,
                initializationTime: Date.now(),
                performanceMonitoring: !!this.performanceMonitor
            };
            
            console.log('📊 Initialization metrics:', metrics);
        } catch (error) {
            console.error('Error reporting metrics:', error);
        }
    }
    
    handleInitializationError(error) {
        console.error('🚨 Initialization error:', error);
        
        // Show user-friendly error message
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
            hasPerformanceMonitoring: !!this.performanceMonitor
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
            
            // Reset state
            this.initialized = false;
            this.initializationPromise = null;
            
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