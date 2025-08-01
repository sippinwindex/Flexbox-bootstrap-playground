#!/usr/bin/env python3
"""
Bootstrap Generator Serverless Endpoint
Exposes Bootstrap template generation as a Vercel serverless function.
"""

import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

class BootstrapGenerator:
    """Main class for Bootstrap template generation."""

    def __init__(self):
        self.version = "1.0.0"
        self.bootstrap_version = "5.3.3"
        
        # Bootstrap CDN links
        self.bootstrap_css = f"https://cdn.jsdelivr.net/npm/bootstrap@{self.bootstrap_version}/dist/css/bootstrap.min.css"
        self.bootstrap_js = f"https://cdn.jsdelivr.net/npm/bootstrap@{self.bootstrap_version}/dist/js/bootstrap.bundle.min.js"
        self.bootstrap_icons = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        
    def create_base_template(self, title="Bootstrap Page", include_navbar=True, include_footer=True):
        """Create a base HTML template with Bootstrap."""
        
        navbar_html = '''
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="bi bi-bootstrap me-2"></i>My Site</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#"><i class="bi bi-house me-1"></i>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="bi bi-info-circle me-1"></i>About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="bi bi-envelope me-1"></i>Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
''' if include_navbar else ''
        
        footer_html = '''
    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-bootstrap me-2"></i>My Website</h5>
                    <p class="mb-0">Built with Bootstrap and modern web technologies.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">&copy; ''' + str(datetime.now().year) + ''' All rights reserved.</p>
                    <div class="social-links mt-2">
                        <a href="#" class="text-white me-3"><i class="bi bi-github"></i></a>
                        <a href="#" class="text-white me-3"><i class="bi bi-linkedin"></i></a>
                        <a href="#" class="text-white"><i class="bi bi-twitter"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
''' if include_footer else ''
        
        template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    
    <!-- Bootstrap CSS -->
    <link href="{self.bootstrap_css}" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="{self.bootstrap_icons}" rel="stylesheet">
    
    <!-- Custom CSS -->
    <style>
        body {{
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }}
        
        main {{
            flex: 1;
        }}
        
        .hero-section {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 0;
        }}
        
        .feature-card {{
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
        }}
        
        .feature-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }}
        
        .section-padding {{
            padding: 4rem 0;
        }}
    </style>
</head>
<body>{navbar_html}

    <!-- Main Content -->
    <main>
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold mb-3">Welcome to {title}</h1>
                        <p class="lead mb-4">This is a Bootstrap template generated with Python tools. Customize it to match your project needs.</p>
                        <div class="d-flex gap-3">
                            <a href="#features" class="btn btn-light btn-lg">
                                <i class="bi bi-arrow-down me-2"></i>Learn More
                            </a>
                            <a href="#contact" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-envelope me-2"></i>Get Started
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center">
                        <i class="bi bi-laptop display-1 opacity-75"></i>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="section-padding bg-light">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-lg-8 mx-auto">
                        <h2 class="display-6 fw-bold">Key Features</h2>
                        <p class="lead text-muted">Everything you need to build modern, responsive websites.</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="card feature-card border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-phone text-primary fs-4"></i>
                                </div>
                                <h5 class="card-title">Responsive Design</h5>
                                <p class="card-text text-muted">Built with Bootstrap's responsive grid system for all devices.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card feature-card border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-speedometer2 text-success fs-4"></i>
                                </div>
                                <h5 class="card-title">Fast Loading</h5>
                                <p class="card-text text-muted">Optimized for performance with modern web standards.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card feature-card border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-palette text-info fs-4"></i>
                                </div>
                                <h5 class="card-title">Customizable</h5>
                                <p class="card-text text-muted">Easy to customize with CSS variables and Bootstrap utilities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Content Section -->
        <section class="section-padding">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h2 class="display-6 fw-bold mb-4">Ready to Customize</h2>
                        <p class="lead mb-4">This template includes everything you need to get started quickly:</p>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Bootstrap 5.3.3 integration</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Responsive navigation with hamburger menu</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Modern gradient hero section</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Card-based feature showcase</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Professional footer with social links</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Bootstrap Icons integration</li>
                        </ul>
                    </div>
                    <div class="col-lg-6">
                        <div class="bg-light p-4 rounded">
                            <h5><i class="bi bi-code-slash me-2"></i>Quick Start</h5>
                            <pre class="bg-dark text-light p-3 rounded"><code># Generate a new template
curl -X POST -H "Content-Type: application/json" -d '{{"name":"My Project"}}' /api/bootstrap_generator
# Download generated files separately
</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>{footer_html}

    <!-- Bootstrap JavaScript -->
    <script src="{self.bootstrap_js}"></script>
    
    <!-- Custom JavaScript -->
    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{
                        behavior: 'smooth'
                    }});
                }}
            }});
        }});
        
        // Navbar scroll effect
        window.addEventListener('scroll', function() {{
            const navbar = document.querySelector('.navbar');
            if (navbar) {{
                if (window.scrollY > 50) {{
                    navbar.classList.add('navbar-scrolled');
                }} else {{
                    navbar.classList.remove('navbar-scrolled');
                }}
            }}
        }});
        
        console.log('Bootstrap template loaded successfully!');
    </script>
</body>
</html>'''
        
        return template
    
    def create_component_library(self):
        """Generate a comprehensive component library."""
        
        components = {
            "cards": '''
<!-- Card Examples -->
<div class="row g-4 mb-5">
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <img src="https://via.placeholder.com/400x200" class="card-img-top" alt="Placeholder">
            <div class="card-body">
                <h5 class="card-title">Image Card</h5>
                <p class="card-text">Card with image, title, text, and button.</p>
                <a href="#" class="btn btn-primary">Learn More</a>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <div class="card-header bg-success text-white">
                <i class="bi bi-star me-2"></i>Featured
            </div>
            <div class="card-body">
                <h5 class="card-title">Header Card</h5>
                <p class="card-text">Card with header and footer sections.</p>
            </div>
            <div class="card-footer text-muted">
                Last updated 3 mins ago
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-primary">
            <div class="card-body text-center">
                <i class="bi bi-heart display-4 text-danger mb-3"></i>
                <h5 class="card-title">Icon Card</h5>
                <p class="card-text">Card with centered icon and content.</p>
                <a href="#" class="btn btn-outline-primary">Action</a>
            </div>
        </div>
    </div>
</div>
            ''',
            
            "alerts": '''
<!-- Alert Examples -->
<div class="row g-3 mb-5">
    <div class="col-12">
        <div class="alert alert-primary d-flex align-items-center" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            <div>A simple primary alert with an icon—check it out!</div>
        </div>
    </div>
    <div class="col-12">
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            <strong>Well done!</strong> You successfully read this important alert message.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </div>
    <div class="col-12">
        <div class="alert alert-warning d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <div>
                <h4 class="alert-heading">Warning!</h4>
                This is a warning alert with additional content and a <a href="#" class="alert-link">link</a>.
            </div>
        </div>
    </div>
</div>
            ''',
            
            "buttons": '''
<!-- Button Examples -->
<div class="mb-5">
    <h3>Button Styles</h3>
    <div class="mb-3">
        <button type="button" class="btn btn-primary me-2">Primary</button>
        <button type="button" class="btn btn-secondary me-2">Secondary</button>
        <button type="button" class="btn btn-success me-2">Success</button>
        <button type="button" class="btn btn-danger me-2">Danger</button>
        <button type="button" class="btn btn-warning me-2">Warning</button>
        <button type="button" class="btn btn-info me-2">Info</button>
    </div>
    
    <h4>Outline Buttons</h4>
    <div class="mb-3">
        <button type="button" class="btn btn-outline-primary me-2">Primary</button>
        <button type="button" class="btn btn-outline-secondary me-2">Secondary</button>
        <button type="button" class="btn btn-outline-success me-2">Success</button>
    </div>
    
    <h4>Button Sizes</h4>
    <div class="mb-3">
        <button type="button" class="btn btn-primary btn-lg me-2">Large</button>
        <button type="button" class="btn btn-primary me-2">Default</button>
        <button type="button" class="btn btn-primary btn-sm">Small</button>
    </div>
    
    <h4>Icon Buttons</h4>
    <div class="mb-3">
        <button type="button" class="btn btn-success me-2">
            <i class="bi bi-download me-1"></i>Download
        </button>
        <button type="button" class="btn btn-info me-2">
            <i class="bi bi-share me-1"></i>Share
        </button>
        <button type="button" class="btn btn-warning">
            <i class="bi bi-star me-1"></i>Favorite
        </button>
    </div>
</div>
            ''',
            
            "forms": '''
<!-- Form Examples -->
<div class="row g-4 mb-5">
    <div class="col-md-6">
        <h3>Contact Form</h3>
        <form>
            <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="subject" class="form-label">Subject</label>
                <select class="form-select" id="subject">
                    <option selected>Choose...</option>
                    <option value="1">General Inquiry</option>
                    <option value="2">Support</option>
                    <option value="3">Feedback</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" id="message" rows="4"></textarea>
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="newsletter">
                <label class="form-check-label" for="newsletter">
                    Subscribe to newsletter
                </label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-send me-1"></i>Send Message
            </button>
        </form>
    </div>
    
    <div class="col-md-6">
        <h3>Input Groups</h3>
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
                <span class="input-group-text">@</span>
                <input type="text" class="form-control" id="username" placeholder="Username">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="website" class="form-label">Website</label>
            <div class="input-group">
                <span class="input-group-text">https://</span>
                <input type="text" class="form-control" id="website" placeholder="example.com">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <div class="input-group">
                <span class="input-group-text">$</span>
                <input type="number" class="form-control" id="price" placeholder="0.00">
                <span class="input-group-text">.00</span>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="search" class="form-label">Search</label>
            <div class="input-group">
                <input type="text" class="form-control" id="search" placeholder="Search...">
                <button class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
    </div>
</div>
            '''
        }
        
        return components
    
    def generate_project_files(self, name, template_type="basic"):
        """Generate project files and return as dictionary."""
        
        # Create main HTML file
        if template_type == "component-library":
            html_content = self.create_base_template(name)
            components = self.create_component_library()
            
            # Insert components into template
            component_html = f"""
        <!-- Component Library -->
        <section class="section-padding">
            <div class="container">
                <h2 class="display-6 fw-bold text-center mb-5">Component Library</h2>
                
                <h3>Cards</h3>
                {components['cards']}
                
                <h3>Alerts</h3>
                {components['alerts']}
                
                <h3>Buttons</h3>
                {components['buttons']}
                
                <h3>Forms</h3>
                {components['forms']}
            </div>
        </section>
            """
            
            # Insert before the closing main tag
            html_content = html_content.replace('    </main>', f'        {component_html}\n    </main>')
            
        else:
            html_content = self.create_base_template(name)
        
        # Create custom CSS file
        css_content = """/* Custom CSS for your project */

/* Custom color variables */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
}

/* Custom animations */
.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Navbar scroll effect */
.navbar-scrolled {
    background-color: rgba(52, 58, 64, 0.95) !important;
    backdrop-filter: blur(10px);
}

/* Custom button styles */
.btn-gradient {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: none;
    color: white;
}

.btn-gradient:hover {
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
    color: white;
}

/* Utility classes */
.text-gradient {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-padding {
    padding: 4rem 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .display-4 {
        font-size: 2.5rem;
    }
    
    .section-padding {
        padding: 2rem 0;
    }
}
"""
        
        # Create custom JavaScript file
        js_content = """// Custom JavaScript for your project

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Project loaded successfully!');
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Initialize form validation
    initializeFormValidation();
});

// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and feature elements
    document.querySelectorAll('.card, .feature-card, .alert').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Show success message
                showNotification('Form submitted successfully!', 'success');
            }
            
            form.classList.add('was-validated');
        });
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
    }).catch(function(err) {
        showNotification('Failed to copy to clipboard', 'danger');
    });
}
"""
        
        # Create README file
        readme_content = f"""# {name}

A Bootstrap 5 project generated with Python tools.

## Project Structure

```
{name.lower().replace(' ', '-')}/
├── index.html          # Main HTML file
├── css/
│   └── custom.css      # Custom styles
├── js/
│   └── custom.js       # Custom JavaScript
├── images/             # Image assets
└── README.md           # This file
```

## Features

- **Bootstrap 5.3.3** - Latest version with all components
- **Responsive Design** - Mobile-first approach
- **Modern Components** - Cards, alerts, forms, navigation
- **Custom Animations** - Fade-in effects and hover animations
- **Icon Support** - Bootstrap Icons included
- **Form Validation** - Client-side validation with feedback
- **Accessibility** - ARIA labels and semantic HTML

## Getting Started

1. Open `index.html` in your web browser
2. Customize the content in the HTML file
3. Modify styles in `css/custom.css`
4. Add functionality in `js/custom.js`

## Development

To generate this project via API:

```bash
curl -X POST -H "Content-Type: application/json" -d '{{"name":"My Project"}}' /api/bootstrap_generator
```

## Customization

### Colors

Edit the CSS variables in `css/custom.css`:

```css
:root {{
    --primary-color: #your-color;
    --secondary-color: #your-color;
}}
```

### Components

Add Bootstrap components by copying from the official documentation:
https://getbootstrap.com/docs/5.3/components/

### JavaScript

Add custom functionality in `js/custom.js`. The file includes:
- Animation initialization
- Form validation
- Smooth scrolling
- Notification system

## Resources

- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## License

This project template is free to use and modify.
"""
        
        return {
            'index.html': html_content,
            'css/custom.css': css_content,
            'js/custom.js': js_content,
            'README.md': readme_content
        }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for Bootstrap project generation."""
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            try:
                data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                data = {}
            
            name = data.get('name', 'My Project')
            template_type = data.get('type', 'basic')
            
            # Generate project
            generator = BootstrapGenerator()
            files = generator.generate_project_files(name, template_type)
            
            # Return response
            response_data = {
                'status': 'success',
                'message': f'Project "{name}" generated successfully',
                'project_name': name,
                'template_type': template_type,
                'files': files
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                'status': 'error',
                'message': str(e)
            }
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests - return API info."""
        response_data = {
            'name': 'Bootstrap Generator API',
            'version': '1.0.0',
            'description': 'Generate Bootstrap templates via API',
            'usage': {
                'method': 'POST',
                'content_type': 'application/json',
                'body': {
                    'name': 'Project Name (optional)',
                    'type': 'basic or component-library (optional)'
                }
            },
            'example': {
                'curl': 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"My Project","type":"basic"}\' /api/bootstrap_generator'
            }
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        self.wfile.write(json.dumps(response_data, indent=2).encode('utf-8'))