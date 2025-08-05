// Utilities tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load utilities tab content
    loadUtilitiesTab();
});

function loadUtilitiesTab() {
    const utilitiesTab = document.getElementById('utilities-tab');
    if (!utilitiesTab) return;

    utilitiesTab.innerHTML = `
        <div class="component-card">
            <div class="component-header utilities">
                <div>
                    <h3 class="mb-0"><i class="bi bi-tools me-2"></i>Bootstrap Utilities</h3>
                    <p class="mb-0 opacity-75">Spacing, colors, display, flexbox, and positioning utility classes</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="live-indicator pulse">LIVE</div>
                    <button class="fullscreen-btn" onclick="enterFullscreen('utilities')" title="Enter Fullscreen Mode">
                        <i class="bi bi-arrows-fullscreen"></i>
                        Fullscreen
                    </button>
                </div>
            </div>
            <div class="component-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="control-group">
                            <label class="control-label">Utility Category</label>
                            <div class="description-text">Choose the utility category to explore</div>
                            <select class="form-select" id="utility-category" onchange="updateUtilityDemo()">
                                <option value="spacing" selected>Spacing (Margin & Padding)</option>
                                <option value="colors">Colors & Backgrounds</option>
                                <option value="flexbox">Flexbox Utilities</option>
                                <option value="display">Display Properties</option>
                                <option value="position">Positioning</option>
                                <option value="sizing">Sizing</option>
                                <option value="text">Text Utilities</option>
                            </select>
                        </div>

                        <div id="spacing-controls" class="component-controls active">
                            <div class="control-group">
                                <label class="control-label">Spacing Type</label>
                                <div class="description-text">Choose margin or padding</div>
                                <select class="form-select" id="spacing-type" onchange="updateUtilityDemo()">
                                    <option value="m" selected>Margin</option>
                                    <option value="p">Padding</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Spacing Direction</label>
                                <div class="description-text">Apply spacing to specific sides</div>
                                <select class="form-select" id="spacing-direction" onchange="updateUtilityDemo()">
                                    <option value="" selected>All Sides</option>
                                    <option value="t">Top</option>
                                    <option value="e">End (Right)</option>
                                    <option value="b">Bottom</option>
                                    <option value="s">Start (Left)</option>
                                    <option value="x">Horizontal</option>
                                    <option value="y">Vertical</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Spacing Size</label>
                                <div class="description-text">Choose spacing size (0-5)</div>
                                <input type="range" class="form-range" id="spacing-size" min="0" max="5" value="3" oninput="updateRangeValue('spacing-size')" onchange="updateUtilityDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>0</span>
                                    <span class="range-value" id="spacing-size-value">3</span>
                                    <span>5</span>
                                </div>
                            </div>
                        </div>

                        <div id="colors-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Text Color</label>
                                <div class="description-text">Choose text color utility</div>
                                <select class="form-select" id="text-color" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="text-primary">Primary</option>
                                    <option value="text-secondary">Secondary</option>
                                    <option value="text-success">Success</option>
                                    <option value="text-danger">Danger</option>
                                    <option value="text-warning">Warning</option>
                                    <option value="text-info">Info</option>
                                    <option value="text-light">Light</option>
                                    <option value="text-dark">Dark</option>
                                    <option value="text-muted">Muted</option>
                                    <option value="text-white">White</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Background Color</label>
                                <div class="description-text">Choose background color utility</div>
                                <select class="form-select" id="bg-color" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="bg-primary">Primary</option>
                                    <option value="bg-secondary">Secondary</option>
                                    <option value="bg-success">Success</option>
                                    <option value="bg-danger">Danger</option>
                                    <option value="bg-warning">Warning</option>
                                    <option value="bg-info">Info</option>
                                    <option value="bg-light">Light</option>
                                    <option value="bg-dark">Dark</option>
                                    <option value="bg-white">White</option>
                                </select>
                            </div>
                        </div>

                        <div id="flexbox-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Justify Content</label>
                                <div class="description-text">Horizontal alignment of flex items</div>
                                <select class="form-select" id="justify-content" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="justify-content-start">Start</option>
                                    <option value="justify-content-center">Center</option>
                                    <option value="justify-content-end">End</option>
                                    <option value="justify-content-between">Space Between</option>
                                    <option value="justify-content-around">Space Around</option>
                                    <option value="justify-content-evenly">Space Evenly</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Align Items</label>
                                <div class="description-text">Vertical alignment of flex items</div>
                                <select class="form-select" id="align-items" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="align-items-start">Start</option>
                                    <option value="align-items-center">Center</option>
                                    <option value="align-items-end">End</option>
                                    <option value="align-items-baseline">Baseline</option>
                                    <option value="align-items-stretch">Stretch</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Flex Direction</label>
                                <div class="description-text">Direction of flex items</div>
                                <select class="form-select" id="flex-direction" onchange="updateUtilityDemo()">
                                    <option value="">Default (Row)</option>
                                    <option value="flex-row">Row</option>
                                    <option value="flex-row-reverse">Row Reverse</option>
                                    <option value="flex-column">Column</option>
                                    <option value="flex-column-reverse">Column Reverse</option>
                                </select>
                            </div>
                        </div>

                        <div id="display-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Display Type</label>
                                <div class="description-text">Set element display property</div>
                                <select class="form-select" id="display-type" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="d-block">Block</option>
                                    <option value="d-inline">Inline</option>
                                    <option value="d-inline-block">Inline Block</option>
                                    <option value="d-flex">Flex</option>
                                    <option value="d-inline-flex">Inline Flex</option>
                                    <option value="d-grid">Grid</option>
                                    <option value="d-none">None (Hidden)</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Visibility</label>
                                <div class="description-text">Control element visibility</div>
                                <select class="form-select" id="visibility" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="visible">Visible</option>
                                    <option value="invisible">Invisible</option>
                                </select>
                            </div>
                        </div>

                        <div id="position-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Position Type</label>
                                <div class="description-text">Set positioning method</div>
                                <select class="form-select" id="position-type" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="position-static">Static</option>
                                    <option value="position-relative">Relative</option>
                                    <option value="position-absolute">Absolute</option>
                                    <option value="position-fixed">Fixed</option>
                                    <option value="position-sticky">Sticky</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Position Utilities</label>
                                <div class="description-text">Quick positioning helpers</div>
                                <select class="form-select" id="position-helper" onchange="updateUtilityDemo()">
                                    <option value="">None</option>
                                    <option value="top-0">Top 0</option>
                                    <option value="bottom-0">Bottom 0</option>
                                    <option value="start-0">Start 0</option>
                                    <option value="end-0">End 0</option>
                                    <option value="top-50">Top 50%</option>
                                    <option value="start-50">Start 50%</option>
                                </select>
                            </div>
                        </div>

                        <div id="sizing-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Width</label>
                                <div class="description-text">Set element width</div>
                                <select class="form-select" id="width-size" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="w-25">25%</option>
                                    <option value="w-50">50%</option>
                                    <option value="w-75">75%</option>
                                    <option value="w-100">100%</option>
                                    <option value="w-auto">Auto</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Height</label>
                                <div class="description-text">Set element height</div>
                                <select class="form-select" id="height-size" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="h-25">25%</option>
                                    <option value="h-50">50%</option>
                                    <option value="h-75">75%</option>
                                    <option value="h-100">100%</option>
                                    <option value="h-auto">Auto</option>
                                </select>
                            </div>
                        </div>

                        <div id="text-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Text Alignment</label>
                                <div class="description-text">Align text content</div>
                                <select class="form-select" id="text-align" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="text-start">Start</option>
                                    <option value="text-center">Center</option>
                                    <option value="text-end">End</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Text Transform</label>
                                <div class="description-text">Transform text case</div>
                                <select class="form-select" id="text-transform" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="text-lowercase">Lowercase</option>
                                    <option value="text-uppercase">Uppercase</option>
                                    <option value="text-capitalize">Capitalize</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Font Weight</label>
                                <div class="description-text">Set font weight</div>
                                <select class="form-select" id="font-weight" onchange="updateUtilityDemo()">
                                    <option value="">Default</option>
                                    <option value="fw-light">Light</option>
                                    <option value="fw-normal">Normal</option>
                                    <option value="fw-bold">Bold</option>
                                    <option value="fw-bolder">Bolder</option>
                                    <option value="fw-lighter">Lighter</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h5><i class="bi bi-eye me-2"></i>Live Preview</h5>
                        <div class="demo-container" id="utilities-demo-container">
                            <div class="p-3 bg-light border rounded">
                                <h5>Spacing Utilities Example</h5>
                                <div class="m-3 p-3 bg-primary text-white rounded">Box with margin and padding</div>
                                <div class="mt-2 p-2 bg-secondary text-white rounded">Another box with different spacing</div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Utility Presets:</label>
                            <div>
                                <button class="preset-btn" onclick="applyUtilityPreset('card-spacing')">
                                    <i class="bi bi-credit-card me-1"></i>Card Spacing
                                </button>
                                <button class="preset-btn" onclick="applyUtilityPreset('flex-center')">
                                    <i class="bi bi-bullseye me-1"></i>Flex Center
                                </button>
                                <button class="preset-btn" onclick="applyUtilityPreset('color-scheme')">
                                    <i class="bi bi-palette me-1"></i>Color Scheme
                                </button>
                            </div>
                        </div>

                        <div class="learning-tip">
                            <h6><i class="bi bi-lightbulb me-2"></i>Utility Tips</h6>
                            <ul class="mb-0 small">
                                <li>Spacing scale: 0 (0), 1 (0.25rem), 2 (0.5rem), 3 (1rem), 4 (1.5rem), 5 (3rem)</li>
                                <li>Use responsive utilities: <code>d-md-block</code>, <code>text-lg-center</code></li>
                                <li>Flexbox utilities work best with <code>d-flex</code> containers</li>
                                <li>Combine utilities for complex layouts without custom CSS</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5><i class="bi bi-code-square me-2"></i>Generated HTML</h5>
                        <div class="position-relative">
                            <button class="copy-btn" onclick="copyCode('utilities-html-output')">
                                <i class="bi bi-clipboard me-1"></i>Copy
                            </button>
                            <div class="code-output" id="utilities-html-output"><!-- HTML will be generated here --></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utilities demo updates
function updateUtilityDemo() {
    try {
        const category = document.getElementById('utility-category')?.value || 'spacing';
        
        // Hide all utility controls
        document.querySelectorAll('#utilities-tab .component-controls').forEach(control => {
            control.classList.remove('active');
        });
        
        // Show relevant controls
        const controls = document.getElementById(`${category}-controls`);
        if (controls) {
            controls.classList.add('active');
        }
        
        let html = '';
        
        switch(category) {
            case 'spacing':
                html = generateSpacingHTML();
                break;
            case 'colors':
                html = generateColorsHTML();
                break;
            case 'flexbox':
                html = generateFlexboxHTML();
                break;
            case 'display':
                html = generateDisplayHTML();
                break;
            case 'position':
                html = generatePositionHTML();
                break;
            case 'sizing':
                html = generateSizingHTML();
                break;
            case 'text':
                html = generateTextHTML();
                break;
            default:
                html = generateSpacingHTML();
        }
        
        const container = document.getElementById('utilities-demo-container');
        if (container) {
            container.innerHTML = html;
        }
        
        updateHTMLOutput('utilities-html-output', html);
    } catch (error) {
        console.error('❌ Error updating utility demo:', error);
    }
}

function generateSpacingHTML() {
    const type = document.getElementById('spacing-type')?.value || 'm';
    const direction = document.getElementById('spacing-direction')?.value || '';
    const size = document.getElementById('spacing-size')?.value || '3';
    
    if (type === 'both') {
        return `<div class="border p-4">
            <div class="m${direction}-${size} p${direction}-${size} bg-primary text-white text-center rounded">
                Margin ${size} + Padding ${size}
            </div>
            <div class="mt-2 bg-light p-2 rounded">
                Regular box for comparison
            </div>
        </div>`;
    }
    
    const className = `${type}${direction}-${size}`;
    const label = type === 'm' ? 'Margin' : 'Padding';
    
    return `<div class="border p-4">
        <div class="${className} bg-primary text-white text-center rounded p-3">
            ${label} ${direction || 'all'} ${size}
        </div>
        <div class="mt-2 bg-light p-2 rounded">
            Regular box for comparison
        </div>
    </div>`;
}

function generateColorsHTML() {
    const textColor = document.getElementById('text-color')?.value || '';
    const bgColor = document.getElementById('bg-color')?.value || '';
    
    const classes = [textColor, bgColor].filter(Boolean).join(' ');
    const classStr = classes ? ` class="${classes}"` : '';
    
    return `<div class="p-4 border rounded">
        <h5${classStr}>Colored Heading</h5>
        <p${classStr}>This paragraph demonstrates text and background color utilities. You can combine them to create various color schemes.</p>
        <div class="mt-3">
            <span class="badge bg-primary">Primary</span>
            <span class="badge bg-secondary">Secondary</span>
            <span class="badge bg-success">Success</span>
            <span class="badge bg-danger">Danger</span>
            <span class="badge bg-warning text-dark">Warning</span>
            <span class="badge bg-info">Info</span>
        </div>
    </div>`;
}

function generateFlexboxHTML() {
    const justifyContent = document.getElementById('justify-content')?.value || '';
    const alignItems = document.getElementById('align-items')?.value || '';
    const flexDirection = document.getElementById('flex-direction')?.value || '';
    
    const classes = ['d-flex', justifyContent, alignItems, flexDirection].filter(Boolean).join(' ');
    
    return `<div class="${classes}" style="min-height: 200px; border: 2px dashed #0d6efd; border-radius: 8px; padding: 1rem;">
        <div class="bg-primary text-white p-3 rounded m-1">Item 1</div>
        <div class="bg-success text-white p-3 rounded m-1">Item 2</div>
        <div class="bg-info text-white p-3 rounded m-1">Item 3</div>
    </div>`;
}

function generateDisplayHTML() {
    const displayType = document.getElementById('display-type')?.value || '';
    const visibility = document.getElementById('visibility')?.value || '';
    
    const classes = [displayType, visibility].filter(Boolean).join(' ');
    const classStr = classes ? ` class="${classes}"` : '';
    
    return `<div class="p-4 border rounded">
        <p>This is a regular paragraph.</p>
        <div${classStr} style="background: #0d6efd; color: white; padding: 1rem; border-radius: 8px;">
            Display utility applied to this div
        </div>
        <p>This is another regular paragraph.</p>
    </div>`;
}

function generatePositionHTML() {
    const positionType = document.getElementById('position-type')?.value || '';
    const positionHelper = document.getElementById('position-helper')?.value || '';
    
    const classes = [positionType, positionHelper].filter(Boolean).join(' ');
    const classStr = classes ? ` class="${classes}"` : '';
    
    return `<div class="position-relative border rounded p-4" style="height: 200px;">
        <div${classStr} style="background: #0d6efd; color: white; padding: 1rem; border-radius: 8px; width: 150px;">
            Positioned element
        </div>
        <p class="mt-3">This is the parent container with position-relative.</p>
    </div>`;
}

function generateSizingHTML() {
    const width = document.getElementById('width-size')?.value || '';
    const height = document.getElementById('height-size')?.value || '';
    
    const classes = [width, height].filter(Boolean).join(' ');
    const classStr = classes ? ` class="${classes}"` : '';
    
    return `<div class="p-4 border rounded">
        <div class="bg-light p-3 mb-3" style="height: 200px;">
            <div${classStr} style="background: #0d6efd; color: white; padding: 1rem; border-radius: 8px;">
                Sized element
            </div>
        </div>
        <p>Parent container for size reference</p>
    </div>`;
}

function generateTextHTML() {
    const textAlign = document.getElementById('text-align')?.value || '';
    const textTransform = document.getElementById('text-transform')?.value || '';
    const fontWeight = document.getElementById('font-weight')?.value || '';
    
    const classes = [textAlign, textTransform, fontWeight].filter(Boolean).join(' ');
    const classStr = classes ? ` class="${classes}"` : '';
    
    return `<div class="p-4 border rounded">
        <h4${classStr}>Text Utilities Example</h4>
        <p${classStr}>This paragraph demonstrates various text utilities including alignment, transformation, and font weight. Bootstrap provides many utility classes for controlling text appearance.</p>
        <div class="mt-3">
            <p class="text-start">Left aligned text</p>
            <p class="text-center">Center aligned text</p>
            <p class="text-end">Right aligned text</p>
        </div>
    </div>`;
}

function applyUtilityPreset(presetName) {
    const category = document.getElementById('utility-category');
    
    switch(presetName) {
        case 'card-spacing':
            if (category) category.value = 'spacing';
            const spacingType = document.getElementById('spacing-type');
            const spacingSize = document.getElementById('spacing-size');
            if (spacingType) spacingType.value = 'both';
            if (spacingSize) spacingSize.value = '4';
            break;
        case 'flex-center':
            if (category) category.value = 'flexbox';
            const justifyContent = document.getElementById('justify-content');
            const alignItems = document.getElementById('align-items');
            if (justifyContent) justifyContent.value = 'justify-content-center';
            if (alignItems) alignItems.value = 'align-items-center';
            break;
        case 'color-scheme':
            if (category) category.value = 'colors';
            const textColor = document.getElementById('text-color');
            const bgColor = document.getElementById('bg-color');
            if (textColor) textColor.value = 'text-white';
            if (bgColor) bgColor.value = 'bg-dark';
            break;
    }
    
    updateUtilityDemo();
    showToast(`Applied ${presetName} utility preset`, 'success');
}