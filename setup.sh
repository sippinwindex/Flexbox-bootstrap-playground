#!/bin/bash

# CSS Learning Platform - Setup Script
echo "🚀 Setting up CSS Learning Platform for Vercel deployment..."

# Create root requirements.txt
echo "📝 Creating root requirements.txt..."
cat > requirements.txt << 'EOF'
# CSS Learning Platform - Python Dependencies
# Install with: pip install -r requirements.txt

# Core dependencies for the Bootstrap Generator
requests>=2.28.0          # For downloading Bootstrap assets and HTTP requests
jinja2>=3.1.0             # Template engine for advanced templates
python-dateutil>=2.8.0    # Date utilities for template generation

# Optional dependencies for enhanced features
colorama>=0.4.5           # Colored terminal output (cross-platform)
click>=8.1.0              # Enhanced CLI interface

# Development dependencies (optional)
pytest>=7.1.0             # Testing framework
black>=22.6.0             # Code formatting

# Web server enhancements for local development
flask>=2.2.0              # Local development server (if needed)
EOF

echo "✅ Created requirements.txt"

# Create api directory and requirements
echo "📁 Creating api directory..."
mkdir -p api

cat > api/requirements.txt << 'EOF'
# Vercel Serverless Functions - Python Dependencies
# Lightweight dependencies for serverless environment

requests>=2.28.0
jinja2>=3.1.0
python-dateutil>=2.8.0
EOF

echo "✅ Created api/requirements.txt"

# Move files from css-learning-platform directory to root if they exist
if [ -d "css-learning-platform" ]; then
    echo "📂 Moving files from css-learning-platform directory..."
    
    # HTML files
    for file in index.html bootstrap-playground.html flexbox-playground.html css-utilities.html; do
        if [ -f "css-learning-platform/$file" ] && [ ! -f "$file" ]; then
            cp "css-learning-platform/$file" .
            echo "✅ Moved $file to root"
        fi
    done
    
    # CSS file (but don't overwrite existing)
    if [ -f "css-learning-platform/styles.css" ] && [ ! -f "styles.css" ]; then
        cp "css-learning-platform/styles.css" .
        echo "✅ Moved styles.css to root"
    fi
    
    # Python files to api directory
    for file in bootstrap_generator.py project_manager.py; do
        if [ -f "css-learning-platform/$file" ] && [ ! -f "api/$file" ]; then
            cp "css-learning-platform/$file" api/
            echo "✅ Moved $file to api/"
        fi
    done
    
    # JS directory
    if [ -d "css-learning-platform/js" ] && [ ! -d "js" ]; then
        cp -r "css-learning-platform/js" .
        echo "✅ Moved js/ directory to root"
    fi
fi

# Create missing Vercel configuration if it doesn't exist
if [ ! -f "vercel.json" ]; then
    echo "📝 Creating vercel.json..."
    cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/bootstrap_generator.py": {
      "runtime": "python3.12",
      "maxDuration": 30,
      "memory": 1024
    },
    "api/project_manager.py": {
      "runtime": "python3.12", 
      "maxDuration": 60,
      "memory": 2048
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob: https:; connect-src 'self' https:;"
        }
      ]
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
EOF
    echo "✅ Created vercel.json"
fi

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📝 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "css-learning-platform",
  "version": "1.0.0",
  "description": "Interactive CSS Learning Platform with Bootstrap, Flexbox, and utilities",
  "main": "index.html",
  "scripts": {
    "dev": "python -m http.server 8000",
    "build": "echo 'Build process - files ready for deployment'",
    "deploy": "vercel --prod"
  },
  "keywords": ["css", "bootstrap", "flexbox", "education", "interactive", "learning"],
  "author": "CSS Learning Platform",
  "license": "MIT"
}
EOF
    echo "✅ Created package.json"
fi

echo ""
echo "📋 Current directory structure:"
echo "."
find . -maxdepth 2 -not -path '*/.*' -not -path '*/__pycache__*' | sort

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Install Python dependencies:"
echo "   pip install -r requirements.txt"
echo ""
echo "2. Test locally:"
echo "   python -m http.server 8000"
echo "   # Then open http://localhost:8000"
echo ""
echo "3. Deploy to Vercel:"
echo "   npm install -g vercel  # If not installed"
echo "   vercel --prod"
echo ""
echo "4. Your files are now organized for Vercel deployment!"