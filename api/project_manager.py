#!/usr/bin/env python3
"""
Project Manager Serverless Endpoint
Provides project management functionality as a Vercel serverless function.
"""

import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

class ProjectManager:
    """Project management functionality for Bootstrap projects."""
    
    def __init__(self):
        self.version = "1.0.0"
        self.bootstrap_version = "5.3.3"
    
    def create_project_config(self, name: str, **options) -> dict:
        """Create project configuration."""
        return {
            "name": name,
            "version": "1.0.0",
            "description": options.get('description', f'Bootstrap project: {name}'),
            "author": options.get('author', ''),
            "bootstrap_version": self.bootstrap_version,
            "bootstrap_icons": options.get('bootstrap_icons', True),
            "custom_css": options.get('custom_css', True),
            "custom_js": options.get('custom_js', True),
            "live_reload": options.get('live_reload', True),
            "minify_assets": options.get('minify_assets', False),
            "deployment": {
                "type": "static",
                "build_dir": "dist"
            },
            "components": options.get('components', []),
            "dependencies": options.get('dependencies', []),
            "created": datetime.now().isoformat()
        }
    
    def generate_advanced_template(self, config: dict) -> str:
        """Generate an advanced HTML template with dynamic features."""
        
        bootstrap_icons_link = '''
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">''' if config['bootstrap_icons'] else ''
        
        custom_css_link = '''
    <link href="css/style.css" rel="stylesheet">''' if config['custom_css'] else ''
        
        custom_js_script = '''
    <script src="js/script.js"></script>''' if config['custom_js'] else ''
        
        template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{config['description']}">
    <meta name="author" content="{config['author']}">
    <title>{config['name']}</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@{config['bootstrap_version']}/dist/css/bootstrap.min.css" rel="stylesheet">{bootstrap_icons_link}{custom_css_link}
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">
                <i class="bi bi-rocket-takeoff me-2"></i>{config['name']}
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">
                            <i class="bi bi-house me-1"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#features">
                            <i class="bi bi-star me-1"></i>Features
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contact">
                            <i class="bi bi-envelope me-1"></i>Contact
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#aboutModal">
                            <i class="bi bi-info-circle me-1"></i>About
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="bg-gradient-primary text-white py-5">
        <div class="container">
            <div class="row align-items-center min-vh-50">
                <div class="col-lg-6">
                    <h1 class="display-3 fw-bold mb-4 animate-on-scroll">
                        Welcome to {config['name']}
                    </h1>
                    <p class="lead mb-4 animate-on-scroll">
                        {config['description']} Built with Bootstrap {config['bootstrap_version']} and modern web technologies.
                    </p>
                    <div class="d-flex flex-wrap gap-3 animate-on-scroll">
                        <a href="#features" class="btn btn-light btn-lg">
                            <i class="bi bi-arrow-down me-2"></i>Explore Features
                        </a>
                        <a href="#contact" class="btn btn-outline-light btn-lg">
                            <i class="bi bi-envelope me-2"></i>Get Started
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 text-center">
                    <div class="position-relative">
                        <i class="bi bi-laptop display-1 opacity-75 pulse"></i>
                        <div class="position-absolute top-50 start-50 translate-middle">
                            <i class="bi bi-code-slash fs-1 text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-bold animate-on-scroll">Project Features</h2>
                <p class="lead text-muted animate-on-scroll">Everything you need for modern web development</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <div class="card card-custom h-100 text-center animate-on-scroll">
                        <div class="card-body">
                            <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-phone text-primary fs-4"></i>
                            </div>
                            <h5 class="card-title">Responsive</h5>
                            <p class="card-text">Mobile-first responsive design that works on all devices.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="card card-custom h-100 text-center animate-on-scroll">
                        <div class="card-body">
                            <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-speedometer2 text-success fs-4"></i>
                            </div>
                            <h5 class="card-title">Fast</h5>
                            <p class="card-text">Optimized for performance with modern web standards.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="card card-custom h-100 text-center animate-on-scroll">
                        <div class="card-body">
                            <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-palette text-info fs-4"></i>
                            </div>
                            <h5 class="card-title">Customizable</h5>
                            <p class="card-text">Easy to customize with CSS variables and components.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="card card-custom h-100 text-center animate-on-scroll">
                        <div class="card-body">
                            <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-shield-check text-warning fs-4"></i>
                            </div>
                            <h5 class="card-title">Secure</h5>
                            <p class="card-text">Built with security best practices and modern standards.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Technology Stack -->
            <div class="row mt-5">
                <div class="col-12">
                    <div class="card card-custom animate-on-scroll">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="bi bi-stack me-2"></i>Technology Stack</h5>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="col-6 col-md-3 mb-3">
                                    <div class="p-3">
                                        <i class="bi bi-bootstrap display-6 text-primary"></i>
                                        <h6 class="mt-2">Bootstrap {config['bootstrap_version']}</h6>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mb-3">
                                    <div class="p-3">
                                        <i class="bi bi-filetype-html display-6 text-danger"></i>
                                        <h6 class="mt-2">HTML5</h6>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mb-3">
                                    <div class="p-3">
                                        <i class="bi bi-filetype-css display-6 text-info"></i>
                                        <h6 class="mt-2">CSS3</h6>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mb-3">
                                    <div class="p-3">
                                        <i class="bi bi-filetype-js display-6 text-warning"></i>
                                        <h6 class="mt-2">JavaScript ES6+</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="text-center mb-5">
                        <h2 class="display-5 fw-bold animate-on-scroll">Get In Touch</h2>
                        <p class="lead text-muted animate-on-scroll">Ready to start your project? Let's connect!</p>
                    </div>
                    
                    <div class="card card-custom animate-on-scroll">
                        <div class="card-body p-4">
                            <div class="needs-validation" novalidate>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="firstName" required>
                                        <div class="invalid-feedback">
                                            Please provide a valid first name.
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="lastName" required>
                                        <div class="invalid-feedback">
                                            Please provide a valid last name.
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" required>
                                        <div class="invalid-feedback">
                                            Please provide a valid email address.
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="projectType" class="form-label">Project Type</label>
                                        <select class="form-select" id="projectType" required>
                                            <option selected disabled value="">Choose...</option>
                                            <option value="business">Business Website</option>
                                            <option value="portfolio">Portfolio</option>
                                            <option value="ecommerce">E-commerce</option>
                                            <option value="blog">Blog</option>
                                            <option value="landing">Landing Page</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a project type.
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="message" class="form-label">Project Details</label>
                                        <textarea class="form-control" id="message" rows="4" placeholder="Tell us about your project..." required></textarea>
                                        <div class="invalid-feedback">
                                            Please provide project details.
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="newsletter">
                                            <label class="form-check-label" for="newsletter">
                                                Subscribe to project updates and Bootstrap tips
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-center mt-4">
                                    <button class="btn btn-gradient btn-lg" type="button" onclick="handleFormSubmit(this)">
                                        <i class="bi bi-send me-2"></i>Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <h5 class="fw-bold">
                        <i class="bi bi-rocket-takeoff me-2"></i>{config['name']}
                    </h5>
                    <p class="text-light opacity-75">
                        {config['description']}
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-white">
                            <i class="bi bi-github fs-5"></i>
                        </a>
                        <a href="#" class="text-white">
                            <i class="bi bi-linkedin fs-5"></i>
                        </a>
                        <a href="#" class="text-white">
                            <i class="bi bi-twitter fs-5"></i>
                        </a>
                    </div>
                </div>
                
                <div class="col-lg-2 col-md-3 mb-4">
                    <h6 class="fw-bold">Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><a href="#home" class="text-light opacity-75 text-decoration-none">Home</a></li>
                        <li><a href="#features" class="text-light opacity-75 text-decoration-none">Features</a></li>
                        <li><a href="#contact" class="text-light opacity-75 text-decoration-none">Contact</a></li>
                        <li><a href="#" class="text-light opacity-75 text-decoration-none">Documentation</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-3 mb-4">
                    <h6 class="fw-bold">Resources</h6>
                    <ul class="list-unstyled">
                        <li><a href="https://getbootstrap.com/" class="text-light opacity-75 text-decoration-none">Bootstrap</a></li>
                        <li><a href="https://icons.getbootstrap.com/" class="text-light opacity-75 text-decoration-none">Icons</a></li>
                        <li><a href="https://github.com/" class="text-light opacity-75 text-decoration-none">GitHub</a></li>
                        <li><a href="https://vercel.com/" class="text-light opacity-75 text-decoration-none">Vercel</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-4 col-md-6 mb-4">
                    <h6 class="fw-bold">Project Info</h6>
                    <ul class="list-unstyled small">
                        <li><strong>Version:</strong> {config['version']}</li>
                        <li><strong>Bootstrap:</strong> {config['bootstrap_version']}</li>
                        <li><strong>Created:</strong> {datetime.now().strftime("%B %d, %Y")}</li>
                        <li><strong>Author:</strong> {config['author'] or 'Anonymous'}</li>
                    </ul>
                </div>
            </div>
            
            <hr class="my-4 opacity-25">
            
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0 opacity-75">
                        &copy; {datetime.now().year} {config['name']}. All rights reserved.
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <small class="opacity-50">
                        Generated with Bootstrap Project Manager v{self.version}
                    </small>
                </div>
            </div>
        </div>
    </footer>

    <!-- About Modal -->
    <div class="modal fade" id="aboutModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-info-circle me-2"></i>About {config['name']}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6>Project Details</h6>
                            <p>{config['description']}</p>
                            
                            <h6>Features Included</h6>
                            <ul class="list-unstyled">
                                <li><i class="bi bi-check-circle text-success me-2"></i>Bootstrap {config['bootstrap_version']}</li>
                                <li><i class="bi bi-{'check' if config['bootstrap_icons'] else 'x'}-circle text-{'success' if config['bootstrap_icons'] else 'muted'} me-2"></i>Bootstrap Icons</li>
                                <li><i class="bi bi-{'check' if config['custom_css'] else 'x'}-circle text-{'success' if config['custom_css'] else 'muted'} me-2"></i>Custom CSS</li>
                                <li><i class="bi bi-{'check' if config['custom_js'] else 'x'}-circle text-{'success' if config['custom_js'] else 'muted'} me-2"></i>Custom JavaScript</li>
                                <li><i class="bi bi-{'check' if config['live_reload'] else 'x'}-circle text-{'success' if config['live_reload'] else 'muted'} me-2"></i>Live Reload</li>
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <h6>Quick Actions</h6>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="copyProjectConfig()">
                                    <i class="bi bi-clipboard me-1"></i>Copy Config
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="downloadProject()">
                                    <i class="bi bi-download me-1"></i>Download
                                </button>
                                <button class="btn btn-outline-info btn-sm" onclick="shareProject()">
                                    <i class="bi bi-share me-1"></i>Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <a href="https://getbootstrap.com/docs/{config['bootstrap_version'][0]}.{config['bootstrap_version'][2]}/" class="btn btn-primary" target="_blank">
                        <i class="bi bi-book me-1"></i>Bootstrap Docs
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>

    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@{config['bootstrap_version']}/dist/js/bootstrap.bundle.min.js"></script>{custom_js_script}
    
    <!-- Inline JavaScript for modal actions -->
    <script>
        function copyProjectConfig() {{
            const config = {json.dumps(config, indent=2)};
            navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {{
                showToast('Project configuration copied to clipboard!', 'success');
            }}).catch(() => {{
                showToast('Failed to copy configuration', 'danger');
            }});
        }}
        
        function downloadProject() {{
            showToast('Download functionality would be implemented here', 'info');
        }}
        
        function shareProject() {{
            if (navigator.share) {{
                navigator.share({{
                    title: '{config['name']}',
                    text: '{config['description']}',
                    url: window.location.href
                }});
            }} else {{
                navigator.clipboard.writeText(window.location.href).then(() => {{
                    showToast('Project URL copied to clipboard!', 'success');
                }});
            }}
        }}
        
        function handleFormSubmit(button) {{
            const form = button.closest('.needs-validation');
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {{
                if (!input.checkValidity()) {{
                    isValid = false;
                    input.classList.add('is-invalid');
                }} else {{
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }}
            }});
            
            if (isValid) {{
                // Add loading state
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Sending...';
                button.disabled = true;
                
                // Simulate API call
                setTimeout(() => {{
                    showToast('Message sent successfully!', 'success');
                    
                    // Reset form
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                    
                    // Clear validation classes
                    inputs.forEach(input => {{
                        input.classList.remove('is-valid', 'is-invalid');
                    }});
                }}, 2000);
            }} else {{
                showToast('Please check the form for errors', 'warning');
            }}
            
            form.classList.add('was-validated');
        }}
        
        function showToast(message, type = 'primary', duration = 5000) {{
            const toastContainer = document.getElementById('toast-container');
            const toastId = 'toast-' + Date.now();
            const toastElement = document.createElement('div');
            toastElement.id = toastId;
            toastElement.className = `toast align-items-center text-white bg-${{type}} border-0`;
            toastElement.setAttribute('role', 'alert');
            toastElement.setAttribute('data-bs-delay', duration);
            
            const iconMap = {{
                'primary': 'info-circle',
                'success': 'check-circle',
                'danger': 'exclamation-circle',
                'warning': 'exclamation-triangle',
                'info': 'info-circle'
            }};
            
            const icon = iconMap[type] || 'info-circle';
            toastElement.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-${{icon}} me-2"></i>${{message}}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            
            toastContainer.appendChild(toastElement);
            
            const toast = new bootstrap.Toast(toastElement, {{ delay: duration }});
            toast.show();
            
            // Remove toast element after it's hidden
            toastElement.addEventListener('hidden.bs.toast', function() {{
                toastElement.remove();
            }});
        }}
    </script>
</body>
</html>'''
        
        return template
    
    def generate_advanced_css(self) -> str:
        """Generate advanced CSS with utilities and animations."""
        return '''/* Advanced CSS for Bootstrap Project Manager */

:root {
  /* Extended color palette */
  --primary-color: #667eea;
  --primary-dark: #5a6fd8;
  --secondary-color: #764ba2;
  --secondary-dark: #6a4190;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  
  /* Gradient definitions */
  --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --gradient-success: linear-gradient(135deg, #28a745, #20c997);
  --gradient-info: linear-gradient(135deg, #17a2b8, #6f42c1);
  --gradient-warning: linear-gradient(135deg, #ffc107, #fd7e14);
  
  /* Spacing system */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;
  --spacing-xxl: 4.5rem;
  
  /* Typography */
  --font-family-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --font-family-mono: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
  
  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Global styles */
body {
  font-family: var(--font-family-sans);
  line-height: 1.6;
  scroll-behavior: smooth;
}

/* Enhanced utility classes */
.bg-gradient-primary {
  background: var(--gradient-primary);
}

.bg-gradient-success {
  background: var(--gradient-success);
}

.bg-gradient-info {
  background: var(--gradient-info);
}

.bg-gradient-warning {
  background: var(--gradient-warning);
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shadow utilities */
.shadow-xs { box-shadow: var(--shadow-xs); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

/* Enhanced card styles */
.card-custom {
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  border-radius: var(--radius-lg);
}

.card-custom:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-custom .card-header {
  background: transparent;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-weight: 600;
}

/* Enhanced button styles */
.btn-gradient {
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-weight: 500;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-gradient:active {
  transform: translateY(0);
}

/* Enhanced navbar */
.navbar-custom {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-md);
}

/* Animation classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.fade-in-left {
  animation: fadeInLeft 0.8s ease-out forwards;
}

.fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
}

.pulse {
  animation: pulse 2s infinite;
}

.float {
  animation: float 3s ease-in-out infinite;
}

.spin {
  animation: spin 1s linear infinite;
}

/* Interactive elements */
.hover-lift {
  transition: transform var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale {
  transition: transform var(--transition-base);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-rotate {
  transition: transform var(--transition-base);
}

.hover-rotate:hover {
  transform: rotate(5deg);
}

/* Form enhancements */
.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Enhanced modals */
.modal-content {
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

.modal-header {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.modal-footer {
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* Responsive utilities */
@media (max-width: 768px) {
  .mobile-center {
    text-align: center;
  }
  
  .mobile-stack > * {
    margin-bottom: var(--spacing-md);
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .hero-section {
    padding: 2rem 0;
  }
}

@media (max-width: 576px) {
  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --bs-body-bg: #1a1a1a;
    --bs-body-color: #ffffff;
  }
  
  .navbar-custom {
    background: rgba(26, 26, 26, 0.95);
  }
  
  .card-custom {
    background: #2d2d2d;
    color: #ffffff;
    border: 1px solid #404040;
  }
  
  .bg-light {
    background-color: #2d2d2d !important;
  }
  
  .text-muted {
    color: #9ca3af !important;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .btn {
    display: none;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* Loading states */
.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 1;
}'''