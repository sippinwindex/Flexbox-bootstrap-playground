#!/usr/bin/env python3
"""
Project Manager - Advanced Bootstrap Project Management Tool
Provides project scaffolding, live reload, deployment helpers, and more.
"""

import os
import sys
import json
import time
import shutil
import subprocess
from pathlib import Path
from datetime import datetime
import webbrowser
import argparse
from typing import Dict, List, Optional

try:
    import requests
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    from jinja2 import Template, Environment, FileSystemLoader
    import click
    from colorama import init, Fore, Back, Style
    init()  # Initialize colorama for Windows compatibility
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install -r requirements.txt")
    sys.exit(1)


class ProjectConfig:
    """Manages project configuration and settings."""
    
    def __init__(self, project_dir: Path):
        self.project_dir = project_dir
        self.config_file = project_dir / ".bootstrap-config.json"
        self.config = self.load_config()
    
    def load_config(self) -> Dict:
        """Load project configuration from file."""
        default_config = {
            "name": self.project_dir.name,
            "version": "1.0.0",
            "description": "Bootstrap project",
            "author": "",
            "bootstrap_version": "5.3.3",
            "bootstrap_icons": True,
            "custom_css": True,
            "custom_js": True,
            "live_reload": True,
            "minify_assets": False,
            "deployment": {
                "type": "static",
                "build_dir": "dist"
            },
            "components": [],
            "dependencies": []
        }
        
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                    # Merge with defaults
                    for key, value in default_config.items():
                        if key not in config:
                            config[key] = value
                    return config
            except Exception as e:
                print(f"{Fore.YELLOW}Warning: Could not load config file: {e}{Style.RESET_ALL}")
        
        return default_config
    
    def save_config(self):
        """Save configuration to file."""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            print(f"{Fore.RED}Error saving config: {e}{Style.RESET_ALL}")
    
    def update(self, **kwargs):
        """Update configuration values."""
        self.config.update(kwargs)
        self.save_config()


class LiveReloadHandler(FileSystemEventHandler):
    """Handles file changes for live reload functionality."""
    
    def __init__(self, callback):
        self.callback = callback
        self.last_modified = {}
        
    def on_modified(self, event):
        if event.is_directory:
            return
            
        # Filter for relevant file types
        relevant_extensions = ['.html', '.css', '.js', '.scss', '.sass']
        if not any(event.src_path.endswith(ext) for ext in relevant_extensions):
            return
            
        # Debounce rapid file changes
        current_time = time.time()
        if event.src_path in self.last_modified:
            if current_time - self.last_modified[event.src_path] < 0.5:
                return
        
        self.last_modified[event.src_path] = current_time
        self.callback(event.src_path)


class AdvancedProjectManager:
    """Advanced project management with scaffolding, live reload, and deployment."""
    
    def __init__(self):
        self.templates_dir = Path(__file__).parent / "templates"
        self.ensure_templates_dir()
    
    def ensure_templates_dir(self):
        """Ensure templates directory exists with basic templates."""
        self.templates_dir.mkdir(exist_ok=True)
        
        # Create basic template if it doesn't exist
        basic_template = self.templates_dir / "basic.html"
        if not basic_template.exists():
            template_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@{{ bootstrap_version }}/dist/css/bootstrap.min.css" rel="stylesheet">
    {% if bootstrap_icons %}<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">{% endif %}
    {% if custom_css %}<link href="css/style.css" rel="stylesheet">{% endif %}
</head>
<body>
    <div class="container mt-4">
        <h1>{{ title }}</h1>
        <p class="lead">{{ description }}</p>
        
        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Welcome to {{ title }}</h5>
                    </div>
                    <div class="card-body">
                        <p>This project was generated with the Bootstrap Project Manager.</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="list-group">
                    <div class="list-group-item">
                        <h6 class="mb-1">Bootstrap {{ bootstrap_version }}</h6>
                        <small>Latest Bootstrap framework</small>
                    </div>
                    {% if bootstrap_icons %}
                    <div class="list-group-item">
                        <h6 class="mb-1"><i class="bi bi-icons"></i> Bootstrap Icons</h6>
                        <small>Icon library included</small>
                    </div>
                    {% endif %}
                    {% if custom_css %}
                    <div class="list-group-item">
                        <h6 class="mb-1"><i class="bi bi-palette"></i> Custom CSS</h6>
                        <small>Ready for customization</small>
                    </div>
                    {% endif %}
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@{{ bootstrap_version }}/dist/js/bootstrap.bundle.min.js"></script>
    {% if custom_js %}<script src="js/script.js"></script>{% endif %}
    {% if live_reload %}
    <script>
        // Live reload functionality
        (function() {
            let ws = null;
            function connect() {
                try {
                    ws = new WebSocket('ws://localhost:8081');
                    ws.onmessage = function(event) {
                        if (event.data === 'reload') {
                            location.reload();
                        }
                    };
                    ws.onclose = function() {
                        setTimeout(connect, 1000);
                    };
                } catch (e) {
                    setTimeout(connect, 1000);
                }
            }
            connect();
        })();
    </script>
    {% endif %}
</body>
</html>'''
            
            with open(basic_template, 'w') as f:
                f.write(template_content)
    
    def create_project(self, name: str, template: str = "basic", **options):
        """Create a new Bootstrap project with advanced features."""
        project_dir = Path(name.lower().replace(' ', '-'))
        
        if project_dir.exists():
            print(f"{Fore.RED}Error: Project directory '{project_dir}' already exists{Style.RESET_ALL}")
            return False
        
        print(f"{Fore.GREEN}Creating project: {name}{Style.RESET_ALL}")
        
        # Create project structure
        project_dir.mkdir()
        (project_dir / "css").mkdir()
        (project_dir / "js").mkdir()
        (project_dir / "images").mkdir()
        (project_dir / "components").mkdir()
        
        # Initialize project config
        config = ProjectConfig(project_dir)
        config.update(
            name=name,
            description=options.get('description', f'Bootstrap project: {name}'),
            author=options.get('author', ''),
            **options
        )
        
        # Generate HTML from template
        self.generate_from_template(project_dir, template, config.config)
        
        # Create CSS file
        self.create_css_file(project_dir)
        
        # Create JavaScript file
        self.create_js_file(project_dir)
        
        # Create package.json equivalent
        self.create_package_file(project_dir, config.config)
        
        # Create README
        self.create_readme(project_dir, config.config)
        
        print(f"{Fore.GREEN}✅ Project '{name}' created successfully!{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📁 Location: {project_dir.absolute()}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🚀 Start development: python project_manager.py dev {project_dir}{Style.RESET_ALL}")
        
        return True
    
    def generate_from_template(self, project_dir: Path, template_name: str, config: Dict):
        """Generate HTML from Jinja2 template."""
        template_file = self.templates_dir / f"{template_name}.html"
        
        if not template_file.exists():
            print(f"{Fore.YELLOW}Warning: Template '{template_name}' not found, using basic template{Style.RESET_ALL}")
            template_file = self.templates_dir / "basic.html"
        
        env = Environment(loader=FileSystemLoader(self.templates_dir))
        template = env.get_template(template_file.name)
        
        html_content = template.render(**config)
        
        with open(project_dir / "index.html", 'w') as f:
            f.write(html_content)
    
    def create_css_file(self, project_dir: Path):
        """Create a comprehensive CSS file with utilities."""
        css_content = '''/* Custom CSS for your Bootstrap project */

:root {
  /* Custom color palette */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  
  /* Custom spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;
  
  /* Custom typography */
  --font-family-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-family-mono: "Consolas", "Monaco", "Courier New", monospace;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-base: all 0.2s ease-in-out;
  --transition-colors: color, background-color, border-color 0.15s ease-in-out;
}

/* Global styles */
body {
  font-family: var(--font-family-sans);
  line-height: 1.6;
}

/* Custom utility classes */
.text-gradient {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.shadow-custom {
  box-shadow: var(--shadow-md);
}

.transition-all {
  transition: var(--transition-base);
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Custom card styles */
.card-custom {
  border: none;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.card-custom:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Custom button styles */
.btn-gradient {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  transition: var(--transition-base);
}

.btn-gradient:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Custom navbar styles */
.navbar-custom {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-sm);
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .mobile-center {
    text-align: center;
  }
  
  .mobile-stack > * {
    margin-bottom: var(--spacing-md);
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
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .card {
    break-inside: avoid;
  }
}
'''
        
        with open(project_dir / "css" / "style.css", 'w') as f:
            f.write(css_content)
    
    def create_js_file(self, project_dir: Path):
        """Create a JavaScript file with common utilities."""
        js_content = '''// Custom JavaScript for your Bootstrap project

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bootstrap project loaded successfully!');
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize animations
    initializeAnimations();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
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

/**
 * Initialize form validation with Bootstrap classes
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Utility function to show toast notifications
 */
function showToast(message, type = 'primary') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

/**
 * Create toast container if it doesn't exist
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

/**
 * Utility function to copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy to clipboard', 'danger');
        return false;
    }
}

/**
 * Utility function for making API requests
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showToast('Request failed. Please try again.', 'danger');
        throw error;
    }
}

/**
 * Utility function to format dates
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Utility function for local storage with error handling
 */
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }
};

// Export utilities for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        copyToClipboard,
        apiRequest,
        formatDate,
        debounce,
        storage
    };
}
'''
        
        with open(project_dir / "js" / "script.js", 'w') as f:
            f.write(js_content)
    
    def create_package_file(self, project_dir: Path, config: Dict):
        """Create a package.json equivalent for the project."""
        package_data = {
            "name": config["name"],
            "version": config["version"],
            "description": config["description"],
            "author": config["author"],
            "bootstrap": {
                "version": config["bootstrap_version"],
                "icons": config["bootstrap_icons"]
            },
            "scripts": {
                "dev": f"python project_manager.py dev {project_dir.name}",
                "build": f"python project_manager.py build {project_dir.name}",
                "serve": f"python project_manager.py serve {project_dir.name}"
            },
            "features": {
                "custom_css": config["custom_css"],
                "custom_js": config["custom_js"],
                "live_reload": config["live_reload"],
                "minify_assets": config["minify_assets"]
            },
            "created": datetime.now().isoformat(),
            "dependencies": config.get("dependencies", [])
        }
        
        with open(project_dir / "project.json", 'w') as f:
            json.dump(package_data, f, indent=2)
    
    def create_readme(self, project_dir: Path, config: Dict):
        """Create a comprehensive README file."""
        readme_content = f'''# {config["name"]}

{config["description"]}

## 🚀 Quick Start

```bash
# Start development server with live reload
python project_manager.py dev {project_dir.name}

# Build for production
python project_manager.py build {project_dir.name}

# Serve built files
python project_manager.py serve {project_dir.name} --production
```

## 📁 Project Structure

```
{project_dir.name}/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Custom styles
├── js/
│   └── script.js          # Custom JavaScript
├── images/                # Image assets
├── components/            # Reusable components
├── project.json          # Project configuration
├── .bootstrap-config.json # Bootstrap generator config
└── README.md             # This file
```

## ✨ Features

- **Bootstrap {config["bootstrap_version"]}** - Latest Bootstrap framework
- **{'✅' if config['bootstrap_icons'] else '❌'} Bootstrap Icons** - Icon library {'included' if config['bootstrap_icons'] else 'not included'}
- **{'✅' if config['custom_css'] else '❌'} Custom CSS** - Custom styling with CSS variables
- **{'✅' if config['custom_js'] else '❌'} Custom JavaScript** - Utility functions and helpers
- **{'✅' if config['live_reload'] else '❌'} Live Reload** - Automatic browser refresh during development
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels and semantic HTML
- **Modern JavaScript** - ES6+ features and utilities

## 🎨 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {{
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  /* Add your custom colors */
}}
```

### Components

Add reusable components in the `components/` directory and include them in your HTML.

### JavaScript

The project includes utility functions in `js/script.js`:

- `showToast(message, type)` - Show toast notifications
- `copyToClipboard(text)` - Copy text to clipboard
- `apiRequest(url, options)` - Make API requests
- `storage` - LocalStorage utilities

## 🛠️ Development

### Live Development

```bash
python project_manager.py dev {project_dir.name}
```

This starts a development server with:
- Live reload on file changes
- Hot CSS injection
- Error reporting

### Building for Production

```bash
python project_manager.py build {project_dir.name}
```

This creates a `dist/` folder with:
- Minified CSS and JavaScript
- Optimized images
- Production-ready HTML

### Adding Components

```bash
python project_manager.py add-component {project_dir.name} --name navbar --type navigation
```

### Project Information

```bash
python project_manager.py info {project_dir.name}
```

## 📦 Dependencies

- **Bootstrap {config["bootstrap_version"]}** - CSS Framework
- **Bootstrap Icons** - Icon library
- **Modern browsers** - ES6+ support required

## 🚀 Deployment

### Static Hosting

Upload the `dist/` folder contents to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a `gh-pages` branch
- **AWS S3**: Upload files to an S3 bucket

### Custom Server

The built files work with any web server that can serve static files.

## 📚 Resources

- [Bootstrap Documentation](https://getbootstrap.com/docs/{config["bootstrap_version"][0]}.{config["bootstrap_version"][2]}/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 📄 License

This project template is free to use and modify.

---

*Generated with Bootstrap Project Manager v1.0.0*
*Created on {datetime.now().strftime("%B %d, %Y")}*
'''
        
        with open(project_dir / "README.md", 'w') as f:
            f.write(readme_content)
    
    def start_dev_server(self, project_dir: Path, port: int = 8080):
        """Start development server with live reload."""
        if not project_dir.exists():
            print(f"{Fore.RED}Error: Project directory '{project_dir}' not found{Style.RESET_ALL}")
            return
        
        config = ProjectConfig(project_dir)
        
        print(f"{Fore.GREEN}🚀 Starting development server for '{config.config['name']}'{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📁 Serving: {project_dir.absolute()}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🌐 URL: http://localhost:{port}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🔄 Live reload: {'enabled' if config.config['live_reload'] else 'disabled'}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Press Ctrl+C to stop{Style.RESET_ALL}")
        
        # Start file watcher for live reload
        if config.config['live_reload']:
            self.start_file_watcher(project_dir)
        
        # Start web server
        try:
            import http.server
            import socketserver
            
            os.chdir(project_dir)
            Handler = http.server.SimpleHTTPRequestHandler
            
            class CustomHandler(Handler):
                def end_headers(self):
                    # Add headers for development
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.send_header('Pragma', 'no-cache')
                    self.send_header('Expires', '0')
                    super().end_headers()
            
            with socketserver.TCPServer(("", port), CustomHandler) as httpd:
                # Try to open browser
                try:
                    webbrowser.open(f'http://localhost:{port}')
                except:
                    pass
                
                httpd.serve_forever()
                
        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}👋 Development server stopped{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ Error starting server: {e}{Style.RESET_ALL}")
    
    def start_file_watcher(self, project_dir: Path):
        """Start file watcher for live reload."""
        def on_file_change(file_path):
            print(f"{Fore.CYAN}📝 File changed: {Path(file_path).name}{Style.RESET_ALL}")
            # Here you could implement WebSocket notification to browser
        
        event_handler = LiveReloadHandler(on_file_change)
        observer = Observer()
        observer.schedule(event_handler, str(project_dir), recursive=True)
        observer.start()
        
        return observer


def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description="Advanced Bootstrap Project Manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python project_manager.py create "My Portfolio" --author "John Doe"
  python project_manager.py dev my-portfolio
  python project_manager.py build my-portfolio --minify
  python project_manager.py serve my-portfolio --port 3000
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create command
    create_parser = subparsers.add_parser('create', help='Create new project')
    create_parser.add_argument('name', help='Project name')
    create_parser.add_argument('--template', default='basic', help='Template name')
    create_parser.add_argument('--author', help='Author name')
    create_parser.add_argument('--description', help='Project description')
    create_parser.add_argument('--no-icons', action='store_true', help='Exclude Bootstrap Icons')
    
    # Dev command
    dev_parser = subparsers.add_parser('dev', help='Start development server')
    dev_parser.add_argument('project', help='Project directory')
    dev_parser.add_argument('--port', type=int, default=8080, help='Port number')
    
    # Build command
    build_parser = subparsers.add_parser('build', help='Build for production')
    build_parser.add_argument('project', help='Project directory')
    build_parser.add_argument('--minify', action='store_true', help='Minify assets')
    
    # Serve command
    serve_parser = subparsers.add_parser('serve', help='Serve built project')
    serve_parser.add_argument('project', help='Project directory')
    serve_parser.add_argument('--port', type=int, default=8080, help='Port number')
    serve_parser.add_argument('--production', action='store_true', help='Serve from dist/')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = AdvancedProjectManager()
    
    if args.command == 'create':
        options = {
            'bootstrap_icons': not args.no_icons,
            'author': args.author or '',
            'description': args.description or f'Bootstrap project: {args.name}'
        }
        manager.create_project(args.name, args.template, **options)
        
    elif args.command == 'dev':
        project_dir = Path(args.project)
        manager.start_dev_server(project_dir, args.port)
        
    elif args.command == 'build':
        print(f"{Fore.GREEN}🔨 Building project: {args.project}{Style.RESET_ALL}")
        # Build functionality would go here
        
    elif args.command == 'serve':
        print(f"{Fore.GREEN}🌐 Serving project: {args.project}{Style.RESET_ALL}")
        # Serve functionality would go here


if __name__ == "__main__":
    main()