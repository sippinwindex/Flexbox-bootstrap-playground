/**
 * CSS Color Properties Manager
 * Handles colors, gradients, backgrounds, borders, and color-related properties
 */

class ColorPropertiesManager {
    constructor(options = {}) {
        this.options = {
            container: '#color-properties',
            previewContainer: '#color-preview',
            codeContainer: '#color-code',
            enableLivePreview: true,
            enableCodeGeneration: true,
            enableColorPalettes: true,
            enableGradientEditor: true,
            ...options
        };

        this.properties = new Map();
        this.presets = new Map();
        this.colorPalettes = new Map();
        this.gradients = new Map();
        this.history = [];
        this.currentHistoryIndex = -1;
        
        this.eventManager = window.eventManager;
        this.storageManager = window.storageManager;
        
        this.init();
    }

    init() {
        this.container = document.querySelector(this.options.container);
        if (!this.container) {
            console.error('Color properties container not found');
            return;
        }

        this.defineProperties();
        this.loadPresets();
        this.loadColorPalettes();
        this.loadGradientPresets();
        this.createInterface();
        this.bindEvents();
        this.loadSavedState();
    }

    defineProperties() {
        // Background properties
        this.addPropertyGroup('background', 'Background', {
            backgroundColor: {
                type: 'color',
                label: 'Background Color',
                default: 'transparent',
                description: 'Background color of the element'
            },
            backgroundImage: {
                type: 'background-image',
                label: 'Background Image',
                default: 'none',
                description: 'Background image or gradient'
            },
            backgroundSize: {
                type: 'select',
                label: 'Background Size',
                default: 'auto',
                options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'cover', label: 'Cover' },
                    { value: 'contain', label: 'Contain' },
                    { value: '100%', label: '100%' },
                    { value: '100% 100%', label: '100% × 100%' }
                ],
                description: 'Size of the background image'
            },
            backgroundRepeat: {
                type: 'select',
                label: 'Background Repeat',
                default: 'repeat',
                options: [
                    { value: 'repeat', label: 'Repeat' },
                    { value: 'no-repeat', label: 'No Repeat' },
                    { value: 'repeat-x', label: 'Repeat X' },
                    { value: 'repeat-y', label: 'Repeat Y' },
                    { value: 'space', label: 'Space' },
                    { value: 'round', label: 'Round' }
                ],
                description: 'How background image repeats'
            },
            backgroundPosition: {
                type: 'position',
                label: 'Background Position',
                default: '0% 0%',
                description: 'Position of the background image'
            },
            backgroundAttachment: {
                type: 'select',
                label: 'Background Attachment',
                default: 'scroll',
                options: [
                    { value: 'scroll', label: 'Scroll' },
                    { value: 'fixed', label: 'Fixed' },
                    { value: 'local', label: 'Local' }
                ],
                description: 'Background attachment behavior'
            }
        });

        // Border properties
        this.addPropertyGroup('border', 'Border & Outline', {
            borderWidth: {
                type: 'spacing',
                label: 'Border Width',
                default: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                units: ['px', 'em', 'rem'],
                description: 'Width of the border'
            },
            borderStyle: {
                type: 'select',
                label: 'Border Style',
                default: 'none',
                options: [
                    { value: 'none', label: 'None' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'double', label: 'Double' },
                    { value: 'groove', label: 'Groove' },
                    { value: 'ridge', label: 'Ridge' },
                    { value: 'inset', label: 'Inset' },
                    { value: 'outset', label: 'Outset' }
                ],
                description: 'Style of the border'
            },
            borderColor: {
                type: 'color',
                label: 'Border Color',
                default: '#000000',
                description: 'Color of the border'
            },
            borderRadius: {
                type: 'spacing',
                label: 'Border Radius',
                default: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                units: ['px', 'em', 'rem', '%'],
                description: 'Roundness of the corners'
            },
            outlineWidth: {
                type: 'unit',
                label: 'Outline Width',
                default: '0px',
                units: ['px', 'em', 'rem'],
                description: 'Width of the outline'
            },
            outlineStyle: {
                type: 'select',
                label: 'Outline Style',
                default: 'none',
                options: [
                    { value: 'none', label: 'None' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'double', label: 'Double' }
                ],
                description: 'Style of the outline'
            },
            outlineColor: {
                type: 'color',
                label: 'Outline Color',
                default: '#000000',
                description: 'Color of the outline'
            },
            outlineOffset: {
                type: 'unit',
                label: 'Outline Offset',
                default: '0px',
                units: ['px', 'em', 'rem'],
                description: 'Distance between outline and border'
            }
        });

        // Shadow properties
        this.addPropertyGroup('shadow', 'Shadows & Effects', {
            boxShadow: {
                type: 'box-shadow',
                label: 'Box Shadow',
                default: 'none',
                description: 'Shadow effect for the element'
            },
            filter: {
                type: 'filter',
                label: 'Filters',
                default: 'none',
                description: 'Visual filters applied to the element'
            },
            backdropFilter: {
                type: 'filter',
                label: 'Backdrop Filter',
                default: 'none',
                description: 'Filters applied to the backdrop'
            }
        });

        // Color scheme properties
        this.addPropertyGroup('scheme', 'Color Scheme', {
            colorScheme: {
                type: 'select',
                label: 'Color Scheme',
                default: 'normal',
                options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'light dark', label: 'Light & Dark' }
                ],
                description: 'Preferred color scheme'
            },
            accentColor: {
                type: 'color',
                label: 'Accent Color',
                default: 'auto',
                description: 'Accent color for form controls'
            }
        });

        // Advanced color properties
        this.addPropertyGroup('advanced', 'Advanced Colors', {
            mixBlendMode: {
                type: 'select',
                label: 'Mix Blend Mode',
                default: 'normal',
                options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'multiply', label: 'Multiply' },
                    { value: 'screen', label: 'Screen' },
                    { value: 'overlay', label: 'Overlay' },
                    { value: 'darken', label: 'Darken' },
                    { value: 'lighten', label: 'Lighten' },
                    { value: 'color-dodge', label: 'Color Dodge' },
                    { value: 'color-burn', label: 'Color Burn' },
                    { value: 'hard-light', label: 'Hard Light' },
                    { value: 'soft-light', label: 'Soft Light' },
                    { value: 'difference', label: 'Difference' },
                    { value: 'exclusion', label: 'Exclusion' },
                    { value: 'hue', label: 'Hue' },
                    { value: 'saturation', label: 'Saturation' },
                    { value: 'color', label: 'Color' },
                    { value: 'luminosity', label: 'Luminosity' }
                ],
                description: 'How element colors blend with background'
            },
            backgroundBlendMode: {
                type: 'select',
                label: 'Background Blend Mode',
                default: 'normal',
                options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'multiply', label: 'Multiply' },
                    { value: 'screen', label: 'Screen' },
                    { value: 'overlay', label: 'Overlay' },
                    { value: 'darken', label: 'Darken' },
                    { value: 'lighten', label: 'Lighten' },
                    { value: 'color-dodge', label: 'Color Dodge' },
                    { value: 'color-burn', label: 'Color Burn' },
                    { value: 'difference', label: 'Difference' },
                    { value: 'exclusion', label: 'Exclusion' }
                ],
                description: 'How background images blend'
            }
        });
    }

    addPropertyGroup(groupId, groupName, properties) {
        this.properties.set(groupId, {
            name: groupName,
            properties,
            collapsed: false
        });
    }

    loadPresets() {
        // Color presets
        this.presets.set('primary-button', {
            name: 'Primary Button',
            description: 'Blue primary button style',
            properties: {
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: { top: '1px', right: '1px', bottom: '1px', left: '1px' },
                borderStyle: 'solid',
                borderRadius: { top: '6px', right: '6px', bottom: '6px', left: '6px' }
            }
        });

        this.presets.set('card-shadow', {
            name: 'Card Shadow',
            description: 'Subtle card shadow effect',
            properties: {
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: { top: '8px', right: '8px', bottom: '8px', left: '8px' }
            }
        });

        this.presets.set('gradient-bg', {
            name: 'Gradient Background',
            description: 'Beautiful gradient background',
            properties: {
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        });

        this.presets.set('glass-effect', {
            name: 'Glass Morphism',
            description: 'Modern glass effect',
            properties: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: { top: '1px', right: '1px', bottom: '1px', left: '1px' },
                borderStyle: 'solid',
                borderRadius: { top: '12px', right: '12px', bottom: '12px', left: '12px' }
            }
        });

        this.presets.set('neon-glow', {
            name: 'Neon Glow',
            description: 'Neon glow effect',
            properties: {
                backgroundColor: '#000000',
                borderColor: '#00ff00',
                borderWidth: { top: '2px', right: '2px', bottom: '2px', left: '2px' },
                borderStyle: 'solid',
                boxShadow: '0 0 10px #00ff00, inset 0 0 10px #00ff00'
            }
        });
    }

    loadColorPalettes() {
        // Popular color palettes
        this.colorPalettes.set('material', {
            name: 'Material Design',
            colors: [
                '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
                '#009688', '#4caf50', '#8bc34a', '#cddc39',
                '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
            ]
        });

        this.colorPalettes.set('tailwind', {
            name: 'Tailwind Colors',
            colors: [
                '#ef4444', '#f97316', '#f59e0b', '#eab308',
                '#84cc16', '#22c55e', '#10b981', '#14b8a6',
                '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
                '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
            ]
        });

        this.colorPalettes.set('pastel', {
            name: 'Pastel Colors',
            colors: [
                '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9',
                '#bae1ff', '#c9baff', '#ffbaff', '#ffb3e6',
                '#ffd1dc', '#ffe4e1', '#f0f8ff', '#e6e6fa',
                '#ffefd5', '#fff8dc', '#f5f5dc', '#faf0e6'
            ]
        });

        this.colorPalettes.set('monochrome', {
            name: 'Monochrome',
            colors: [
                '#000000', '#1a1a1a', '#333333', '#4d4d4d',
                '#666666', '#808080', '#999999', '#b3b3b3',
                '#cccccc', '#e6e6e6', '#f0f0f0', '#f5f5f5',
                '#f8f8f8', '#fafafa', '#fdfdfd', '#ffffff'
            ]
        });
    }

    loadGradientPresets() {
        this.gradients.set('sunset', {
            name: 'Sunset',
            value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
        });

        this.gradients.set('ocean', {
            name: 'Ocean Blue',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        });

        this.gradients.set('forest', {
            name: 'Forest Green',
            value: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
        });

        this.gradients.set('fire', {
            name: 'Fire',
            value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)'
        });

        this.gradients.set('royal', {
            name: 'Royal Purple',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        });
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="color-properties-panel">
                <div class="properties-header">
                    <h3>Color Properties</h3>
                    <div class="properties-controls">
                        <button class="palette-btn" title="Color Palettes">
                            <i class="icon-palette"></i>
                        </button>
                        <button class="gradient-btn" title="Gradient Editor">
                            <i class="icon-move"></i>
                        </button>
                        <button class="eyedropper-btn" title="Color Picker">
                            <i class="icon-droplet"></i>
                        </button>
                        <button class="preset-btn" title="Load Preset">
                            <i class="icon-star"></i>
                        </button>
                        <button class="reset-btn" title="Reset All">
                            <i class="icon-refresh-cw"></i>
                        </button>
                        <button class="export-btn" title="Export CSS">
                            <i class="icon-download"></i>
                        </button>
                    </div>
                </div>

                <div class="properties-search">
                    <input type="text" class="search-input" placeholder="Search color properties...">
                    <i class="icon-search search-icon"></i>
                </div>

                <div class="color-preview-section">
                    <div class="color-preview-box"></div>
                    <div class="color-info">
                        <div class="current-colors"></div>
                        <div class="color-harmony">
                            <button class="harmony-btn" data-type="complementary">Complementary</button>
                            <button class="harmony-btn" data-type="triadic">Triadic</button>
                            <button class="harmony-btn" data-type="analogous">Analogous</button>
                        </div>
                    </div>
                </div>

                <div class="properties-groups">
                    ${this.createPropertyGroups()}
                </div>

                <div class="properties-footer">
                    <div class="history-controls">
                        <button class="undo-btn" title="Undo" disabled>
                            <i class="icon-corner-up-left"></i>
                        </button>
                        <button class="redo-btn" title="Redo" disabled>
                            <i class="icon-corner-up-right"></i>
                        </button>
                    </div>
                    <div class="properties-stats">
                        <span class="active-properties">0 active</span>
                        <span class="color-count">0 colors</span>
                    </div>
                </div>
            </div>
        `;

        this.bindInterfaceEvents();
        this.updateColorPreview();
    }

    createPropertyGroups() {
        let html = '';
        
        this.properties.forEach((group, groupId) => {
            html += `
                <div class="property-group" data-group="${groupId}">
                    <div class="group-header">
                        <button class="group-toggle" aria-expanded="${!group.collapsed}">
                            <i class="icon-chevron-${group.collapsed ? 'right' : 'down'}"></i>
                            <span class="group-name">${group.name}</span>
                            <span class="group-count">(${Object.keys(group.properties).length})</span>
                        </button>
                    </div>
                    <div class="group-content" ${group.collapsed ? 'style="display: none;"' : ''}>
                        ${this.createPropertyControls(group.properties, groupId)}
                    </div>
                </div>
            `;
        });

        return html;
    }

    createPropertyControls(properties, groupId) {
        let html = '';
        
        Object.entries(properties).forEach(([propName, propConfig]) => {
            html += this.createPropertyControl(propName, propConfig, groupId);
        });

        return html;
    }

    createPropertyControl(propName, config, groupId) {
        const controlId = `${groupId}-${propName}`;
        const isActive = this.isPropertyActive(propName);
        
        let controlHtml = '';
        
        switch (config.type) {
            case 'color':
                controlHtml = this.createColorControl(propName, config);
                break;
            case 'background-image':
                controlHtml = this.createBackgroundImageControl(propName, config);
                break;
            case 'position':
                controlHtml = this.createPositionControl(propName, config);
                break;
            case 'spacing':
                controlHtml = this.createSpacingControl(propName, config);
                break;
            case 'box-shadow':
                controlHtml = this.createBoxShadowControl(propName, config);
                break;
            case 'filter':
                controlHtml = this.createFilterControl(propName, config);
                break;
            case 'unit':
                controlHtml = this.createUnitControl(propName, config);
                break;
            case 'select':
                controlHtml = this.createSelectControl(propName, config);
                break;
            default:
                controlHtml = this.createTextControl(propName, config);
        }

        return `
            <div class="property-control ${isActive ? 'active' : ''}" 
                 data-property="${propName}" 
                 data-group="${groupId}"
                 ${config.dependsOn ? `data-depends-on="${config.dependsOn}"` : ''}
                 ${config.dependsOnValue ? `data-depends-on-value="${config.dependsOnValue.join(',')}"` : ''}>
                <div class="property-header">
                    <label class="property-label" for="${controlId}">
                        ${config.label}
                        ${config.description ? `<i class="icon-help-circle property-help" title="${config.description}"></i>` : ''}
                    </label>
                    <button class="property-reset" title="Reset to default" ${!isActive ? 'style="display: none;"' : ''}>
                        <i class="icon-x"></i>
                    </button>
                </div>
                <div class="property-input">
                    ${controlHtml}
                </div>
            </div>
        `;
    }

    createColorControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const rgbaValue = this.convertToRgba(currentValue);
        
        return `
            <div class="color-control">
                <div class="color-input-group">
                    <div class="color-swatch" style="background-color: ${currentValue};" data-property="${propName}"></div>
                    <input type="color" 
                           class="property-color" 
                           data-property="${propName}"
                           value="${this.toHex(currentValue)}">
                    <input type="text" 
                           class="property-color-text" 
                           data-property="${propName}"
                           value="${currentValue}" 
                           placeholder="${config.default}">
                </div>
                <div class="color-format-tabs">
                    <button class="format-tab active" data-format="hex">HEX</button>
                    <button class="format-tab" data-format="rgb">RGB</button>
                    <button class="format-tab" data-format="hsl">HSL</button>
                    <button class="format-tab" data-format="rgba">RGBA</button>
                </div>
                <div class="color-sliders">
                    <div class="slider-group">
                        <label>Alpha</label>
                        <input type="range" class="alpha-slider" min="0" max="1" step="0.01" 
                               value="${rgbaValue.a}" data-property="${propName}">
                        <span class="slider-value">${Math.round(rgbaValue.a * 100)}%</span>
                    </div>
                </div>
                <div class="color-presets-mini">
                    <button class="color-preset-mini" data-color="transparent" title="Transparent"></button>
                    <button class="color-preset-mini" data-color="#000000" title="Black"></button>
                    <button class="color-preset-mini" data-color="#ffffff" title="White"></button>
                    <button class="color-preset-mini" data-color="#ff0000" title="Red"></button>
                    <button class="color-preset-mini" data-color="#00ff00" title="Green"></button>
                    <button class="color-preset-mini" data-color="#0000ff" title="Blue"></button>
                </div>
            </div>
        `;
    }

    createBackgroundImageControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        
        return `
            <div class="background-image-control">
                <div class="bg-type-tabs">
                    <button class="bg-tab ${this.isGradient(currentValue) ? '' : 'active'}" data-type="image">Image</button>
                    <button class="bg-tab ${this.isGradient(currentValue) ? 'active' : ''}" data-type="gradient">Gradient</button>
                </div>
                <div class="bg-content">
                    <div class="bg-image-panel" ${this.isGradient(currentValue) ? 'style="display: none;"' : ''}>
                        <input type="url" class="bg-image-url" data-property="${propName}" 
                               placeholder="https://example.com/image.jpg"
                               value="${this.extractImageUrl(currentValue)}">
                        <button class="upload-image-btn">Upload</button>
                    </div>
                    <div class="bg-gradient-panel" ${!this.isGradient(currentValue) ? 'style="display: none;"' : ''}>
                        <div class="gradient-preview" style="background: ${this.isGradient(currentValue) ? currentValue : 'linear-gradient(90deg, #ff0000, #0000ff)'}"></div>
                        <div class="gradient-controls">
                            <select class="gradient-type">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                                <option value="conic">Conic</option>
                            </select>
                            <input type="number" class="gradient-angle" value="90" min="0" max="360" placeholder="Angle">
                            <span>°</span>
                        </div>
                        <div class="gradient-stops">
                            <div class="gradient-stop" data-position="0">
                                <input type="color" value="#ff0000">
                                <input type="number" value="0" min="0" max="100">%
                                <button class="remove-stop">×</button>
                            </div>
                            <div class="gradient-stop" data-position="100">
                                <input type="color" value="#0000ff">
                                <input type="number" value="100" min="0" max="100">%
                                <button class="remove-stop">×</button>
                            </div>
                        </div>
                        <button class="add-gradient-stop">Add Stop</button>
                        <div class="gradient-presets">
                            ${Array.from(this.gradients.entries()).map(([id, gradient]) => `
                                <button class="gradient-preset" data-gradient="${gradient.value}" title="${gradient.name}">
                                    <div class="gradient-preset-preview" style="background: ${gradient.value}"></div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createPositionControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const [x, y] = this.parsePosition(currentValue);
        
        return `
            <div class="position-control">
                <div class="position-grid">
                    <div class="position-visual">
                        <div class="position-indicator" style="left: ${x}; top: ${y};"></div>
                        <div class="position-grid-lines"></div>
                    </div>
                    <div class="position-presets">
                        <button class="pos-preset" data-position="0% 0%">↖</button>
                        <button class="pos-preset" data-position="50% 0%">↑</button>
                        <button class="pos-preset" data-position="100% 0%">↗</button>
                        <button class="pos-preset" data-position="0% 50%">←</button>
                        <button class="pos-preset" data-position="50% 50%">⊙</button>
                        <button class="pos-preset" data-position="100% 50%">→</button>
                        <button class="pos-preset" data-position="0% 100%">↙</button>
                        <button class="pos-preset" data-position="50% 100%">↓</button>
                        <button class="pos-preset" data-position="100% 100%">↘</button>
                    </div>
                </div>
                <div class="position-inputs">
                    <div class="input-group">
                        <label>X:</label>
                        <input type="text" class="pos-x" value="${x}" data-property="${propName}">
                    </div>
                    <div class="input-group">
                        <label>Y:</label>
                        <input type="text" class="pos-y" value="${y}" data-property="${propName}">
                    </div>
                </div>
            </div>
        `;
    }

    createBoxShadowControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const shadows = this.parseBoxShadow(currentValue);
        
        return `
            <div class="box-shadow-control">
                <div class="shadow-list">
                    ${shadows.map((shadow, index) => this.createShadowItem(shadow, index, propName)).join('')}
                </div>
                <button class="add-shadow-btn" data-property="${propName}">Add Shadow</button>
                <div class="shadow-presets">
                    <button class="shadow-preset" data-shadow="none">None</button>
                    <button class="shadow-preset" data-shadow="0 1px 3px rgba(0,0,0,0.12)">Light</button>
                    <button class="shadow-preset" data-shadow="0 4px 6px rgba(0,0,0,0.1)">Medium</button>
                    <button class="shadow-preset" data-shadow="0 10px 25px rgba(0,0,0,0.15)">Heavy</button>
                    <button class="shadow-preset" data-shadow="inset 0 2px 4px rgba(0,0,0,0.1)">Inset</button>
                </div>
            </div>
        `;
    }

    createShadowItem(shadow, index, propName) {
        return `
            <div class="shadow-item" data-index="${index}">
                <div class="shadow-controls">
                    <div class="control-row">
                        <label>X:</label>
                        <input type="number" class="shadow-x" value="${shadow.x}" data-property="${propName}">
                        <label>Y:</label>
                        <input type="number" class="shadow-y" value="${shadow.y}" data-property="${propName}">
                    </div>
                    <div class="control-row">
                        <label>Blur:</label>
                        <input type="number" class="shadow-blur" value="${shadow.blur}" min="0" data-property="${propName}">
                        <label>Spread:</label>
                        <input type="number" class="shadow-spread" value="${shadow.spread || 0}" data-property="${propName}">
                    </div>
                    <div class="control-row">
                        <label>Color:</label>
                        <input type="color" class="shadow-color" value="${this.toHex(shadow.color)}" data-property="${propName}">
                        <label>
                            <input type="checkbox" class="shadow-inset" ${shadow.inset ? 'checked' : ''} data-property="${propName}">
                            Inset
                        </label>
                    </div>
                </div>
                <button class="remove-shadow" data-index="${index}">Remove</button>
            </div>
        `;
    }

    createFilterControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const filters = this.parseFilters(currentValue);
        
        return `
            <div class="filter-control">
                <div class="filter-list">
                    ${Object.entries(filters).map(([filterName, value]) => `
                        <div class="filter-item" data-filter="${filterName}">
                            <label>${this.formatFilterName(filterName)}</label>
                            <input type="range" 
                                   class="filter-slider" 
                                   min="${this.getFilterMin(filterName)}" 
                                   max="${this.getFilterMax(filterName)}" 
                                   step="${this.getFilterStep(filterName)}"
                                   value="${this.parseFilterValue(value)}"
                                   data-property="${propName}"
                                   data-filter="${filterName}">
                            <span class="filter-value">${value}</span>
                            <button class="reset-filter" data-filter="${filterName}">Reset</button>
                        </div>
                    `).join('')}
                </div>
                <div class="filter-presets">
                    <button class="filter-preset" data-filter="none">None</button>
                    <button class="filter-preset" data-filter="blur(5px)">Blur</button>
                    <button class="filter-preset" data-filter="brightness(1.2)">Bright</button>
                    <button class="filter-preset" data-filter="contrast(1.5)">Contrast</button>
                    <button class="filter-preset" data-filter="grayscale(1)">Grayscale</button>
                    <button class="filter-preset" data-filter="sepia(1)">Sepia</button>
                </div>
            </div>
        `;
    }

    createSpacingControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const spacing = typeof currentValue === 'object' ? currentValue : 
                       { top: '0px', right: '0px', bottom: '0px', left: '0px' };
        
        return `
            <div class="spacing-control">
                <div class="spacing-visual">
                    <div class="spacing-top">
                        <input type="text" data-side="top" value="${this.parseUnitValue(spacing.top).value}" placeholder="0">
                        <select data-side="top" data-property="${propName}">
                            ${config.units.map(u => `
                                <option value="${u}" ${this.parseUnitValue(spacing.top).unit === u ? 'selected' : ''}>${u}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="spacing-middle">
                        <div class="spacing-left">
                            <input type="text" data-side="left" value="${this.parseUnitValue(spacing.left).value}" placeholder="0">
                            <select data-side="left" data-property="${propName}">
                                ${config.units.map(u => `
                                    <option value="${u}" ${this.parseUnitValue(spacing.left).unit === u ? 'selected' : ''}>${u}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="spacing-center">${propName.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                        <div class="spacing-right">
                            <input type="text" data-side="right" value="${this.parseUnitValue(spacing.right).value}" placeholder="0">
                            <select data-side="right" data-property="${propName}">
                                ${config.units.map(u => `
                                    <option value="${u}" ${this.parseUnitValue(spacing.right).unit === u ? 'selected' : ''}>${u}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="spacing-bottom">
                        <input type="text" data-side="bottom" value="${this.parseUnitValue(spacing.bottom).value}" placeholder="0">
                        <select data-side="bottom" data-property="${propName}">
                            ${config.units.map(u => `
                                <option value="${u}" ${this.parseUnitValue(spacing.bottom).unit === u ? 'selected' : ''}>${u}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="spacing-controls">
                    <button class="link-all" title="Link all sides">
                        <i class="icon-link"></i>
                    </button>
                    <button class="spacing-preset" data-spacing="0">0</button>
                    <button class="spacing-preset" data-spacing="4px">4px</button>
                    <button class="spacing-preset" data-spacing="8px">8px</button>
                    <button class="spacing-preset" data-spacing="16px">16px</button>
                </div>
            </div>
        `;
    }

    createUnitControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        const { value, unit } = this.parseUnitValue(currentValue);
        
        return `
            <div class="unit-control">
                <input type="number" 
                       class="property-input-number" 
                       data-property="${propName}"
                       value="${value}" 
                       min="${config.min}" 
                       max="${config.max}" 
                       step="${config.step || 1}"
                       placeholder="${config.placeholder || ''}">
                <select class="unit-select" data-property="${propName}">
                    ${config.units.map(u => `
                        <option value="${u}" ${u === unit ? 'selected' : ''}>${u || 'unitless'}</option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    createSelectControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        
        return `
            <select class="property-select" data-property="${propName}">
                ${config.options.map(option => `
                    <option value="${option.value}" ${option.value === currentValue ? 'selected' : ''}>
                        ${option.label}
                    </option>
                `).join('')}
            </select>
        `;
    }

    createTextControl(propName, config) {
        const currentValue = this.getCurrentValue(propName) || config.default;
        
        return `
            <input type="text" 
                   class="property-text" 
                   data-property="${propName}"
                   value="${currentValue}" 
                   placeholder="${config.placeholder || ''}">
        `;
    }

    bindInterfaceEvents() {
        // Property group toggles
        this.container.addEventListener('click', (event) => {
            if (event.target.closest('.group-toggle')) {
                this.toggleGroup(event.target.closest('.property-group'));
            }
        });

        // Property controls
        this.container.addEventListener('input', (event) => {
            if (event.target.hasAttribute('data-property')) {
                this.handlePropertyChange(event);
            }
        });

        this.container.addEventListener('change', (event) => {
            if (event.target.hasAttribute('data-property')) {
                this.handlePropertyChange(event);
            }
        });

        // Color swatches
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('color-swatch')) {
                const colorInput = event.target.parentElement.querySelector('.property-color');
                if (colorInput) colorInput.click();
            }
        });

        // Color format tabs
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('format-tab')) {
                const colorControl = event.target.closest('.color-control');
                const format = event.target.getAttribute('data-format');
                this.switchColorFormat(colorControl, format);
            }
        });

        // Color presets
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('color-preset-mini')) {
                const color = event.target.getAttribute('data-color');
                const colorControl = event.target.closest('.color-control');
                const propName = colorControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateProperty(propName, color);
            }
        });

        // Background type tabs
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('bg-tab')) {
                const bgControl = event.target.closest('.background-image-control');
                const type = event.target.getAttribute('data-type');
                this.switchBackgroundType(bgControl, type);
            }
        });

        // Gradient controls
        this.container.addEventListener('input', (event) => {
            if (event.target.closest('.gradient-controls') || event.target.closest('.gradient-stops')) {
                const bgControl = event.target.closest('.background-image-control');
                const propName = bgControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateGradient(bgControl, propName);
            }
        });

        // Gradient presets
        this.container.addEventListener('click', (event) => {
            if (event.target.closest('.gradient-preset')) {
                const gradient = event.target.closest('.gradient-preset').getAttribute('data-gradient');
                const bgControl = event.target.closest('.background-image-control');
                const propName = bgControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateProperty(propName, gradient);
                this.updateGradientPreview(bgControl, gradient);
            }
        });

        // Position presets
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('pos-preset')) {
                const position = event.target.getAttribute('data-position');
                const posControl = event.target.closest('.position-control');
                const propName = posControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateProperty(propName, position);
                this.updatePositionInputs(posControl, position);
            }
        });

        // Shadow controls
        this.container.addEventListener('input', (event) => {
            if (event.target.closest('.shadow-item')) {
                const shadowControl = event.target.closest('.box-shadow-control');
                const propName = shadowControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateBoxShadowFromControls(shadowControl, propName);
            }
        });

        // Add/remove shadow
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-shadow-btn')) {
                const propName = event.target.getAttribute('data-property');
                this.addShadow(event.target.closest('.box-shadow-control'), propName);
            }
            
            if (event.target.classList.contains('remove-shadow')) {
                const index = parseInt(event.target.getAttribute('data-index'));
                const shadowControl = event.target.closest('.box-shadow-control');
                const propName = shadowControl.querySelector('[data-property]').getAttribute('data-property');
                this.removeShadow(shadowControl, propName, index);
            }
        });

        // Shadow presets
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('shadow-preset')) {
                const shadow = event.target.getAttribute('data-shadow');
                const shadowControl = event.target.closest('.box-shadow-control');
                const propName = shadowControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateProperty(propName, shadow);
                this.rebuildShadowControls(shadowControl, shadow, propName);
            }
        });

        // Filter controls
        this.container.addEventListener('input', (event) => {
            if (event.target.classList.contains('filter-slider')) {
                const filterName = event.target.getAttribute('data-filter');
                const propName = event.target.getAttribute('data-property');
                this.updateFilter(event.target.closest('.filter-control'), propName, filterName, event.target.value);
            }
        });

        // Filter presets
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-preset')) {
                const filter = event.target.getAttribute('data-filter');
                const filterControl = event.target.closest('.filter-control');
                const propName = filterControl.querySelector('[data-property]').getAttribute('data-property');
                this.updateProperty(propName, filter);
                this.rebuildFilterControls(filterControl, filter);
            }
        });

        // Header controls
        this.bindHeaderControls();

        // Property reset buttons
        this.container.addEventListener('click', (event) => {
            if (event.target.closest('.property-reset')) {
                const propertyControl = event.target.closest('.property-control');
                const propName = propertyControl.getAttribute('data-property');
                this.resetProperty(propName);
            }
        });

        // Search
        this.container.querySelector('.search-input')?.addEventListener('input', (event) => {
            this.filterProperties(event.target.value);
        });

        // Color harmony
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('harmony-btn')) {
                const type = event.target.getAttribute('data-type');
                this.showColorHarmony(type);
            }
        });
    }

    bindHeaderControls() {
        this.container.querySelector('.palette-btn')?.addEventListener('click', () => {
            this.showColorPalettes();
        });

        this.container.querySelector('.gradient-btn')?.addEventListener('click', () => {
            this.showGradientEditor();
        });

        this.container.querySelector('.eyedropper-btn')?.addEventListener('click', () => {
            this.activateEyedropper();
        });

        this.container.querySelector('.preset-btn')?.addEventListener('click', () => {
            this.showPresetMenu();
        });

        this.container.querySelector('.reset-btn')?.addEventListener('click', () => {
            this.resetAllProperties();
        });

        this.container.querySelector('.export-btn')?.addEventListener('click', () => {
            this.exportCSS();
        });

        // History controls
        this.container.querySelector('.undo-btn')?.addEventListener('click', () => {
            this.undo();
        });

        this.container.querySelector('.redo-btn')?.addEventListener('click', () => {
            this.redo();
        });
    }

    bindEvents() {
        // External events
        this.eventManager?.on('property:change', (data) => {
            if (data.type === 'color') {
                this.updateProperty(data.property, data.value, false);
            }
        });

        this.eventManager?.on('preset:load', (data) => {
            if (data.type === 'color') {
                this.loadPreset(data.preset);
            }
        });

        this.eventManager?.on('color:picked', (data) => {
            this.updateProperty(data.property, data.color);
        });
    }

    handlePropertyChange(event) {
        const propName = event.target.getAttribute('data-property');
        let value;

        if (event.target.classList.contains('property-color')) {
            value = event.target.value;
            this.updateColorSwatch(event.target.closest('.color-control'), value);
        } else if (event.target.classList.contains('property-color-text')) {
            value = event.target.value;
            this.updateColorInput(event.target.closest('.color-control'), value);
        } else if (event.target.classList.contains('alpha-slider')) {
            const colorControl = event.target.closest('.color-control');
            const currentColor = this.getCurrentValue(propName);
            value = this.updateAlpha(currentColor, event.target.value);
            this.updateColorInput(colorControl, value);
        } else if (event.target.closest('.unit-control')) {
            const container = event.target.closest('.unit-control');
            const input = container.querySelector('.property-input-number');
            const select = container.querySelector('.unit-select');
            value = input.value + select.value;
        } else if (event.target.closest('.spacing-control')) {
            value = this.getSpacingValue(event.target.closest('.spacing-control'));
        } else {
            value = event.target.value;
        }

        this.updateProperty(propName, value);
    }

    updateProperty(propName, value, addToHistory = true) {
        if (addToHistory) {
            this.addToHistory();
        }

        // Store the property value
        this.setCurrentValue(propName, value);

        // Update UI
        this.updatePropertyUI(propName, value);
        this.updatePropertyDependencies(propName, value);
        this.updateActivePropertiesCount();
        this.updateColorPreview();
        this.updateColorCount();

        // Apply to preview
        if (this.options.enableLivePreview) {
            this.applyToPreview();
        }

        // Generate code
        if (this.options.enableCodeGeneration) {
            this.generateCode();
        }

        // Save state
        this.saveState();

        // Emit event
        this.eventManager?.emit('color:property:changed', {
            property: propName,
            value,
            allProperties: this.getAllActiveProperties()
        });
    }

    // Color utility methods
    convertToRgba(color) {
        // Convert various color formats to RGBA
        if (color === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
        
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return { r, g, b, a: 1 };
        }
        
        if (color.startsWith('rgb')) {
            const match = color.match(/rgba?\(([^)]+)\)/);
            if (match) {
                const values = match[1].split(',').map(v => parseFloat(v.trim()));
                return {
                    r: values[0],
                    g: values[1],
                    b: values[2],
                    a: values[3] !== undefined ? values[3] : 1
                };
            }
        }
        
        return { r: 0, g: 0, b: 0, a: 1 };
    }

    toHex(color) {
        if (color === 'transparent') return '#000000';
        if (color.startsWith('#')) return color;
        
        const rgba = this.convertToRgba(color);
        const hex = (rgba.r << 16 | rgba.g << 8 | rgba.b).toString(16).padStart(6, '0');
        return '#' + hex;
    }

    updateAlpha(color, alpha) {
        const rgba = this.convertToRgba(color);
        return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
    }

    isGradient(value) {
        return value && (value.includes('linear-gradient') || value.includes('radial-gradient') || value.includes('conic-gradient'));
    }

    extractImageUrl(value) {
        if (!value || value === 'none') return '';
        const match = value.match(/url\(['"]?([^'"]+)['"]?\)/);
        return match ? match[1] : '';
    }

    parsePosition(position) {
        const parts = position.split(' ');
        return [parts[0] || '50%', parts[1] || '50%'];
    }

    parseBoxShadow(shadow) {
        if (!shadow || shadow === 'none') return [];
        
        // Simple parsing - would need more robust parsing for complex shadows
        const shadows = shadow.split(',').map(s => {
            const parts = s.trim().split(/\s+/);
            const isInset = parts[0] === 'inset';
            const offset = isInset ? 1 : 0;
            
            return {
                inset: isInset,
                x: parseInt(parts[offset]) || 0,
                y: parseInt(parts[offset + 1]) || 0,
                blur: parseInt(parts[offset + 2]) || 0,
                spread: parseInt(parts[offset + 3]) || 0,
                color: parts[offset + 4] || '#000000'
            };
        });
        
        return shadows;
    }

    parseFilters(filterValue) {
        if (!filterValue || filterValue === 'none') {
            return {
                blur: '0px',
                brightness: '100%',
                contrast: '100%',
                grayscale: '0%',
                'hue-rotate': '0deg',
                invert: '0%',
                opacity: '100%',
                saturate: '100%',
                sepia: '0%'
            };
        }
        
        const filters = {};
        const filterRegex = /(\w+)\(([^)]+)\)/g;
        let match;
        
        while ((match = filterRegex.exec(filterValue)) !== null) {
            filters[match[1]] = match[2];
        }
        
        return filters;
    }

    parseUnitValue(value) {
        if (typeof value !== 'string') return { value: value, unit: '' };
        
        const match = value.match(/^(-?\d*\.?\d+)(.*)$/);
        if (match) {
            return { value: match[1], unit: match[2] || 'px' };
        }
        return { value: value, unit: '' };
    }

    formatFilterName(name) {
        return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getFilterMin(filterName) {
        const ranges = {
            blur: 0,
            brightness: 0,
            contrast: 0,
            grayscale: 0,
            'hue-rotate': 0,
            invert: 0,
            opacity: 0,
            saturate: 0,
            sepia: 0
        };
        return ranges[filterName] || 0;
    }

    getFilterMax(filterName) {
        const ranges = {
            blur: 20,
            brightness: 200,
            contrast: 200,
            grayscale: 100,
            'hue-rotate': 360,
            invert: 100,
            opacity: 100,
            saturate: 200,
            sepia: 100
        };
        return ranges[filterName] || 100;
    }

    getFilterStep(filterName) {
        const steps = {
            blur: 0.1,
            brightness: 1,
            contrast: 1,
            grayscale: 1,
            'hue-rotate': 1,
            invert: 1,
            opacity: 1,
            saturate: 1,
            sepia: 1
        };
        return steps[filterName] || 1;
    }

    parseFilterValue(value) {
        return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
    }

    showColorPalettes() {
        const modal = document.createElement('div');
        modal.className = 'color-palettes-modal modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Color Palettes</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="palette-grid">
                    ${Array.from(this.colorPalettes.entries()).map(([id, palette]) => `
                        <div class="palette-item" data-palette-id="${id}">
                            <h4>${palette.name}</h4>
                            <div class="palette-colors">
                                ${palette.colors.map(color => `
                                    <button class="palette-color" 
                                            data-color="${color}" 
                                            style="background-color: ${color}"
                                            title="${color}"></button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle color selection
        modal.addEventListener('click', (event) => {
            if (event.target.classList.contains('palette-color')) {
                const color = event.target.getAttribute('data-color');
                // Add to current colors or apply to active property
                this.eventManager?.emit('color:selected', { color });
                modal.remove();
            }
            
            if (event.target.classList.contains('modal-close')) {
                modal.remove();
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });
    }

    activateEyedropper() {
        if (!window.EyeDropper) {
            this.showToast('EyeDropper API not supported in this browser', 'warning');
            return;
        }

        const eyeDropper = new EyeDropper();
        eyeDropper.open().then(result => {
            this.eventManager?.emit('color:picked', { 
                color: result.sRGBHex,
                property: this.getActiveColorProperty() 
            });
        }).catch(err => {
            console.log('EyeDropper cancelled or failed:', err);
        });
    }

    // Placeholder methods for functionality completion
    getCurrentValue(propName) {
        return this.currentValues?.[propName];
    }

    setCurrentValue(propName, value) {
        if (!this.currentValues) this.currentValues = {};
        this.currentValues[propName] = value;
    }

    getAllActiveProperties() {
        return { ...this.currentValues };
    }

    isPropertyActive(propName) {
        return this.currentValues && this.currentValues.hasOwnProperty(propName);
    }

    updateColorPreview() {
        const previewBox = this.container.querySelector('.color-preview-box');
        if (!previewBox) return;

        const activeProperties = this.getAllActiveProperties();
        
        // Apply active color properties to preview
        Object.entries(activeProperties).forEach(([prop, value]) => {
            const cssProperty = this.camelToKebab(prop);
            previewBox.style.setProperty(cssProperty, value);
        });
    }

    updateColorCount() {
        const countEl = this.container.querySelector('.color-count');
        if (!countEl) return;

        const colorProperties = ['backgroundColor', 'borderColor', 'color', 'outlineColor'];
        const activeColors = Object.keys(this.currentValues || {})
            .filter(prop => colorProperties.some(cp => prop.includes(cp)))
            .length;
        
        countEl.textContent = `${activeColors} colors`;
    }

    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    saveState() {
        if (!this.storageManager) return;
        
        this.storageManager.set('color-properties-state', {
            properties: this.currentValues,
            timestamp: Date.now()
        });
    }

    loadSavedState() {
        if (!this.storageManager) return;
        
        const state = this.storageManager.get('color-properties-state');
        if (state && state.properties) {
            this.currentValues = state.properties;
            this.updateAllPropertyUI();
        }
    }

    updateAllPropertyUI() {
        if (!this.currentValues) return;
        
        Object.entries(this.currentValues).forEach(([propName, value]) => {
            this.updatePropertyUI(propName, value);
        });
        
        this.updateColorPreview();
        this.updateColorCount();
        this.updateActivePropertiesCount();
    }

    updatePropertyUI(propName, value) {
        const propertyControl = this.container.querySelector(`[data-property="${propName}"]`);
        if (!propertyControl) return;

        propertyControl.classList.add('active');
        
        const resetBtn = propertyControl.querySelector('.property-reset');
        if (resetBtn) {
            resetBtn.style.display = 'block';
        }
    }

    updatePropertyDependencies(propName, value) {
        const dependentControls = this.container.querySelectorAll(`[data-depends-on="${propName}"]`);
        
        dependentControls.forEach(control => {
            const dependsOnValue = control.getAttribute('data-depends-on-value');
            const shouldShow = dependsOnValue ? dependsOnValue.split(',').includes(value) : true;
            
            control.style.display = shouldShow ? 'block' : 'none';
        });
    }

    updateActivePropertiesCount() {
        const countEl = this.container.querySelector('.active-properties');
        if (countEl) {
            const count = Object.keys(this.currentValues || {}).length;
            countEl.textContent = `${count} active`;
        }
    }

    applyToPreview() {
        const previewElements = document.querySelectorAll(this.options.previewContainer);
        if (!previewElements.length) return;

        const activeProperties = this.getAllActiveProperties();
        
        previewElements.forEach(element => {
            Object.entries(activeProperties).forEach(([prop, value]) => {
                const cssProperty = this.camelToKebab(prop);
                element.style.setProperty(cssProperty, value);
            });
        });
    }

    generateCode() {
        const codeContainer = document.querySelector(this.options.codeContainer);
        if (!codeContainer) return;

        const activeProperties = this.getAllActiveProperties();
        let css = '';

        Object.entries(activeProperties).forEach(([prop, value]) => {
            const cssProperty = this.camelToKebab(prop);
            css += `  ${cssProperty}: ${value};\n`;
        });

        if (css) {
            css = `.color-style {\n${css}}`;
        }

        codeContainer.textContent = css;
    }

    exportCSS() {
        const activeProperties = this.getAllActiveProperties();
        let css = '';

        Object.entries(activeProperties).forEach(([prop, value]) => {
            const cssProperty = this.camelToKebab(prop);
            css += `${cssProperty}: ${value};\n`;
        });

        // Create and download file
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-styles.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    destroy() {
        this.saveState();
        this.container.innerHTML = '';
        this.properties.clear();
        this.presets.clear();
        this.colorPalettes.clear();
        this.gradients.clear();
        this.history = [];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorPropertiesManager;
} else {
    window.ColorPropertiesManager = ColorPropertiesManager;
}