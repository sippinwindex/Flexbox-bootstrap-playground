"""
Vercel Serverless Function for Bootstrap Template Generation
Educational Bootstrap generator with theme customization
"""

import json
import tempfile
import zipfile
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import datetime


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests for template generation"""
        try:
            # Parse query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            
            # Get parameters with defaults
            template_name = query_params.get('name', ['Bootstrap Template'])[0]
            theme_color = query_params.get('theme', ['primary'])[0]
            include_nav = query_params.get('nav', ['true'])[0].lower() == 'true'
            include_footer = query_params.get('footer', ['true'])[0].lower() == 'true'
            
            # Generate the template
            template_data = self.generate_bootstrap_template(
                template_name, theme_color, include_nav, include_footer
            )
            
            # Return JSON response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
            self.end_headers()
            
            response_data = {
                'success': True,
                'template': template_data,
                'generated_at': datetime.datetime.now().isoformat(),
                'parameters': {
                    'name': template_name,
                    'theme': theme_color,
                    'navigation': include_nav,
                    'footer': include_footer
                }
            }
            
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            self.send_error_response(str(e))

    def do_POST(self):
        """Handle POST requests for theme downloads"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            if content_length > 0:
                data = json.loads(post_data)
            else:
                data = {}
            
            # Get parameters from POST data
            template_name = data.get('name', 'Bootstrap Template')
            theme_color = data.get('theme', 'primary')
            components = data.get('components', ['navbar', 'cards', 'buttons'])
            
            # Generate theme package
            zip_data = self.generate_theme_package(template_name, theme_color, components)
            
            # Send zip file
            self.send_response(200)
            self.send_header('Content-Type', 'application/zip')
            self.send_header('Content-Disposition', f'attachment; filename="{template_name.lower().replace(" ", "-")}-theme.zip"')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(zip_data)))
            self.end_headers()
            self.wfile.write(zip_data)
            
        except Exception as e:
            self.send_error_response(str(e))

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def generate_bootstrap_template(self, name, theme_color, include_nav, include_footer):
        """Generate Bootstrap HTML template"""
        
        # Theme color mappings
        theme_colors = {
            'primary': '#0d6efd',
            'success': '#198754', 
            'info': '#0dcaf0',
            'warning': '#ffc107',
            'danger': '#dc3545',
            'dark': '#212529',
            'purple': '#6f42c1',
            'pink': '#d63384',
            'teal': '#20c997'
        }
        
        primary_color = theme_colors.get(theme_color, theme_colors['primary'])
        
        # Navigation HTML
        nav_html = f'''
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-{theme_color}">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="bi bi-bootstrap me-2"></i>{name}</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#services">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
''' if include_nav else ''

        # Footer HTML
        footer_html = f'''
    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-bootstrap me-2"></i>{name}</h5>
                    <p class="mb-0">Built with Bootstrap 5 and modern web technologies.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">&copy; {datetime.datetime.now().year} All rights reserved.</p>
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

        # Complete template
        template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{name} - Modern Bootstrap template">
    <title>{name}</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <style>
        :root {{
            --theme-color: {primary_color};
            --theme-rgb: {self.hex_to_rgb(primary_color)};
        }}
        
        body {{
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }}
        
        .hero-section {{
            background: linear-gradient(135deg, var(--theme-color), rgba(var(--theme-rgb), 0.8));
            color: white;
            padding: 4rem 0;
            position: relative;
            overflow: hidden;
        }}
        
        .hero-section::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.1;
        }}
        
        .card {{
            transition: all 0.3s ease;
            border: none;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }}
        
        .card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 5px 30px rgba(0,0,0,0.15);
        }}
        
        .btn-theme {{
            background: var(--theme-color);
            border-color: var(--theme-color);
            color: white;
        }}
        
        .btn-theme:hover {{
            background: rgba(var(--theme-rgb), 0.9);
            border-color: rgba(var(--theme-rgb), 0.9);
            color: white;
        }}
        
        .text-theme {{
            color: var(--theme-color) !important;
        }}
        
        .section-padding {{
            padding: 4rem 0;
        }}
        
        @media (max-width: 768px) {{
            .hero-section {{
                padding: 2rem 0;
            }}
            .section-padding {{
                padding: 2rem 0;
            }}
        }}
    </style>
</head>
<body>{nav_html}

    <!-- Hero Section -->
    <section class="hero-section" id="home">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-3">Welcome to {name}</h1>
                    <p class="lead mb-4">This is a modern Bootstrap template created with our educational platform. Customize it to fit your project needs.</p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="#about" class="btn btn-light btn-lg">
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
    <section class="section-padding bg-light" id="about">
        <div class="container">
            <div class="row text-center mb-5">
                <div class="col-lg-8 mx-auto">
                    <h2 class="display-6 fw-bold">Key Features</h2>
                    <p class="lead text-muted">Everything you need to build modern, responsive websites.</p>
                </div>
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body text-center p-4">
                            <div class="bg-{theme_color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-phone text-{theme_color} fs-4"></i>
                            </div>
                            <h5 class="card-title">Responsive Design</h5>
                            <p class="card-text text-muted">Built with Bootstrap's responsive grid system for all devices.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card h-100">
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
                    <div class="card h-100">
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

    <!-- Services Section -->
    <section class="section-padding" id="services">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h2 class="display-6 fw-bold mb-4">Ready to Customize</h2>
                    <p class="lead mb-4">This template includes everything you need to get started quickly:</p>
                    <ul class="list-unstyled">
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Bootstrap 5.3.3 integration</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Responsive navigation with hamburger menu</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Modern gradient hero section</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Card-based feature showcase</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Professional footer with social links</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-{theme_color} me-2"></i>Bootstrap Icons integration</li>
                    </ul>
                    <a href="#contact" class="btn btn-theme btn-lg">
                        <i class="bi bi-rocket me-2"></i>Get Started
                    </a>
                </div>
                <div class="col-lg-6">
                    <div class="bg-light p-4 rounded">
                        <h5 class="text-theme"><i class="bi bi-code-slash me-2"></i>Quick Start</h5>
                        <pre class="bg-dark text-light p-3 rounded"><code># Download template
curl -O template.zip

# Extract files
unzip template.zip

# Open in browser
open index.html</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section-padding bg-light" id="contact">
        <div class="container">
            <div class="row text-center">
                <div class="col-lg-8 mx-auto">
                    <h2 class="display-6 fw-bold mb-4">Get Started Today</h2>
                    <p class="lead mb-4">Ready to build something amazing? This template is perfect for your next project.</p>
                    <div class="d-flex gap-3 justify-content-center flex-wrap">
                        <a href="#" class="btn btn-theme btn-lg">
                            <i class="bi bi-download me-2"></i>Download Template
                        </a>
                        <a href="#" class="btn btn-outline-{theme_color} btn-lg">
                            <i class="bi bi-github me-2"></i>View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>{footer_html}

    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{
                        behavior: 'smooth',
                        block: 'start'
                    }});
                }}
            }});
        }});
        
        // Navbar scroll effect
        window.addEventListener('scroll', function() {{
            const navbar = document.querySelector('.navbar');
            if (navbar && window.scrollY > 50) {{
                navbar.style.background = 'rgba(var(--theme-rgb), 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }} else if (navbar) {{
                navbar.style.background = '';
                navbar.style.backdropFilter = '';
            }}
        }});
        
        console.log('✅ {name} template loaded successfully!');
    </script>
</body>
</html>'''
        
        return template

    def generate_theme_package(self, name, theme_color, components):
        """Generate a downloadable theme package"""
        
        # Create temporary file for zip
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            with zipfile.ZipFile(tmp_file, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                
                # Add main HTML file
                html_content = self.generate_bootstrap_template(name, theme_color, True, True)
                zip_file.writestr('index.html', html_content)
                
                # Add custom CSS file
                css_content = self.generate_custom_css(theme_color)
                zip_file.writestr('css/custom.css', css_content)
                
                # Add JavaScript file
                js_content = self.generate_custom_js()
                zip_file.writestr('js/custom.js', js_content)
                
                # Add README
                readme_content = self.generate_readme(name, theme_color, components)
                zip_file.writestr('README.md', readme_content)
                
                # Add component files based on selection
                if 'navbar' in components:
                    zip_file.writestr('components/navbar.html', self.generate_navbar_component(theme_color))
                
                if 'cards' in components:
                    zip_file.writestr('components/cards.html', self.generate_cards_component(theme_color))
                
                if 'buttons' in components:
                    zip_file.writestr('components/buttons.html', self.generate_buttons_component(theme_color))
            
            tmp_file.seek(0)
            zip_data = tmp_file.read()
            
        return zip_data

    def generate_custom_css(self, theme_color):
        """Generate custom CSS file"""
        theme_colors = {
            'primary': '#0d6efd',
            'success': '#198754',
            'info': '#0dcaf0', 
            'warning': '#ffc107',
            'danger': '#dc3545',
            'dark': '#212529',
            'purple': '#6f42c1',
            'pink': '#d63384',
            'teal': '#20c997'
        }
        
        primary_color = theme_colors.get(theme_color, theme_colors['primary'])
        
        return f'''/* Custom CSS for Bootstrap Theme */

:root {{
    --theme-primary: {primary_color};
    --theme-rgb: {self.hex_to_rgb(primary_color)};
    --theme-light: rgba(var(--theme-rgb), 0.1);
    --theme-dark: rgba(var(--theme-rgb), 0.9);
}}

/* Enhanced button styles */
.btn-theme {{
    background: var(--theme-primary);
    border-color: var(--theme-primary);
    color: white;
    transition: all 0.3s ease;
}}

.btn-theme:hover {{
    background: var(--theme-dark);
    border-color: var(--theme-dark);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(var(--theme-rgb), 0.3);
}}

/* Card enhancements */
.card-theme {{
    border-left: 4px solid var(--theme-primary);
    transition: all 0.3s ease;
}}

.card-theme:hover {{
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}}

/* Utility classes */
.text-theme {{ color: var(--theme-primary) !important; }}
.bg-theme {{ background-color: var(--theme-primary) !important; }}
.border-theme {{ border-color: var(--theme-primary) !important; }}

/* Animation classes */
.fade-in {{
    animation: fadeIn 0.6s ease-out;
}}

@keyframes fadeIn {{
    from {{ opacity: 0; transform: translateY(30px); }}
    to {{ opacity: 1; transform: translateY(0); }}
}}

.hover-lift {{
    transition: transform 0.3s ease;
}}

.hover-lift:hover {{
    transform: translateY(-3px);
}}

/* Responsive enhancements */
@media (max-width: 768px) {{
    .display-4 {{ font-size: 2.5rem; }}
    .section-padding {{ padding: 2rem 0; }}
}}'''

    def generate_custom_js(self):
        """Generate custom JavaScript file"""
        return '''// Custom JavaScript for Bootstrap Theme

document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme loaded successfully!');
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize navbar effects
    initializeNavbarEffects();
});

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
    
    // Observe cards and sections
    document.querySelectorAll('.card, .section-padding').forEach(el => {
        observer.observe(el);
    });
}

function initializeSmoothScrolling() {
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
}

function initializeNavbarEffects() {
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

// Utility functions
function showToast(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}'''

    def generate_readme(self, name, theme_color, components):
        """Generate README file"""
        return f'''# {name}

A modern Bootstrap template generated with CSS Learning Platform.

## Features

- Bootstrap 5.3.3
- Responsive design
- {theme_color.title()} theme
- Modern components: {", ".join(components)}
- Cross-browser compatibility

## Quick Start

1. Open `index.html` in your browser
2. Customize the content in HTML files
3. Modify styles in `css/custom.css`
4. Add functionality in `js/custom.js`

## File Structure

```
{name.lower().replace(" ", "-")}/
├── index.html          # Main page
├── css/
│   └── custom.css      # Custom styles
├── js/
│   └── custom.js       # Custom JavaScript
├── components/         # Reusable components
└── README.md          # This file
```

## Customization

### Colors
Edit CSS variables in `css/custom.css`:
```css
:root {{
    --theme-primary: #your-color;
}}
```

### Components
Individual components are in the `components/` folder for easy reuse.

## Deployment

Upload all files to your web server or use:
- Netlify (drag & drop)
- Vercel (GitHub integration)
- GitHub Pages

## Support

Generated with CSS Learning Platform
Visit: https://css-learning-platform.vercel.app

## License

Free to use and modify for any purpose.
'''

    def generate_navbar_component(self, theme_color):
        """Generate standalone navbar component"""
        return f'''<!-- Navbar Component -->
<nav class="navbar navbar-expand-lg navbar-dark bg-{theme_color}">
    <div class="container">
        <a class="navbar-brand" href="#"><i class="bi bi-bootstrap me-2"></i>Brand</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="#home">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#services">Services</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">Contact</a>
                </li>
            </ul>
        </div>
    </div>
</nav>'''

    def generate_cards_component(self, theme_color):
        """Generate card components"""
        return f'''<!-- Card Components -->
<div class="row g-4">
    <div class="col-md-4">
        <div class="card card-theme h-100">
            <div class="card-body">
                <div class="bg-{theme_color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                    <i class="bi bi-star text-{theme_color}"></i>
                </div>
                <h5 class="card-title">Feature One</h5>
                <p class="card-text">Description of your first feature or service.</p>
                <a href="#" class="btn btn-theme">Learn More</a>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card card-theme h-100">
            <div class="card-body">
                <div class="bg-{theme_color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                    <i class="bi bi-heart text-{theme_color}"></i>
                </div>
                <h5 class="card-title">Feature Two</h5>
                <p class="card-text">Description of your second feature or service.</p>
                <a href="#" class="btn btn-theme">Learn More</a>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card card-theme h-100">
            <div class="card-body">
                <div class="bg-{theme_color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                    <i class="bi bi-rocket text-{theme_color}"></i>
                </div>
                <h5 class="card-title">Feature Three</h5>
                <p class="card-text">Description of your third feature or service.</p>
                <a href="#" class="btn btn-theme">Learn More</a>
            </div>
        </div>
    </div>
</div>'''

    def generate_buttons_component(self, theme_color):
        """Generate button components""" 
        return f'''<!-- Button Components -->
<div class="btn-group-demo">
    <h5>Primary Buttons</h5>
    <div class="mb-3">
        <button type="button" class="btn btn-{theme_color} me-2">Primary</button>
        <button type="button" class="btn btn-outline-{theme_color} me-2">Outline</button>
        <button type="button" class="btn btn-theme me-2">Custom Theme</button>
    </div>
    
    <h5>Button Sizes</h5>
    <div class="mb-3">
        <button type="button" class="btn btn-{theme_color} btn-lg me-2">Large</button>
        <button type="button" class="btn btn-{theme_color} me-2">Default</button>
        <button type="button" class="btn btn-{theme_color} btn-sm me-2">Small</button>
    </div>
    
    <h5>Icon Buttons</h5>
    <div class="mb-3">
        <button type="button" class="btn btn-{theme_color} me-2">
            <i class="bi bi-download me-1"></i>Download
        </button>
        <button type="button" class="btn btn-outline-{theme_color} me-2">
            <i class="bi bi-share me-1"></i>Share
        </button>
        <button type="button" class="btn btn-theme">
            <i class="bi bi-heart me-1"></i>Like
        </button>
    </div>
</div>'''

    def hex_to_rgb(self, hex_color):
        """Convert hex color to RGB values"""
        hex_color = hex_color.lstrip('#')
        return ','.join(str(int(hex_color[i:i+2], 16)) for i in (0, 2, 4))

    def send_error_response(self, error_message):
        """Send error response"""
        self.send_response(500)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            'success': False,
            'error': error_message,
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(error_response, indent=2).encode())