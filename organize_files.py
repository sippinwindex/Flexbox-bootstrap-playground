#!/usr/bin/env python3
"""
File Organization Script for CSS Learning Platform
Moves files to the correct structure for Vercel deployment
"""

import os
import shutil
from pathlib import Path

def organize_files():
    """Organize files for proper Vercel deployment structure"""
    
    print("🔧 Organizing files for deployment...")
    
    # Current directory
    root_dir = Path(".")
    css_platform_dir = root_dir / "css-learning-platform"
    
    # Files that should be in root directory
    root_files = [
        "index.html",
        "bootstrap-playground.html", 
        "flexbox-playground.html",
        "css-utilities.html",
        "styles.css"
    ]
    
    # Python files that should be in api/ directory
    api_files = [
        "bootstrap_generator.py",
        "project_manager.py"
    ]
    
    # Move HTML and CSS files from subdirectory to root
    if css_platform_dir.exists():
        print(f"📁 Found css-learning-platform directory")
        
        for file_name in root_files:
            src_file = css_platform_dir / file_name
            dst_file = root_dir / file_name
            
            if src_file.exists():
                if dst_file.exists():
                    print(f"⚠️  {file_name} already exists in root, skipping...")
                else:
                    shutil.copy2(src_file, dst_file)
                    print(f"✅ Moved {file_name} to root directory")
            else:
                print(f"⚠️  {file_name} not found in css-learning-platform/")
    
    # Create api directory if it doesn't exist
    api_dir = root_dir / "api"
    if not api_dir.exists():
        api_dir.mkdir()
        print("📁 Created api/ directory")
    
    # Move Python files to api directory
    for file_name in api_files:
        # Check both root and subdirectory
        src_locations = [
            root_dir / file_name,
            css_platform_dir / file_name if css_platform_dir.exists() else None
        ]
        
        src_file = None
        for location in src_locations:
            if location and location.exists():
                src_file = location
                break
        
        if src_file:
            dst_file = api_dir / file_name
            if dst_file.exists():
                print(f"⚠️  api/{file_name} already exists, skipping...")
            else:
                shutil.copy2(src_file, dst_file)
                print(f"✅ Moved {file_name} to api/ directory")
        else:
            print(f"⚠️  {file_name} not found in any location")
    
    # Copy requirements.txt to api directory
    if css_platform_dir.exists():
        src_req = css_platform_dir / "requirements.txt"
        dst_req = api_dir / "requirements.txt"
        
        if src_req.exists():
            if dst_req.exists():
                print("⚠️  api/requirements.txt already exists, skipping...")
            else:
                shutil.copy2(src_req, dst_req)
                print("✅ Copied requirements.txt to api/ directory")
    
    # Move js directory if it exists in subdirectory
    if css_platform_dir.exists():
        src_js = css_platform_dir / "js"
        dst_js = root_dir / "js"
        
        if src_js.exists() and src_js.is_dir():
            if dst_js.exists():
                print("⚠️  js/ directory already exists in root, merging...")
                # Copy individual files
                for js_file in src_js.glob("*"):
                    if js_file.is_file():
                        dst_file = dst_js / js_file.name
                        if not dst_file.exists():
                            shutil.copy2(js_file, dst_file)
                            print(f"✅ Copied {js_file.name} to js/ directory")
            else:
                shutil.copytree(src_js, dst_js)
                print("✅ Moved js/ directory to root")
    
    print("\n📋 Current file structure:")
    print_directory_structure()
    
    print("\n✅ File organization complete!")
    print("\n🚀 Next steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Test locally: python -m http.server 8000")
    print("3. Deploy to Vercel: vercel --prod")

def print_directory_structure():
    """Print the current directory structure"""
    
    def print_tree(directory, prefix="", max_depth=3, current_depth=0):
        if current_depth >= max_depth:
            return
            
        directory = Path(directory)
        if not directory.exists():
            return
            
        items = sorted([item for item in directory.iterdir() 
                       if not item.name.startswith('.') and 
                          item.name not in ['__pycache__', 'node_modules', '.git']])
        
        for i, item in enumerate(items):
            is_last = i == len(items) - 1
            current_prefix = "└── " if is_last else "├── "
            print(f"{prefix}{current_prefix}{item.name}")
            
            if item.is_dir() and current_depth < max_depth - 1:
                next_prefix = prefix + ("    " if is_last else "│   ")
                print_tree(item, next_prefix, max_depth, current_depth + 1)
    
    print(".")
    print_tree(".", max_depth=3)

if __name__ == "__main__":
    organize_files()