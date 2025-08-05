// Advanced tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load advanced tab content
    loadAdvancedTab();
});

function loadAdvancedTab() {
    const advancedTab = document.getElementById('advanced-tab');
    if (!advancedTab) return;

    advancedTab.innerHTML = `
        <div class="component-card">
            <div class="component-header advanced">
                <div>
                    <h3 class="mb-0"><i class="bi bi-gear me-2"></i>Advanced Bootstrap</h3>
                    <p class="mb-0 opacity-75">JavaScript components, modals, carousels, and advanced interactions</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="live-indicator pulse">LIVE</div>
                    <button class="fullscreen-btn" onclick="enterFullscreen('advanced')" title="Enter Fullscreen Mode">
                        <i class="bi bi-arrows-fullscreen"></i>
                        Fullscreen
                    </button>
                </div>
            </div>
            <div class="component-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="control-group">
                            <label class="control-label">Advanced Component</label>
                            <div class="description-text">Choose advanced Bootstrap features</div>
                            <select class="form-select" id="advanced-type" onchange="updateAdvancedDemo()">
                                <option value="modal" selected>Modal Dialog</option>
                                <option value="carousel">Carousel</option>
                                <option value="accordion">Accordion</option>
                                <option value="offcanvas">Offcanvas</option>
                                <option value="tooltip">Tooltips</option>
                                <option value="popover">Popovers</option>
                                <option value="collapse">Collapse</option>
                                <option value="scrollspy">Scrollspy</option>
                            </select>
                        </div>

                        <div id="modal-controls" class="component-controls active">
                            <div class="control-group">
                                <label class="control-label">Modal Size</label>
                                <div class="description-text">Choose modal dialog size</div>
                                <select class="form-select" id="modal-size" onchange="updateAdvancedDemo()">
                                    <option value="">Default</option>
                                    <option value="modal-sm">Small</option>
                                    <option value="modal-lg">Large</option>
                                    <option value="modal-xl">Extra Large</option>
                                    <option value="modal-fullscreen">Fullscreen</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Modal Features</label>
                                <div class="description-text">Configure modal behavior</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="modal-fade" checked onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="modal-fade">Fade Animation</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="modal-centered" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="modal-centered">Vertically Centered</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="modal-scrollable" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="modal-scrollable">Scrollable Body</label>
                                </div>
                            </div>
                        </div>

                        <div id="carousel-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Number of Slides</label>
                                <div class="description-text">Set how many slides in carousel</div>
                                <input type="range" class="form-range" id="carousel-slides" min="2" max="5" value="3" oninput="updateRangeValue('carousel-slides')" onchange="updateAdvancedDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>2</span>
                                    <span class="range-value" id="carousel-slides-value">3</span>
                                    <span>5</span>
                                </div>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Carousel Features</label>
                                <div class="description-text">Configure carousel behavior</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="carousel-indicators" checked onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="carousel-indicators">Show Indicators</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="carousel-controls" checked onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="carousel-controls">Show Controls</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="carousel-captions" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="carousel-captions">Show Captions</label>
                                </div>
                            </div>
                        </div>

                        <div id="accordion-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Number of Items</label>
                                <div class="description-text">Set how many accordion items</div>
                                <input type="range" class="form-range" id="accordion-items" min="2" max="5" value="3" oninput="updateRangeValue('accordion-items')" onchange="updateAdvancedDemo()">
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>2</span>
                                    <span class="range-value" id="accordion-items-value">3</span>
                                    <span>5</span>
                                </div>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Accordion Behavior</label>
                                <div class="description-text">Configure accordion features</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="accordion-flush" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="accordion-flush">Flush Style</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="accordion-always-open" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="accordion-always-open">Always Open</label>
                                </div>
                            </div>
                        </div>

                        <div id="offcanvas-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Offcanvas Placement</label>
                                <div class="description-text">Choose where offcanvas appears</div>
                                <select class="form-select" id="offcanvas-placement" onchange="updateAdvancedDemo()">
                                    <option value="offcanvas-start" selected>Start (Left)</option>
                                    <option value="offcanvas-end">End (Right)</option>
                                    <option value="offcanvas-top">Top</option>
                                    <option value="offcanvas-bottom">Bottom</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Offcanvas Features</label>
                                <div class="description-text">Configure offcanvas behavior</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="offcanvas-backdrop" checked onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="offcanvas-backdrop">Show Backdrop</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="offcanvas-scroll" onchange="updateAdvancedDemo()">
                                    <label class="form-check-label" for="offcanvas-scroll">Allow Body Scroll</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h5><i class="bi bi-eye me-2"></i>Live Preview</h5>
                        <div class="demo-container" id="advanced-demo-container">
                            <!-- Modal trigger button -->
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#demoModal">
                                Launch Demo Modal
                            </button>

                            <!-- Modal -->
                            <div class="modal fade" id="demoModal" tabindex="-1" aria-labelledby="demoModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="demoModalLabel">Demo Modal</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            This is a working Bootstrap modal with JavaScript functionality!
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" onclick="showToast('Modal action performed!', 'success')">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Advanced Presets:</label>
                            <div>
                                <button class="preset-btn" onclick="applyAdvancedPreset('image-gallery')">
                                    <i class="bi bi-images me-1"></i>Image Gallery
                                </button>
                                <button class="preset-btn" onclick="applyAdvancedPreset('faq-section')">
                                    <i class="bi bi-question-circle me-1"></i>FAQ Section
                                </button>
                                <button class="preset-btn" onclick="applyAdvancedPreset('sidebar-menu')">
                                    <i class="bi bi-list me-1"></i>Sidebar Menu
                                </button>
                            </div>
                        </div>

                        <div class="learning-tip">
                            <h6><i class="bi bi-lightbulb me-2"></i>Advanced Tips</h6>
                            <ul class="mb-0 small">
                                <li>Always include proper ARIA attributes for accessibility</li>
                                <li>Use data-bs-toggle attributes for JavaScript components</li>
                                <li>Test interactive components on mobile devices</li>
                                <li>Consider performance when using multiple JS components</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5><i class="bi bi-code-square me-2"></i>Generated HTML</h5>
                        <div class="position-relative">
                            <button class="copy-btn" onclick="copyCode('advanced-html-output')">
                                <i class="bi bi-clipboard me-1"></i>Copy
                            </button>
                            <div class="code-output" id="advanced-html-output"><!-- HTML will be generated here --></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Advanced demo updates
function updateAdvancedDemo() {
    try {
        const advancedType = document.getElementById('advanced-type')?.value || 'modal';
        
        // Hide all advanced controls
        document.querySelectorAll('#advanced-tab .component-controls').forEach(control => {
            control.classList.remove('active');
        });
        
        // Show relevant controls
        const controls = document.getElementById(`${advancedType}-controls`);
        if (controls) {
            controls.classList.add('active');
        }
        
        let html = '';
        
        switch(advancedType) {
            case 'modal':
                html = generateModalHTML();
                break;
            case 'carousel':
                html = generateCarouselHTML();
                break;
            case 'accordion':
                html = generateAccordionHTML();
                break;
            case 'offcanvas':
                html = generateOffcanvasHTML();
                break;
            case 'tooltip':
                html = generateTooltipHTML();
                break;
            case 'popover':
                html = generatePopoverHTML();
                break;
            case 'collapse':
                html = generateCollapseHTML();
                break;
            case 'scrollspy':
                html = generateScrollspyHTML();
                break;
            default:
                html = generateModalHTML();
        }
        
        const container = document.getElementById('advanced-demo-container');
        if (container) {
            container.innerHTML = html;
            
            // Initialize Bootstrap components
            initializeAdvancedComponents(advancedType);
        }
        
        updateHTMLOutput('advanced-html-output', html);
    } catch (error) {
        console.error('❌ Error updating advanced demo:', error);
    }
}

function generateModalHTML() {
    const size = document.getElementById('modal-size')?.value || '';
    const fade = document.getElementById('modal-fade')?.checked !== false;
    const centered = document.getElementById('modal-centered')?.checked || false;
    const scrollable = document.getElementById('modal-scrollable')?.checked || false;
    
    let dialogClasses = 'modal-dialog';
    if (size) dialogClasses += ` ${size}`;
    if (centered) dialogClasses += ' modal-dialog-centered';
    if (scrollable) dialogClasses += ' modal-dialog-scrollable';
    
    const modalClasses = `modal${fade ? ' fade' : ''}`;
    
    return `<!-- Modal trigger button -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#advancedModal">
    Launch Demo Modal
</button>

<!-- Modal -->
<div class="${modalClasses}" id="advancedModal" tabindex="-1" aria-labelledby="advancedModalLabel" aria-hidden="true">
    <div class="${dialogClasses}">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="advancedModalLabel">Advanced Modal</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>This is a customizable Bootstrap modal with various size and behavior options.</p>
                ${scrollable ? '<p>This modal has a scrollable body. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20) + '</p>' : ''}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="showToast('Modal action performed!', 'success')">Save changes</button>
            </div>
        </div>
    </div>
</div>`;
}

function generateCarouselHTML() {
    const slides = parseInt(document.getElementById('carousel-slides')?.value) || 3;
    const indicators = document.getElementById('carousel-indicators')?.checked !== false;
    const controls = document.getElementById('carousel-controls')?.checked !== false;
    const captions = document.getElementById('carousel-captions')?.checked || false;
    
    const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];
    
    let html = `<div id="advancedCarousel" class="carousel slide" data-bs-ride="carousel">`;
    
    if (indicators) {
        html += '<div class="carousel-indicators">';
        for (let i = 0; i < slides; i++) {
            html += `<button type="button" data-bs-target="#advancedCarousel" data-bs-slide-to="${i}"${i === 0 ? ' class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>`;
        }
        html += '</div>';
    }
    
    html += '<div class="carousel-inner">';
    for (let i = 0; i < slides; i++) {
        const color = colors[i % colors.length];
        const isActive = i === 0 ? ' active' : '';
        
        html += `<div class="carousel-item${isActive}">
            <div class="${color} d-block w-100 text-white text-center d-flex align-items-center justify-content-center" style="height: 300px;">
                <div>
                    <h3>Slide ${i + 1}</h3>
                    ${captions ? `<p>Caption for slide ${i + 1} with some descriptive text.</p>` : ''}
                </div>
            </div>
        </div>`;
    }
    html += '</div>';
    
    if (controls) {
        html += `<button class="carousel-control-prev" type="button" data-bs-target="#advancedCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#advancedCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>`;
    }
    
    html += '</div>';
    return html;
}

function generateAccordionHTML() {
    const items = parseInt(document.getElementById('accordion-items')?.value) || 3;
    const flush = document.getElementById('accordion-flush')?.checked || false;
    const alwaysOpen = document.getElementById('accordion-always-open')?.checked || false;
    
    const accordionClass = `accordion${flush ? ' accordion-flush' : ''}`;
    const parentTarget = alwaysOpen ? '' : ' data-bs-parent="#advancedAccordion"';
    
    let html = `<div class="${accordionClass}" id="advancedAccordion">`;
    
    for (let i = 0; i < items; i++) {
        const isOpen = i === 0 && !alwaysOpen;
        const collapseClass = `collapse${isOpen ? ' show' : ''}`;
        
        html += `<div class="accordion-item">
            <h2 class="accordion-header" id="heading${i}">
                <button class="accordion-button${!isOpen ? ' collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="${isOpen}" aria-controls="collapse${i}">
                    Accordion Item #${i + 1}
                </button>
            </h2>
            <div id="collapse${i}" class="${collapseClass}" aria-labelledby="heading${i}"${parentTarget}>
                <div class="accordion-body">
                    <strong>This is the ${i + 1} item's accordion body.</strong> You can modify any of this with CSS or JavaScript. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
            </div>
        </div>`;
    }
    
    html += '</div>';
    return html;
}

function generateOffcanvasHTML() {
    const placement = document.getElementById('offcanvas-placement')?.value || 'offcanvas-start';
    const backdrop = document.getElementById('offcanvas-backdrop')?.checked !== false;
    const scroll = document.getElementById('offcanvas-scroll')?.checked || false;
    
    const backdropAttr = backdrop ? '' : ' data-bs-backdrop="false"';
    const scrollAttr = scroll ? ' data-bs-scroll="true"' : '';
    
    return `<!-- Offcanvas trigger button -->
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#advancedOffcanvas" aria-controls="advancedOffcanvas">
    Toggle Offcanvas
</button>

<!-- Offcanvas -->
<div class="offcanvas ${placement}" tabindex="-1" id="advancedOffcanvas"${backdropAttr}${scrollAttr} aria-labelledby="advancedOffcanvasLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="advancedOffcanvasLabel">Offcanvas Menu</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div>
            This is an offcanvas component that slides in from the ${placement.replace('offcanvas-', '')}.
        </div>
        <div class="mt-3">
            <h6>Navigation Menu</h6>
            <ul class="list-unstyled">
                <li><a href="#" class="text-decoration-none">Home</a></li>
                <li><a href="#" class="text-decoration-none">About</a></li>
                <li><a href="#" class="text-decoration-none">Services</a></li>
                <li><a href="#" class="text-decoration-none">Contact</a></li>
            </ul>
        </div>
    </div>
</div>`;
}

function generateTooltipHTML() {
    return `<div class="d-flex flex-wrap gap-3">
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
        Tooltip on top
    </button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
        Tooltip on right
    </button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
        Tooltip on bottom
    </button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
        Tooltip on left
    </button>
</div>
<p class="mt-3">Hover over the buttons to see tooltips in action.</p>`;
}

function generatePopoverHTML() {
    return `<div class="d-flex flex-wrap gap-3">
    <button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">
        Click to toggle popover
    </button>
    <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Top popover">
        Popover on top
    </button>
    <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Right popover">
        Popover on right
    </button>
</div>
<p class="mt-3">Click the buttons to show popovers with rich content.</p>`;
}

function generateCollapseHTML() {
    return `<p>
    <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
        Link with href
    </a>
    <button class="btn btn-primary ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        Button with data-bs-target
    </button>
</p>
<div class="collapse" id="collapseExample">
    <div class="card card-body">
        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
    </div>
</div>

<div class="mt-4">
    <h6>Multiple Targets</h6>
    <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false">
        Toggle both elements
    </button>
    <div class="row mt-2">
        <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseExample1">
                <div class="card card-body">
                    Some placeholder content for the first collapsible component.
                </div>
            </div>
        </div>
        <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseExample2">
                <div class="card card-body">
                    Some placeholder content for the second collapsible component.
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function generateScrollspyHTML() {
    return `<div class="row">
    <div class="col-4">
        <nav id="navbar-example3" class="navbar navbar-light bg-light flex-column align-items-stretch p-3">
            <nav class="nav nav-pills flex-column">
                <a class="nav-link" href="#item-1">Item 1</a>
                <nav class="nav nav-pills flex-column">
                    <a class="nav-link ms-3 my-1" href="#item-1-1">Item 1-1</a>
                    <a class="nav-link ms-3 my-1" href="#item-1-2">Item 1-2</a>
                </nav>
                <a class="nav-link" href="#item-2">Item 2</a>
                <a class="nav-link" href="#item-3">Item 3</a>
                <nav class="nav nav-pills flex-column">
                    <a class="nav-link ms-3 my-1" href="#item-3-1">Item 3-1</a>
                    <a class="nav-link ms-3 my-1" href="#item-3-2">Item 3-2</a>
                </nav>
            </nav>
        </nav>
    </div>
    <div class="col-8">
        <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-offset="0" class="scrollspy-example" tabindex="0" style="height: 400px; overflow-y: auto;">
            <h4 id="item-1">Item 1</h4>
            <p>This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation link is highlighted.</p>
            <h5 id="item-1-1">Item 1-1</h5>
            <p>This is some placeholder content for the scrollspy page.</p>
            <h5 id="item-1-2">Item 1-2</h5>
            <p>This is some placeholder content for the scrollspy page.</p>
            <h4 id="item-2">Item 2</h4>
            <p>This is some placeholder content for the scrollspy page.</p>
            <h4 id="item-3">Item 3</h4>
            <p>This is some placeholder content for the scrollspy page.</p>
            <h5 id="item-3-1">Item 3-1</h5>
            <p>This is some placeholder content for the scrollspy page.</p>
            <h5 id="item-3-2">Item 3-2</h5>
            <p>This is some placeholder content for the scrollspy page.</p>
        </div>
    </div>
</div>`;
}

function initializeAdvancedComponents(componentType) {
    try {
        // Initialize tooltips
        if (componentType === 'tooltip') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Initialize popovers
        if (componentType === 'popover') {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });
        }
        
        // Initialize scrollspy
        if (componentType === 'scrollspy') {
            const scrollSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
            scrollSpyList.forEach(function (scrollSpyEl) {
                bootstrap.ScrollSpy.getOrCreateInstance(scrollSpyEl);
            });
        }
        
    } catch (error) {
        console.error('❌ Error initializing advanced components:', error);
    }
}

function applyAdvancedPreset(presetName) {
    const advancedType = document.getElementById('advanced-type');
    
    switch(presetName) {
        case 'image-gallery':
            if (advancedType) advancedType.value = 'carousel';
            const carouselSlides = document.getElementById('carousel-slides');
            const carouselIndicators = document.getElementById('carousel-indicators');
            const carouselControls = document.getElementById('carousel-controls');
            if (carouselSlides) carouselSlides.value = '4';
            if (carouselIndicators) carouselIndicators.checked = true;
            if (carouselControls) carouselControls.checked = true;
            break;
        case 'faq-section':
            if (advancedType) advancedType.value = 'accordion';
            const accordionItems = document.getElementById('accordion-items');
            const accordionFlush = document.getElementById('accordion-flush');
            if (accordionItems) accordionItems.value = '4';
            if (accordionFlush) accordionFlush.checked = true;
            break;
        case 'sidebar-menu':
            if (advancedType) advancedType.value = 'offcanvas';
            const offcanvasPlacement = document.getElementById('offcanvas-placement');
            const offcanvasBackdrop = document.getElementById('offcanvas-backdrop');
            if (offcanvasPlacement) offcanvasPlacement.value = 'offcanvas-start';
            if (offcanvasBackdrop) offcanvasBackdrop.checked = true;
            break;
    }
    
    updateAdvancedDemo();
    showToast(`Applied ${presetName} advanced preset`, 'success');
}