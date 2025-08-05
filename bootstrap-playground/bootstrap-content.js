// Content tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load content tab content
    loadContentTab();
});

function loadContentTab() {
    const contentTab = document.getElementById('content-tab');
    if (!contentTab) return;

    contentTab.innerHTML = `
        <div class="component-card">
            <div class="component-header content">
                <div>
                    <h3 class="mb-0"><i class="bi bi-card-text me-2"></i>Bootstrap Content</h3>
                    <p class="mb-0 opacity-75">Typography, images, tables, and content presentation components</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="live-indicator pulse">LIVE</div>
                    <button class="fullscreen-btn" onclick="enterFullscreen('content')" title="Enter Fullscreen Mode">
                        <i class="bi bi-arrows-fullscreen"></i>
                        Fullscreen
                    </button>
                </div>
            </div>
            <div class="component-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="control-group">
                            <label class="control-label">Content Type</label>
                            <div class="description-text">Choose the type of content to display</div>
                            <select class="form-select" id="content-type" onchange="updateContentDemo()">
                                <option value="typography" selected>Typography</option>
                                <option value="table">Table</option>
                                <option value="list">Lists</option>
                                <option value="media">Media Object</option>
                                <option value="figure">Figure</option>
                                <option value="blockquote">Blockquote</option>
                            </select>
                        </div>

                        <div id="typography-controls" class="component-controls active">
                            <div class="control-group">
                                <label class="control-label">Heading Size</label>
                                <div class="description-text">Choose the heading level</div>
                                <select class="form-select" id="heading-size" onchange="updateContentDemo()">
                                    <option value="h1">H1 - Main Heading</option>
                                    <option value="h2" selected>H2 - Section Heading</option>
                                    <option value="h3">H3 - Subsection</option>
                                    <option value="h4">H4 - Minor Heading</option>
                                    <option value="h5">H5 - Small Heading</option>
                                    <option value="h6">H6 - Smallest</option>
                                    <option value="display-1">Display 1</option>
                                    <option value="display-4">Display 4</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Text Style</label>
                                <div class="description-text">Apply text utilities</div>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="text-lead" onchange="updateContentDemo()">
                                            <label class="form-check-label" for="text-lead">Lead Text</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="text-muted" onchange="updateContentDemo()">
                                            <label class="form-check-label" for="text-muted">Muted</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="text-center" onchange="updateContentDemo()">
                                            <label class="form-check-label" for="text-center">Centered</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="text-uppercase" onchange="updateContentDemo()">
                                            <label class="form-check-label" for="text-uppercase">Uppercase</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="table-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">Table Style</label>
                                <div class="description-text">Choose table appearance</div>
                                <select class="form-select" id="table-style" onchange="updateContentDemo()">
                                    <option value="table" selected>Basic Table</option>
                                    <option value="table table-striped">Striped Rows</option>
                                    <option value="table table-hover">Hoverable</option>
                                    <option value="table table-bordered">Bordered</option>
                                    <option value="table table-striped table-hover">Striped + Hover</option>
                                    <option value="table table-dark">Dark Theme</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Table Size</label>
                                <div class="description-text">Control table density</div>
                                <select class="form-select" id="table-size" onchange="updateContentDemo()">
                                    <option value="" selected>Default</option>
                                    <option value="table-sm">Small (Compact)</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Responsive</label>
                                <div class="description-text">Make table horizontally scrollable</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="table-responsive" checked onchange="updateContentDemo()">
                                    <label class="form-check-label" for="table-responsive">Responsive Table</label>
                                </div>
                            </div>
                        </div>

                        <div id="list-controls" class="component-controls">
                            <div class="control-group">
                                <label class="control-label">List Style</label>
                                <div class="description-text">Choose list appearance</div>
                                <select class="form-select" id="list-style" onchange="updateContentDemo()">
                                    <option value="list-group" selected>List Group</option>
                                    <option value="list-group list-group-flush">Flush List</option>
                                    <option value="list-group list-group-horizontal">Horizontal</option>
                                    <option value="list-unstyled">Unstyled List</option>
                                    <option value="list-inline">Inline List</option>
                                </select>
                            </div>

                            <div class="control-group">
                                <label class="control-label">List Features</label>
                                <div class="description-text">Add interactive features</div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="list-actionable" onchange="updateContentDemo()">
                                    <label class="form-check-label" for="list-actionable">Actionable Items</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="list-badges" onchange="updateContentDemo()">
                                    <label class="form-check-label" for="list-badges">Include Badges</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h5><i class="bi bi-eye me-2"></i>Live Preview</h5>
                        <div class="demo-container" id="content-demo-container">
                            <h2>Bootstrap Typography</h2>
                            <p class="lead">This is a lead paragraph that stands out from regular text.</p>
                            <p>Regular paragraph text with <strong>bold</strong> and <em>italic</em> styling. Bootstrap provides excellent typography defaults.</p>
                            <p class="text-muted">This is muted text that appears less prominent.</p>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Content Presets:</label>
                            <div>
                                <button class="preset-btn" onclick="applyContentPreset('article')">
                                    <i class="bi bi-file-text me-1"></i>Article
                                </button>
                                <button class="preset-btn" onclick="applyContentPreset('data-table')">
                                    <i class="bi bi-table me-1"></i>Data Table
                                </button>
                                <button class="preset-btn" onclick="applyContentPreset('media-list')">
                                    <i class="bi bi-list me-1"></i>Media List
                                </button>
                            </div>
                        </div>

                        <div class="learning-tip">
                            <h6><i class="bi bi-lightbulb me-2"></i>Content Tips</h6>
                            <ul class="mb-0 small">
                                <li>Use semantic HTML elements for better accessibility</li>
                                <li>Responsive tables scroll horizontally on small screens</li>
                                <li>Display headings are larger than regular headings</li>
                                <li>Lead paragraphs help establish content hierarchy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5><i class="bi bi-code-square me-2"></i>Generated HTML</h5>
                        <div class="position-relative">
                            <button class="copy-btn" onclick="copyCode('content-html-output')">
                                <i class="bi bi-clipboard me-1"></i>Copy
                            </button>
                            <div class="code-output" id="content-html-output"><!-- HTML will be generated here --></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Content demo updates
function updateContentDemo() {
    try {
        const contentType = document.getElementById('content-type')?.value || 'typography';
        
        // Hide all content controls
        document.querySelectorAll('#content-tab .component-controls').forEach(control => {
            control.classList.remove('active');
        });
        
        // Show relevant controls
        const controls = document.getElementById(`${contentType}-controls`);
        if (controls) {
            controls.classList.add('active');
        }
        
        let html = '';
        
        switch(contentType) {
            case 'typography':
                html = generateTypographyHTML();
                break;
            case 'table':
                html = generateTableHTML();
                break;
            case 'list':
                html = generateListHTML();
                break;
            case 'media':
                html = generateMediaHTML();
                break;
            case 'figure':
                html = generateFigureHTML();
                break;
            case 'blockquote':
                html = generateBlockquoteHTML();
                break;
            default:
                html = generateTypographyHTML();
        }
        
        const container = document.getElementById('content-demo-container');
        if (container) {
            container.innerHTML = html;
        }
        
        updateHTMLOutput('content-html-output', html);
    } catch (error) {
        console.error('❌ Error updating content demo:', error);
    }
}

function generateTypographyHTML() {
    const headingSize = document.getElementById('heading-size')?.value || 'h2';
    const isLead = document.getElementById('text-lead')?.checked || false;
    const isMuted = document.getElementById('text-muted')?.checked || false;
    const isCenter = document.getElementById('text-center')?.checked || false;
    const isUppercase = document.getElementById('text-uppercase')?.checked || false;
    
    let classes = [];
    if (isMuted) classes.push('text-muted');
    if (isCenter) classes.push('text-center');
    if (isUppercase) classes.push('text-uppercase');
    
    const classStr = classes.length ? ` class="${classes.join(' ')}"` : '';
    
    if (headingSize.startsWith('display')) {
        return `<h1 class="${headingSize}${classes.length ? ' ' + classes.join(' ') : ''}">Bootstrap Typography</h1>
            <p${isLead ? ' class="lead"' : ''}${classStr}>This is ${isLead ? 'a lead ' : ''}paragraph text with Bootstrap styling.</p>
            <p${classStr}>Regular paragraph text with <strong>bold</strong> and <em>italic</em> styling.</p>`;
    }
    
    return `<${headingSize}${classStr}>Bootstrap Typography</${headingSize}>
        <p${isLead ? ' class="lead"' : ''}${classStr}>This is ${isLead ? 'a lead ' : ''}paragraph text with Bootstrap styling.</p>
        <p${classStr}>Regular paragraph text with <strong>bold</strong> and <em>italic</em> styling.</p>`;
}

function generateTableHTML() {
    const tableStyle = document.getElementById('table-style')?.value || 'table';
    const tableSize = document.getElementById('table-size')?.value || '';
    const isResponsive = document.getElementById('table-responsive')?.checked || false;
    
    const classes = `${tableStyle}${tableSize ? ' ' + tableSize : ''}`;
    
    const tableHTML = `<table class="${classes}">
        <thead${tableStyle.includes('table-dark') ? '' : ' class="table-dark"'}>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </table>`;
    
    return isResponsive ? `<div class="table-responsive">${tableHTML}</div>` : tableHTML;
}

function generateListHTML() {
    const listStyle = document.getElementById('list-style')?.value || 'list-group';
    const isActionable = document.getElementById('list-actionable')?.checked || false;
    const hasBadges = document.getElementById('list-badges')?.checked || false;
    
    if (listStyle === 'list-unstyled') {
        return `<ul class="list-unstyled">
            <li>This is a list item</li>
            <li>And another one</li>
            <li>But they're displayed as block elements</li>
            <li>Without list-style</li>
        </ul>`;
    }
    
    if (listStyle === 'list-inline') {
        return `<ul class="list-inline">
            <li class="list-inline-item">This is a list item.</li>
            <li class="list-inline-item">And another one.</li>
            <li class="list-inline-item">But they're displayed inline.</li>
        </ul>`;
    }
    
    const itemTag = isActionable ? 'a' : 'li';
    const itemClass = isActionable ? 'list-group-item list-group-item-action' : 'list-group-item';
    const href = isActionable ? ' href="#"' : '';
    
    return `<${listStyle.includes('list-group') ? 'div' : 'ul'} class="${listStyle}">
        <${itemTag} class="${itemClass} active"${href}>
            An active item${hasBadges ? ' <span class="badge bg-primary rounded-pill">14</span>' : ''}
        </${itemTag}>
        <${itemTag} class="${itemClass}"${href}>
            A second item${hasBadges ? ' <span class="badge bg-secondary rounded-pill">2</span>' : ''}
        </${itemTag}>
        <${itemTag} class="${itemClass}"${href}>
            A third item${hasBadges ? ' <span class="badge bg-success rounded-pill">1</span>' : ''}
        </${itemTag}>
        <${itemTag} class="${itemClass}"${href}>
            A fourth item
        </${itemTag}>
        <${itemTag} class="${itemClass}${isActionable ? ' disabled' : ''}"${href}${isActionable ? ' tabindex="-1"' : ''}>
            A disabled item
        </${itemTag}>
    </${listStyle.includes('list-group') ? 'div' : 'ul'}>`;
}

function generateMediaHTML() {
    return `<div class="d-flex">
        <div class="flex-shrink-0">
            <div class="bg-secondary rounded" style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-person text-white fs-4"></i>
            </div>
        </div>
        <div class="flex-grow-1 ms-3">
            <h5 class="mt-0">Media heading</h5>
            This is some placeholder content for the media object. It is used to demonstrate the media object component.
        </div>
    </div>`;
}

function generateFigureHTML() {
    return `<figure class="figure">
        <div class="bg-light border rounded d-flex align-items-center justify-content-center" style="width: 400px; height: 300px;">
            <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
        </div>
        <figcaption class="figure-caption">A caption for the above image.</figcaption>
    </figure>`;
}

function generateBlockquoteHTML() {
    return `<blockquote class="blockquote">
        <p>A well-known quote, contained in a blockquote element.</p>
        <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>`;
}

function applyContentPreset(presetName) {
    const contentType = document.getElementById('content-type');
    
    switch(presetName) {
        case 'article':
            if (contentType) contentType.value = 'typography';
            const headingSize = document.getElementById('heading-size');
            const textLead = document.getElementById('text-lead');
            if (headingSize) headingSize.value = 'h1';
            if (textLead) textLead.checked = true;
            break;
        case 'data-table':
            if (contentType) contentType.value = 'table';
            const tableStyle = document.getElementById('table-style');
            const tableResponsive = document.getElementById('table-responsive');
            if (tableStyle) tableStyle.value = 'table table-striped table-hover';
            if (tableResponsive) tableResponsive.checked = true;
            break;
        case 'media-list':
            if (contentType) contentType.value = 'list';
            const listStyle = document.getElementById('list-style');
            const listActionable = document.getElementById('list-actionable');
            const listBadges = document.getElementById('list-badges');
            if (listStyle) listStyle.value = 'list-group';
            if (listActionable) listActionable.checked = true;
            if (listBadges) listBadges.checked = true;
            break;
    }
    
    updateContentDemo();
    showToast(`Applied ${presetName} content preset`, 'success');
}