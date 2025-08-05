// Forms tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load forms tab content
    loadFormsTab();
});

function loadFormsTab() {
    const formsTab = document.getElementById('forms-tab');
    if (!formsTab) return;

    formsTab.innerHTML = `
        <div class="component-card">
            <div class="component-header forms">
                <div>
                    <h3 class="mb-0"><i class="bi bi-ui-checks me-2"></i>Bootstrap Forms</h3>
                    <p class="mb-0 opacity-75">Create beautiful, accessible forms with Bootstrap form controls and validation</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="live-indicator pulse">LIVE</div>
                    <button class="fullscreen-btn" onclick="enterFullscreen('forms')" title="Enter Fullscreen Mode">
                        <i class="bi bi-arrows-fullscreen"></i>
                        Fullscreen
                    </button>
                </div>
            </div>
            <div class="component-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="control-group">
                            <label class="control-label">Form Type</label>
                            <div class="description-text">Choose the type of form to build</div>
                            <select class="form-select" id="form-type" onchange="updateFormDemo()">
                                <option value="contact" selected>Contact Form</option>
                                <option value="login">Login Form</option>
                                <option value="registration">Registration Form</option>
                                <option value="feedback">Feedback Form</option>
                                <option value="custom">Custom Form</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label class="control-label">Form Style</label>
                            <div class="description-text">Choose the visual style of the form</div>
                            <select class="form-select" id="form-style" onchange="updateFormDemo()">
                                <option value="default" selected>Default</option>
                                <option value="floating">Floating Labels</option>
                                <option value="inline">Inline Form</option>
                                <option value="horizontal">Horizontal Layout</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label class="control-label">Validation Style</label>
                            <div class="description-text">Add validation feedback to form controls</div>
                            <select class="form-select" id="form-validation" onchange="updateFormDemo()">
                                <option value="none" selected>No Validation</option>
                                <option value="valid">Valid State</option>
                                <option value="invalid">Invalid State</option>
                                <option value="both">Mixed States</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label class="control-label">Form Size</label>
                            <div class="description-text">Control the size of form elements</div>
                            <select class="form-select" id="form-size" onchange="updateFormDemo()">
                                <option value="form-control-sm">Small</option>
                                <option value="" selected>Default</option>
                                <option value="form-control-lg">Large</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h5><i class="bi bi-eye me-2"></i>Live Preview</h5>
                        <div class="demo-container" id="forms-demo-container">
                            <form class="needs-validation" novalidate>
                                <div class="mb-3">
                                    <label for="demo-name" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="demo-name" required>
                                    <div class="valid-feedback">Looks good!</div>
                                    <div class="invalid-feedback">Please provide a valid name.</div>
                                </div>
                                <div class="mb-3">
                                    <label for="demo-email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="demo-email" required>
                                    <div class="valid-feedback">Looks good!</div>
                                    <div class="invalid-feedback">Please provide a valid email.</div>
                                </div>
                                <div class="mb-3">
                                    <label for="demo-message" class="form-label">Message</label>
                                    <textarea class="form-control" id="demo-message" rows="3" required></textarea>
                                    <div class="valid-feedback">Looks good!</div>
                                    <div class="invalid-feedback">Please provide a message.</div>
                                </div>
                                <button class="btn btn-primary" type="submit" onclick="handleFormSubmit(event)">Submit Form</button>
                            </form>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Form Presets:</label>
                            <div>
                                <button class="preset-btn" onclick="applyFormPreset('contact')">
                                    <i class="bi bi-envelope me-1"></i>Contact
                                </button>
                                <button class="preset-btn" onclick="applyFormPreset('login')">
                                    <i class="bi bi-person me-1"></i>Login
                                </button>
                                <button class="preset-btn" onclick="applyFormPreset('survey')">
                                    <i class="bi bi-clipboard-check me-1"></i>Survey
                                </button>
                            </div>
                        </div>

                        <div class="learning-tip">
                            <h6><i class="bi bi-lightbulb me-2"></i>Form Best Practices</h6>
                            <ul class="mb-0 small">
                                <li>Always use proper labels for accessibility</li>
                                <li>Provide clear validation feedback</li>
                                <li>Use appropriate input types (email, tel, etc.)</li>
                                <li>Group related fields with fieldsets</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5><i class="bi bi-code-square me-2"></i>Generated HTML</h5>
                        <div class="position-relative">
                            <button class="copy-btn" onclick="copyCode('forms-html-output')">
                                <i class="bi bi-clipboard me-1"></i>Copy
                            </button>
                            <div class="code-output" id="forms-html-output"><!-- HTML will be generated here --></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Forms demo updates
function updateFormDemo() {
    try {
        const formType = document.getElementById('form-type')?.value || 'contact';
        const formStyle = document.getElementById('form-style')?.value || 'default';
        const validation = document.getElementById('form-validation')?.value || 'none';
        const size = document.getElementById('form-size')?.value || '';
        
        let html = generateFormHTML(formType, formStyle, validation, size);
        
        const container = document.getElementById('forms-demo-container');
        if (container) {
            container.innerHTML = html;
        }
        
        updateHTMLOutput('forms-html-output', html);
    } catch (error) {
        console.error('❌ Error updating form demo:', error);
    }
}

function generateFormHTML(type, style, validation, size) {
    const sizeClass = size ? ` ${size}` : '';
    const isFloating = style === 'floating';
    const isInline = style === 'inline';
    const isHorizontal = style === 'horizontal';
    
    let formClasses = 'needs-validation';
    if (isInline) formClasses += ' row row-cols-lg-auto g-3 align-items-center';
    
    if (type === 'login') {
        return generateLoginForm(isFloating, sizeClass, validation, isHorizontal);
    } else if (type === 'registration') {
        return generateRegistrationForm(isFloating, sizeClass, validation, isHorizontal);
    } else if (type === 'feedback') {
        return generateFeedbackForm(isFloating, sizeClass, validation, isHorizontal);
    }
    
    // Default contact form
    return generateContactForm(isFloating, sizeClass, validation, isHorizontal, isInline);
}

function generateContactForm(isFloating, sizeClass, validation, isHorizontal, isInline) {
    const validClass = validation === 'valid' || validation === 'both' ? ' is-valid' : '';
    const invalidClass = validation === 'invalid' || validation === 'both' ? ' is-invalid' : '';
    
    if (isInline) {
        return `<form class="row row-cols-lg-auto g-3 align-items-center" novalidate>
            <div class="col-12">
                <input type="text" class="form-control${sizeClass}${validClass}" placeholder="Full Name" required>
            </div>
            <div class="col-12">
                <input type="email" class="form-control${sizeClass}${validClass}" placeholder="Email" required>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" onclick="handleFormSubmit(event)">Submit</button>
            </div>
        </form>`;
    }
    
    if (isHorizontal) {
        return `<form class="needs-validation" novalidate>
            <div class="row mb-3">
                <label for="demo-name" class="col-sm-3 col-form-label">Full Name</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control${sizeClass}${validClass}" id="demo-name" required>
                    ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a valid name.</div>' : ''}
                </div>
            </div>
            <div class="row mb-3">
                <label for="demo-email" class="col-sm-3 col-form-label">Email</label>
                <div class="col-sm-9">
                    <input type="email" class="form-control${sizeClass}${validClass}" id="demo-email" required>
                    ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a valid email.</div>' : ''}
                </div>
            </div>
            <div class="row mb-3">
                <label for="demo-message" class="col-sm-3 col-form-label">Message</label>
                <div class="col-sm-9">
                    <textarea class="form-control${sizeClass}${validClass}" id="demo-message" rows="3" required></textarea>
                    ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a message.</div>' : ''}
                </div>
            </div>
            <div class="row">
                <div class="col-sm-9 offset-sm-3">
                    <button class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" type="submit" onclick="handleFormSubmit(event)">Submit Form</button>
                </div>
            </div>
        </form>`;
    }
    
    return `<form class="needs-validation" novalidate>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="demo-name" class="form-label">Full Name</label>'}
            <input type="text" class="form-control${sizeClass}${validClass}" id="demo-name" ${isFloating ? 'placeholder="Full Name"' : ''} required>
            ${isFloating ? '<label for="demo-name">Full Name</label>' : ''}
            ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a valid name.</div>' : ''}
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="demo-email" class="form-label">Email</label>'}
            <input type="email" class="form-control${sizeClass}${validClass}" id="demo-email" ${isFloating ? 'placeholder="name@example.com"' : ''} required>
            ${isFloating ? '<label for="demo-email">Email</label>' : ''}
            ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a valid email.</div>' : ''}
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="demo-message" class="form-label">Message</label>'}
            <textarea class="form-control${sizeClass}${validClass}" id="demo-message" rows="3" ${isFloating ? 'placeholder="Message"' : ''} required></textarea>
            ${isFloating ? '<label for="demo-message">Message</label>' : ''}
            ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a message.</div>' : ''}
        </div>
        <button class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" type="submit" onclick="handleFormSubmit(event)">Submit Form</button>
    </form>`;
}

function generateLoginForm(isFloating, sizeClass, validation, isHorizontal) {
    const validClass = validation === 'valid' || validation === 'both' ? ' is-valid' : '';
    
    return `<form class="needs-validation" novalidate>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="login-email" class="form-label">Email</label>'}
            <input type="email" class="form-control${sizeClass}${validClass}" id="login-email" ${isFloating ? 'placeholder="name@example.com"' : ''} required>
            ${isFloating ? '<label for="login-email">Email</label>' : ''}
            ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a valid email.</div>' : ''}
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="login-password" class="form-label">Password</label>'}
            <input type="password" class="form-control${sizeClass}${validClass}" id="login-password" ${isFloating ? 'placeholder="Password"' : ''} required>
            ${isFloating ? '<label for="login-password">Password</label>' : ''}
            ${validation !== 'none' ? '<div class="valid-feedback">Looks good!</div><div class="invalid-feedback">Please provide a password.</div>' : ''}
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember-me">
            <label class="form-check-label" for="remember-me">Remember me</label>
        </div>
        <button type="submit" class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" onclick="handleFormSubmit(event)">Sign In</button>
    </form>`;
}

function generateRegistrationForm(isFloating, sizeClass, validation, isHorizontal) {
    const validClass = validation === 'valid' || validation === 'both' ? ' is-valid' : '';
    
    return `<form class="needs-validation" novalidate>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3${isFloating ? ' form-floating' : ''}">
                    ${isFloating ? '' : '<label for="first-name" class="form-label">First Name</label>'}
                    <input type="text" class="form-control${sizeClass}${validClass}" id="first-name" ${isFloating ? 'placeholder="First Name"' : ''} required>
                    ${isFloating ? '<label for="first-name">First Name</label>' : ''}
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3${isFloating ? ' form-floating' : ''}">
                    ${isFloating ? '' : '<label for="last-name" class="form-label">Last Name</label>'}
                    <input type="text" class="form-control${sizeClass}${validClass}" id="last-name" ${isFloating ? 'placeholder="Last Name"' : ''} required>
                    ${isFloating ? '<label for="last-name">Last Name</label>' : ''}
                </div>
            </div>
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="reg-email" class="form-label">Email</label>'}
            <input type="email" class="form-control${sizeClass}${validClass}" id="reg-email" ${isFloating ? 'placeholder="name@example.com"' : ''} required>
            ${isFloating ? '<label for="reg-email">Email</label>' : ''}
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="reg-password" class="form-label">Password</label>'}
            <input type="password" class="form-control${sizeClass}${validClass}" id="reg-password" ${isFloating ? 'placeholder="Password"' : ''} required>
            ${isFloating ? '<label for="reg-password">Password</label>' : ''}
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="terms" required>
            <label class="form-check-label" for="terms">I agree to the terms and conditions</label>
        </div>
        <button type="submit" class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" onclick="handleFormSubmit(event)">Register</button>
    </form>`;
}

function generateFeedbackForm(isFloating, sizeClass, validation, isHorizontal) {
    const validClass = validation === 'valid' || validation === 'both' ? ' is-valid' : '';
    
    return `<form class="needs-validation" novalidate>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="feedback-name" class="form-label">Your Name</label>'}
            <input type="text" class="form-control${sizeClass}${validClass}" id="feedback-name" ${isFloating ? 'placeholder="Your Name"' : ''} required>
            ${isFloating ? '<label for="feedback-name">Your Name</label>' : ''}
        </div>
        <div class="mb-3">
            <label for="rating" class="form-label">Rating</label>
            <select class="form-select${sizeClass}${validClass}" id="rating" required>
                <option value="">Choose...</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
            </select>
        </div>
        <div class="mb-3${isFloating ? ' form-floating' : ''}">
            ${isFloating ? '' : '<label for="feedback-comments" class="form-label">Comments</label>'}
            <textarea class="form-control${sizeClass}${validClass}" id="feedback-comments" rows="4" ${isFloating ? 'placeholder="Your feedback..."' : ''} required></textarea>
            ${isFloating ? '<label for="feedback-comments">Comments</label>' : ''}
        </div>
        <button type="submit" class="btn btn-primary${sizeClass ? ' btn' + sizeClass.replace('form-control', '') : ''}" onclick="handleFormSubmit(event)">Submit Feedback</button>
    </form>`;
}

function applyFormPreset(presetName) {
    const formType = document.getElementById('form-type');
    const formStyle = document.getElementById('form-style');
    const validation = document.getElementById('form-validation');
    
    switch(presetName) {
        case 'contact':
            if (formType) formType.value = 'contact';
            if (formStyle) formStyle.value = 'default';
            if (validation) validation.value = 'none';
            break;
        case 'login':
            if (formType) formType.value = 'login';
            if (formStyle) formStyle.value = 'floating';
            if (validation) validation.value = 'valid';
            break;
        case 'survey':
            if (formType) formType.value = 'feedback';
            if (formStyle) formStyle.value = 'horizontal';
            if (validation) validation.value = 'both';
            break;
    }
    
    updateFormDemo();
    showToast(`Applied ${presetName} form preset`, 'success');
}

function handleFormSubmit(event) {
    event.preventDefault();
    showToast('Form submitted successfully! (Demo only)', 'success');
    return false;
}