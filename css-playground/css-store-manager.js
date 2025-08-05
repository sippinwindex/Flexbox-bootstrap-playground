// js/core/app-state.js

const AppState = {
    // Current state
    currentTab: 'layout',
    isFullscreen: false,
    measurementsEnabled: false,
    propertyGuideEnabled: false,
    keyboardShortcutsVisible: false,
    
    // Element management
    elementCounts: {
        layout: 3,
        typography: 2,
        colors: 2,
        sizing: 1,
        borders: 1,
        effects: 2,
        animations: 2,
        advanced: 4,
        learning: 1
    },
    
    selectedElements: {
        layout: new Set(),
        typography: new Set(),
        colors: new Set(),
        sizing: new Set(),
        borders: new Set(),
        effects: new Set(),
        animations: new Set(),
        advanced: new Set(),
        learning: new Set()
    },
    
    // Property values storage
    propertyValues: {
        layout: {},
        typography: {},
        colors: {},
        sizing: {},
        borders: {},
        effects: {},
        animations: {},
        advanced: {}
    },
    
    // Learning progress
    learningProgress: {
        completedChallenges: new Set(),
        currentChallenge: null,
        progressPercentage: 0,
        unlockedFeatures: new Set(['layout', 'typography', 'colors'])
    },
    
    // Visual tools state
    visualTools: {
        measurements: false,
        guides: false,
        inspector: false,
        rulers: false,
        colorPicker: false
    },
    
    // Performance tracking
    performance: {
        loadTime: 0,
        interactionCount: 0,
        errorCount: 0,
        lastUpdate: Date.now()
    },
    
    // Event listeners
    listeners: new Map(),
    
    // Initialize the application state
    init() {
        console.log('🚀 Initializing App State...');
        
        // Load saved state from localStorage
        this.loadState();
        
        // Set up performance tracking
        this.performance.loadTime = performance.now();
        
        // Initialize property values with defaults
        this.initializeDefaults();
        
        // Set up state change listeners
        this.setupStateListeners();
        
        console.log('✅ App State initialized');
        return this;
    },
    
    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem('css-playground-state');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Merge saved state with current state
                Object.assign(this.propertyValues, state.propertyValues || {});
                Object.assign(this.visualTools, state.visualTools || {});
                Object.assign(this.learningProgress, state.learningProgress || {});
                
                // Convert arrays back to Sets for learning progress
                if (state.learningProgress?.completedChallenges) {
                    this.learningProgress.completedChallenges = new Set(state.learningProgress.completedChallenges);
                }
                if (state.learningProgress?.unlockedFeatures) {
                    this.learningProgress.unlockedFeatures = new Set(state.learningProgress.unlockedFeatures);
                }
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    },
    
    // Save current state to localStorage
    saveState() {
        try {
            const stateToSave = {
                propertyValues: this.propertyValues,
                visualTools: this.visualTools,
                learningProgress: {
                    ...this.learningProgress,
                    completedChallenges: Array.from(this.learningProgress.completedChallenges),
                    unlockedFeatures: Array.from(this.learningProgress.unlockedFeatures)
                },
                timestamp: Date.now()
            };
            
            localStorage.setItem('css-playground-state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Failed to save state:', error);
        }
    },
    
    // Initialize default property values
    initializeDefaults() {
        const defaults = {
            layout: {
                display: 'flex',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'nowrap'
            },
            typography: {
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18',
                fontWeight: '400',
                lineHeight: '1.6',
                letterSpacing: '0',
                textTransform: 'none',
                textAlign: 'left'
            },
            colors: {
                textColor: '#495057',
                bgColor: '#667eea',
                bgType: 'solid',
                opacity: '1',
                gradientStart: '#667eea',
                gradientEnd: '#764ba2',
                gradientAngle: '45'
            },
            effects: {
                shadowX: '0',
                shadowY: '4',
                shadowBlur: '15',
                shadowSpread: '0',
                shadowColor: '#000000',
                rotate: '0',
                scale: '1',
                translateX: '0',
                translateY: '0',
                filterBlur: '0',
                brightness: '100',
                contrast: '100',
                saturation: '100',
                hueRotate: '0',
                sepia: '0'
            },
            animations: {
                type: 'none',
                duration: '2',
                timing: 'ease',
                iteration: 'infinite',
                direction: 'normal',
                transitionDuration: '0.3',
                transitionProperty: 'all'
            }
        };
        
        // Merge defaults with existing values
        Object.keys(defaults).forEach(category => {
            if (!this.propertyValues[category]) {
                this.propertyValues[category] = {};
            }
            Object.assign(this.propertyValues[category], defaults[category]);
        });
    },
    
    // Set up state change listeners
    setupStateListeners() {
        // Listen for tab changes
        this.on('tabChanged', (newTab) => {
            this.currentTab = newTab;
            this.saveState();
        });
        
        // Listen for property changes
        this.on('propertyChanged', (category, property, value) => {
            if (!this.propertyValues[category]) {
                this.propertyValues[category] = {};
            }
            this.propertyValues[category][property] = value;
            this.saveState();
        });
        
        // Listen for learning progress
        this.on('challengeCompleted', (challengeId) => {
            this.learningProgress.completedChallenges.add(challengeId);
            this.updateLearningProgress();
            this.saveState();
        });
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveState();
        }, 30000);
    },
    
    // Event system
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    },
    
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    },
    
    emit(event, ...args) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    },
    
    // State getters and setters
    getCurrentTab() {
        return this.currentTab;
    },
    
    setCurrentTab(tab) {
        const oldTab = this.currentTab;
        this.currentTab = tab;
        this.emit('tabChanged', tab, oldTab);
    },
    
    getPropertyValue(category, property) {
        return this.propertyValues[category]?.[property];
    },
    
    setPropertyValue(category, property, value) {
        if (!this.propertyValues[category]) {
            this.propertyValues[category] = {};
        }
        const oldValue = this.propertyValues[category][property];
        this.propertyValues[category][property] = value;
        this.emit('propertyChanged', category, property, value, oldValue);
    },
    
    // Element management
    addElement(category) {
        this.elementCounts[category]++;
        this.emit('elementAdded', category, this.elementCounts[category]);
        return this.elementCounts[category];
    },
    
    removeElement(category, index) {
        if (this.elementCounts[category] > 1) {
            this.elementCounts[category]--;
            this.selectedElements[category].delete(index);
            this.emit('elementRemoved', category, index);
        }
    },
    
    selectElement(category, index) {
        this.selectedElements[category].clear();
        this.selectedElements[category].add(index);
        this.emit('elementSelected', category, index);
    },
    
    toggleElementSelection(category, index) {
        if (this.selectedElements[category].has(index)) {
            this.selectedElements[category].delete(index);
        } else {
            this.selectedElements[category].add(index);
        }
        this.emit('elementSelectionToggled', category, index);
    },
    
    getSelectedElements(category) {
        return Array.from(this.selectedElements[category]);
    },
    
    clearElements(category) {
        const defaultCount = category === 'layout' ? 3 : 2;
        this.elementCounts[category] = defaultCount;
        this.selectedElements[category].clear();
        this.emit('elementsCleared', category);
    },
    
    // Visual tools
    toggleVisualTool(tool) {
        this.visualTools[tool] = !this.visualTools[tool];
        this.emit('visualToolToggled', tool, this.visualTools[tool]);
        this.saveState();
        return this.visualTools[tool];
    },
    
    getVisualToolState(tool) {
        return this.visualTools[tool];
    },
    
    // Learning progress
    updateLearningProgress() {
        const totalChallenges = 12; // Define total number of challenges
        const completed = this.learningProgress.completedChallenges.size;
        this.learningProgress.progressPercentage = Math.round((completed / totalChallenges) * 100);
        
        // Unlock new features based on progress
        if (completed >= 2 && !this.learningProgress.unlockedFeatures.has('effects')) {
            this.learningProgress.unlockedFeatures.add('effects');
            this.emit('featureUnlocked', 'effects');
        }
        if (completed >= 4 && !this.learningProgress.unlockedFeatures.has('animations')) {
            this.learningProgress.unlockedFeatures.add('animations');
            this.emit('featureUnlocked', 'animations');
        }
        if (completed >= 8 && !this.learningProgress.unlockedFeatures.has('advanced')) {
            this.learningProgress.unlockedFeatures.add('advanced');
            this.emit('featureUnlocked', 'advanced');
        }
    },
    
    completeChallenge(challengeId) {
        if (!this.learningProgress.completedChallenges.has(challengeId)) {
            this.learningProgress.completedChallenges.add(challengeId);
            this.updateLearningProgress();
            this.emit('challengeCompleted', challengeId);
            return true;
        }
        return false;
    },
    
    isChallengeCompleted(challengeId) {
        return this.learningProgress.completedChallenges.has(challengeId);
    },
    
    isFeatureUnlocked(feature) {
        return this.learningProgress.unlockedFeatures.has(feature);
    },
    
    // Performance tracking
    incrementInteraction() {
        this.performance.interactionCount++;
        this.performance.lastUpdate = Date.now();
    },
    
    recordError(error) {
        this.performance.errorCount++;
        console.error('App State Error:', error);
    },
    
    getPerformanceStats() {
        return {
            ...this.performance,
            uptime: Date.now() - this.performance.loadTime
        };
    },
    
    // Utility methods
    reset() {
        // Reset to default state
        this.currentTab = 'layout';
        this.isFullscreen = false;
        this.measurementsEnabled = false;
        this.propertyGuideEnabled = false;
        
        // Reset element counts
        Object.keys(this.elementCounts).forEach(category => {
            this.elementCounts[category] = category === 'layout' ? 3 : 
                                          category === 'advanced' ? 4 : 
                                          category === 'learning' ? 1 : 2;
            this.selectedElements[category].clear();
        });
        
        // Reset property values
        this.initializeDefaults();
        
        // Reset visual tools
        Object.keys(this.visualTools).forEach(tool => {
            this.visualTools[tool] = false;
        });
        
        // Clear saved state
        localStorage.removeItem('css-playground-state');
        
        this.emit('stateReset');
        console.log('🔄 App state reset to defaults');
    },
    
    export() {
        return {
            propertyValues: this.propertyValues,
            learningProgress: {
                ...this.learningProgress,
                completedChallenges: Array.from(this.learningProgress.completedChallenges),
                unlockedFeatures: Array.from(this.learningProgress.unlockedFeatures)
            },
            elementCounts: this.elementCounts,
            visualTools: this.visualTools,
            performance: this.getPerformanceStats(),
            exportDate: new Date().toISOString()
        };
    },
    
    import(stateData) {
        try {
            if (stateData.propertyValues) {
                this.propertyValues = stateData.propertyValues;
            }
            
            if (stateData.learningProgress) {
                this.learningProgress = {
                    ...stateData.learningProgress,
                    completedChallenges: new Set(stateData.learningProgress.completedChallenges || []),
                    unlockedFeatures: new Set(stateData.learningProgress.unlockedFeatures || [])
                };
            }
            
            if (stateData.elementCounts) {
                this.elementCounts = stateData.elementCounts;
            }
            
            if (stateData.visualTools) {
                this.visualTools = stateData.visualTools;
            }
            
            this.saveState();
            this.emit('stateImported', stateData);
            console.log('📥 App state imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            this.recordError(error);
            return false;
        }
    }
};

// Make AppState globally available
window.AppState = AppState;