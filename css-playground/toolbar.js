// js/components/toolbar.js - Visual Toolbar Component

const Toolbar = {
    // Toolbar state
    isVisible: true,
    activeTools: new Set(),
    
    // Toolbar tools configuration
    tools: [
        {
            id: 'measurements',
            title: 'Measurements',
            icon: 'bi-rulers',
            description: 'Show element measurements and spacing',
            shortcut: 'Alt+M',
            toggle: true
        },
        {
            id: 'guides',
            title: 'Guides',
            icon: 'bi-grid',
            description: 'Show alignment guides and grids',
            shortcut: 'Alt+G',
            toggle: true
        },
        {
            id: 'inspector',
            title: 'Element Inspector',
            icon: 'bi-search',
            description: 'Inspect element properties',
            shortcut: 'Alt+I',
            toggle: true
        },
        {
            id: 'rulers',
            title: 'Rulers',
            icon: 'bi-distribute-horizontal',
            description: 'Show horizontal and vertical rulers',
            shortcut: 'Alt+R',
            toggle: true
        },
        {
            id: 'colorPicker',
            title: 'Color Picker',
            icon: 'bi-eyedropper',
            description: 'Pick colors from elements',
            shortcut: 'Alt+C',
            toggle: true
        },
        {
            id: 'screenshot',
            title: 'Screenshot',
            icon: 'bi-camera',
            description: 'Take screenshot of the demo area',
            shortcut: 'Alt+S',
            action: true
        },
        {
            id: 'fullscreen',
            title: 'Fullscreen',
            icon: 'bi-fullscreen',
            description: 'Toggle fullscreen mode',
            shortcut: 'F11',
            toggle: true
        },
        {
            id: 'reset',
            title: 'Reset View',
            icon: 'bi-arrow-clockwise',
            description: 'Reset all visual tools',
            shortcut: 'Alt+0',
            action: true
        }
    ],
    
    // Initialize toolbar
    init() {
        console.log('🔧 Initializing Toolbar...');
        
        // Render toolbar
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Initialize tools
        this.initializeTools();
        
        console.log('✅ Toolbar initialized');
        return this;
    },
    
    // Render toolbar HTML
    render() {
        const container = document.getElementById('visual-toolbar');
        if (!container) return;
        
        container.innerHTML = `
            <div class="toolbar-container">
                <div class="toolbar-header">
                    <h5 class="toolbar-title">
                        <i class="bi bi-tools me-2"></i>
                        Visual Tools
                    </h5>
                    <div class="toolbar-controls">
                        <button class="btn btn-sm btn-outline-secondary" id="toolbar-toggle" 
                                title="Toggle toolbar visibility">
                            <i class="bi bi-chevron-up"></i>
                        </button>
                    </div>
                </div>
                
                <div class="toolbar-content" id="toolbar-content">
                    <div class="toolbar-tools">
                        ${this.renderTools()}
                    </div>
                    
                    <div class="toolbar-presets">
                        ${this.renderPresets()}
                    </div>
                    
                    <div class="toolbar-actions">
                        ${this.renderActions()}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render tools
    renderTools() {
        const toggleTools = this.tools.filter(tool => tool.toggle);
        
        return `
            <div class="tool-group">
                <label class="tool-group-label">Visual Aids</label>
                <div class="tool-buttons">
                    ${toggleTools.map(tool => this.renderToolButton(tool)).join('')}
                </div>
            </div>
        `;
    },
    
    // Render tool button
    renderToolButton(tool) {
        const isActive = this.activeTools.has(tool.id);
        const activeClass = isActive ? 'active' : '';
        
        return `
            <button class="tool-btn ${activeClass}" 
                    data-tool-id="${tool.id}" 
                    data-tool-type="${tool.toggle ? 'toggle' : 'action'}"
                    title="${tool.description} (${tool.shortcut})"
                    aria-pressed="${isActive}">
                <i class="${tool.icon}"></i>
                <span class="tool-label">${tool.title}</span>
                <div class="tool-tooltip">${tool.description}</div>
            </button>
        `;
    },
    
    // Render presets
    renderPresets() {
        return `
            <div class="tool-group">
                <label class="tool-group-label">Quick Presets</label>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="minimal" title="Minimal view">
                        <i class="bi bi-eye"></i>
                        <span>Minimal</span>
                    </button>
                    <button class="preset-btn" data-preset="developer" title="Developer view">
                        <i class="bi bi-code-square"></i>
                        <span>Developer</span>
                    </button>
                    <button class="preset-btn" data-preset="designer" title="Designer view">
                        <i class="bi bi-palette2"></i>
                        <span>Designer</span>
                    </button>
                    <button class="preset-btn" data-preset="presentation" title="Presentation mode">
                        <i class="bi bi-display"></i>
                        <span>Present</span>
                    </button>
                </div>
            </div>
        `;
    },
    
    // Render actions
    renderActions() {
        const actionTools = this.tools.filter(tool => tool.action);
        
        return `
            <div class="tool-group">
                <label class="tool-group-label">Actions</label>
                <div class="action-buttons">
                    ${actionTools.map(tool => `
                        <button class="action-btn" 
                                data-tool-id="${tool.id}" 
                                data-tool-type="action"
                                title="${tool.description} (${tool.shortcut})">
                            <i class="${tool.icon}"></i>
                            <span>${tool.title}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Toolbar toggle
        const toggleBtn = document.getElementById('toolbar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleToolbar());
        }
        
        // Tool buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tool-btn, .tool-btn *')) {
                const button = e.target.closest('.tool-btn');
                if (button) {
                    const toolId = button.dataset.toolId;
                    const toolType = button.dataset.toolType;
                    
                    if (toolType === 'toggle') {
                        this.toggleTool(toolId);
                    } else if (toolType === 'action') {
                        this.executeTool(toolId);
                    }
                }
            }
        });
        
        // Preset buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.preset-btn, .preset-btn *')) {
                const button = e.target.closest('.preset-btn');
                if (button) {
                    const preset = button.dataset.preset;
                    this.applyPreset(preset);
                }
            }
        });
        
        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.action-btn, .action-btn *')) {
                const button = e.target.closest('.action-btn');
                if (button) {
                    const toolId = button.dataset.toolId;
                    this.executeTool(toolId);
                }
            }
        });
    },
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check for tool shortcuts
            this.tools.forEach(tool => {
                if (this.matchesShortcut(e, tool.shortcut)) {
                    e.preventDefault();
                    
                    if (tool.toggle) {
                        this.toggleTool(tool.id);
                    } else if (tool.action) {
                        this.executeTool(tool.id);
                    }
                }
            });
            
            // Additional shortcuts
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.toggleToolbar();
            }
        });
    },
    
    // Check if event matches shortcut
    matchesShortcut(event, shortcut) {
        const parts = shortcut.toLowerCase().split('+');
        
        let hasCtrl = parts.includes('ctrl');
        let hasAlt = parts.includes('alt');
        let hasShift = parts.includes('shift');
        let key = parts[parts.length - 1];
        
        // Handle special keys
        if (key === 'f11') {
            return event.key === 'F11';
        }
        
        return (
            (!hasCtrl || event.ctrlKey || event.metaKey) &&
            (!hasAlt || event.altKey) &&
            (!hasShift || event.shiftKey) &&
            event.key.toLowerCase() === key
        );
    },
    
    // Initialize tools
    initializeTools() {
        // Load saved tool states from AppState
        if (window.AppState) {
            this.tools.forEach(tool => {
                if (tool.toggle) {
                    const isActive = AppState.getVisualToolState(tool.id);
                    if (isActive) {
                        this.activeTools.add(tool.id);
                        this.updateToolButton(tool.id, true);
                    }
                }
            });
        }
    },
    
    // Toggle tool
    toggleTool(toolId) {
        const isActive = this.activeTools.has(toolId);
        const newState = !isActive;
        
        if (newState) {
            this.activeTools.add(toolId);
        } else {
            this.activeTools.delete(toolId);
        }
        
        // Update UI
        this.updateToolButton(toolId, newState);
        
        // Update app state
        if (window.AppState) {
            AppState.toggleVisualTool(toolId);
        }
        
        // Execute tool logic
        this.executeToolLogic(toolId, newState);
        
        // Emit event
        if (window.EventManager) {
            EventManager.emit('toolbar:toolToggled', toolId, newState);
        }
    },
    
    // Execute tool action
    executeTool(toolId) {
        // Execute tool logic
        this.executeToolLogic(toolId, true);
        
        // Emit event
        if (window.EventManager) {
            EventManager.emit('toolbar:toolExecuted', toolId);
        }
    },
    
    // Execute tool logic
    executeToolLogic(toolId, state) {
        switch (toolId) {
            case 'measurements':
                this.toggleMeasurements(state);
                break;
            case 'guides':
                this.toggleGuides(state);
                break;
            case 'inspector':
                this.toggleInspector(state);
                break;
            case 'rulers':
                this.toggleRulers(state);
                break;
            case 'colorPicker':
                this.toggleColorPicker(state);
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
            case 'screenshot':
                this.takeScreenshot();
                break;
            case 'reset':
                this.resetAllTools();
                break;
        }
    },
    
    // Tool implementations
    toggleMeasurements(state) {
        const demoArea = document.querySelector('.demo-area');
        if (demoArea) {
            demoArea.classList.toggle('show-measurements', state);
            
            if (state) {
                this.addMeasurementOverlays();
            } else {
                this.removeMeasurementOverlays();
            }
        }
    },
    
    toggleGuides(state) {
        const demoArea = document.querySelector('.demo-area');
        if (demoArea) {
            demoArea.classList.toggle('show-guides', state);
            
            if (state) {
                this.addGuideOverlays();
            } else {
                this.removeGuideOverlays();
            }
        }
    },
    
    toggleInspector(state) {
        if (state) {
            this.enableElementInspection();
        } else {
            this.disableElementInspection();
        }
    },
    
    toggleRulers(state) {
        const container = document.querySelector('.container');
        if (container) {
            container.classList.toggle('show-rulers', state);
            
            if (state) {
                this.addRulers();
            } else {
                this.removeRulers();
            }
        }
    },
    
    toggleColorPicker(state) {
        if (state) {
            this.enableColorPicker();
        } else {
            this.disableColorPicker();
        }
    },
    
    toggleFullscreen() {
        const isFullscreen = document.fullscreenElement !== null;
        
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    },
    
    takeScreenshot() {
        if (window.html2canvas) {
            const demoArea = document.querySelector('.demo-area');
            if (demoArea) {
                html2canvas(demoArea).then(canvas => {
                    // Create download link
                    const link = document.createElement('a');
                    link.download = `css-playground-${Date.now()}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            }
        } else {
            this.showToast('Screenshot feature requires html2canvas library', 'warning');
        }
    },
    
    resetAllTools() {
        // Deactivate all tools
        this.activeTools.clear();
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Reset visual aids
        this.removeMeasurementOverlays();
        this.removeGuideOverlays();
        this.removeRulers();
        this.disableElementInspection();
        this.disableColorPicker();
        
        // Update app state
        if (window.AppState) {
            Object.keys(AppState.visualTools).forEach(tool => {
                AppState.visualTools[tool] = false;
            });
        }
        
        this.showToast('All visual tools reset', 'info');
    },
    
    // Measurement overlays
    addMeasurementOverlays() {
        const elements = document.querySelectorAll('.demo-element');
        elements.forEach(element => {
            this.addMeasurementToElement(element);
        });
    },
    
    addMeasurementToElement(element) {
        const rect = element.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = 'measurement-overlay';
        overlay.innerHTML = `
            <div class="measurement-label">
                ${Math.round(rect.width)} × ${Math.round(rect.height)}
            </div>
        `;
        
        overlay.style.cssText = `
            position: absolute;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            pointer-events: none;
            border: 1px dashed #007bff;
            background: rgba(0, 123, 255, 0.1);
            z-index: 1000;
        `;
        
        document.body.appendChild(overlay);
    },
    
    removeMeasurementOverlays() {
        document.querySelectorAll('.measurement-overlay').forEach(overlay => {
            overlay.remove();
        });
    },
    
    // Guide overlays
    addGuideOverlays() {
        const guideOverlay = document.createElement('div');
        guideOverlay.className = 'guide-overlay';
        guideOverlay.innerHTML = `
            <div class="guide-grid"></div>
        `;
        
        guideOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
            background-image: 
                linear-gradient(rgba(0,123,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,123,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        `;
        
        document.body.appendChild(guideOverlay);
    },
    
    removeGuideOverlays() {
        document.querySelectorAll('.guide-overlay').forEach(overlay => {
            overlay.remove();
        });
    },
    
    // Rulers
    addRulers() {
        // Horizontal ruler
        const hRuler = document.createElement('div');
        hRuler.className = 'ruler ruler-horizontal';
        hRuler.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            z-index: 1001;
            font-size: 10px;
            overflow: hidden;
        `;
        
        // Vertical ruler
        const vRuler = document.createElement('div');
        vRuler.className = 'ruler ruler-vertical';
        vRuler.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 100%;
            background: #f8f9fa;
            border-right: 1px solid #dee2e6;
            z-index: 1001;
            font-size: 10px;
            overflow: hidden;
        `;
        
        // Add tick marks
        this.addRulerTicks(hRuler, 'horizontal');
        this.addRulerTicks(vRuler, 'vertical');
        
        document.body.appendChild(hRuler);
        document.body.appendChild(vRuler);
    },
    
    addRulerTicks(ruler, direction) {
        const isHorizontal = direction === 'horizontal';
        const size = isHorizontal ? window.innerWidth : window.innerHeight;
        
        for (let i = 0; i < size; i += 10) {
            const tick = document.createElement('div');
            tick.className = 'ruler-tick';
            
            if (isHorizontal) {
                tick.style.cssText = `
                    position: absolute;
                    left: ${i}px;
                    top: 0;
                    width: 1px;
                    height: ${i % 100 === 0 ? '20px' : i % 50 === 0 ? '15px' : '10px'};
                    background: #6c757d;
                `;
                
                if (i % 100 === 0) {
                    const label = document.createElement('span');
                    label.textContent = i;
                    label.style.cssText = `
                        position: absolute;
                        left: ${i + 2}px;
                        top: 2px;
                        color: #6c757d;
                    `;
                    ruler.appendChild(label);
                }
            } else {
                tick.style.cssText = `
                    position: absolute;
                    top: ${i}px;
                    left: 0;
                    height: 1px;
                    width: ${i % 100 === 0 ? '20px' : i % 50 === 0 ? '15px' : '10px'};
                    background: #6c757d;
                `;
                
                if (i % 100 === 0) {
                    const label = document.createElement('span');
                    label.textContent = i;
                    label.style.cssText = `
                        position: absolute;
                        top: ${i + 2}px;
                        left: 2px;
                        color: #6c757d;
                        writing-mode: vertical-lr;
                        text-orientation: mixed;
                    `;
                    ruler.appendChild(label);
                }
            }
            
            ruler.appendChild(tick);
        }
    },
    
    removeRulers() {
        document.querySelectorAll('.ruler').forEach(ruler => {
            ruler.remove();
        });
    },
    
    // Element inspection
    enableElementInspection() {
        this.inspectionEnabled = true;
        document.addEventListener('mouseover', this.handleInspectionHover);
        document.addEventListener('click', this.handleInspectionClick);
        document.body.style.cursor = 'crosshair';
    },
    
    disableElementInspection() {
        this.inspectionEnabled = false;
        document.removeEventListener('mouseover', this.handleInspectionHover);
        document.removeEventListener('click', this.handleInspectionClick);
        document.body.style.cursor = '';
        this.removeInspectionOverlay();
    },
    
    handleInspectionHover: (e) => {
        if (!this.inspectionEnabled) return;
        
        const element = e.target;
        this.showInspectionOverlay(element);
    },
    
    handleInspectionClick: (e) => {
        if (!this.inspectionEnabled) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        this.inspectElement(element);
    },
    
    showInspectionOverlay(element) {
        this.removeInspectionOverlay();
        
        const rect = element.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = 'inspection-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border: 2px solid #007bff;
            background: rgba(0, 123, 255, 0.1);
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
    },
    
    removeInspectionOverlay() {
        const overlay = document.querySelector('.inspection-overlay');
        if (overlay) {
            overlay.remove();
        }
    },
    
    inspectElement(element) {
        // Show element properties
        const computedStyle = window.getComputedStyle(element);
        const properties = [
            'display', 'position', 'width', 'height', 'margin', 'padding',
            'background-color', 'color', 'font-size', 'font-family'
        ];
        
        const info = properties.map(prop => ({
            property: prop,
            value: computedStyle.getPropertyValue(prop)
        }));
        
        this.showElementInfo(element, info);
    },
    
    showElementInfo(element, properties) {
        // This would show element information in a popup or panel
        console.log('Element info:', element, properties);
    },
    
    // Color picker
    enableColorPicker() {
        document.addEventListener('click', this.handleColorPick);
        document.body.style.cursor = 'crosshair';
    },
    
    disableColorPicker() {
        document.removeEventListener('click', this.handleColorPick);
        document.body.style.cursor = '';
    },
    
    handleColorPick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Show picked colors
        this.showPickedColors(backgroundColor, color);
    },
    
    showPickedColors(backgroundColor, textColor) {
        this.showToast(`Picked colors: Background: ${backgroundColor}, Text: ${textColor}`, 'info');
    },
    
    // Apply presets
    applyPreset(preset) {
        // Reset all tools first
        this.resetAllTools();
        
        // Apply preset configuration
        switch (preset) {
            case 'minimal':
                // No additional tools
                break;
            case 'developer':
                this.toggleTool('measurements');
                this.toggleTool('inspector');
                break;
            case 'designer':
                this.toggleTool('guides');
                this.toggleTool('rulers');
                this.toggleTool('colorPicker');
                break;
            case 'presentation':
                this.toggleTool('fullscreen');
                break;
        }
        
        this.showToast(`Applied ${preset} preset`, 'success');
    },
    
    // Update tool button state
    updateToolButton(toolId, isActive) {
        const button = document.querySelector(`[data-tool-id="${toolId}"]`);
        if (button && button.dataset.toolType === 'toggle') {
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive.toString());
        }
    },
    
    // Toggle toolbar visibility
    toggleToolbar() {
        this.isVisible = !this.isVisible;
        const content = document.getElementById('toolbar-content');
        const toggle = document.getElementById('toolbar-toggle');
        
        if (content && toggle) {
            content.style.display = this.isVisible ? 'block' : 'none';
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = this.isVisible ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
            }
        }
        
        // Emit event
        if (window.EventManager) {
            EventManager.emit('toolbar:visibilityToggled', this.isVisible);
        }
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        }
    },
    
    // Get toolbar state
    getState() {
        return {
            isVisible: this.isVisible,
            activeTools: Array.from(this.activeTools)
        };
    },
    
    // Set toolbar state
    setState(state) {
        if (state.isVisible !== undefined) {
            this.isVisible = state.isVisible;
        }
        
        if (state.activeTools) {
            this.activeTools = new Set(state.activeTools);
            // Update UI to reflect state
            this.tools.forEach(tool => {
                if (tool.toggle) {
                    this.updateToolButton(tool.id, this.activeTools.has(tool.id));
                }
            });
        }
    },
    
    // Debug information
    debug() {
        return {
            isVisible: this.isVisible,
            activeTools: Array.from(this.activeTools),
            tools: this.tools,
            state: this.getState()
        };
    }
};

// Make Toolbar globally available
window.Toolbar = Toolbar;