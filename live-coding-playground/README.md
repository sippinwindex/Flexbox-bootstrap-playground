# 🚀 Enhanced Live Coding Platform

A modern, interactive web development learning platform with real-time code editing, preview, and comprehensive theming system.

## ✨ Features

- **Real-time Code Editing**: HTML, CSS, and JavaScript editors with syntax highlighting
- **Live Preview**: Instant preview of your code changes
- **Advanced Theme System**: Multiple dark/light themes with draggable toggle
- **Code Templates**: Pre-built templates for quick start
- **Export Options**: Download projects or export to CodePen/JSFiddle
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Terminal Integration**: Console output and error logging
- **Auto-save**: Automatic project persistence

## 🏗️ Project Structure

```
live-coding-platform/
├── index.html                 # Main landing page
├── live-coding-playground.html # Coding platform
├── vercel.json                # Vercel deployment config
├── assets/
│   ├── css/
│   │   ├── base.css          # Base styles and variables
│   │   ├── theme.css         # Theme system
│   │   ├── components.css    # UI components
│   │   └── playground.css    # Platform-specific styles
│   ├── js/
│   │   ├── theme-manager.js  # Theme management
│   │   ├── utils.js          # Utility functions
│   │   ├── toast.js          # Notifications
│   │   └── live-coding.js    # Main platform logic
│   └── templates/
│       └── code-templates.js # Code templates
└── README.md
```

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub repository to [Vercel](https://vercel.com)
3. Deploy with one click!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/live-coding-platform)

### Option 2: Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/live-coding-platform.git
cd live-coding-platform
```

2. Serve the files using any static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

## 🎨 Theme System

The platform includes an advanced theme system with:

- **5 Different Themes**: Light, Dark Dracula, Dark Monokai, Material Dark, Nord Dark
- **Draggable Theme Toggle**: Move the theme switcher anywhere on screen
- **Syntax Highlighting**: CodeMirror integration with theme-matching syntax colors
- **Persistent Settings**: Theme preferences saved in localStorage
- **System Integration**: Respects system dark/light mode preferences

## 🛠️ Customization

### Adding New Themes

1. Update `assets/css/theme.css` with new color variables
2. Add theme option to `assets/js/theme-manager.js`
3. Include corresponding CodeMirror theme CSS

### Adding Code Templates

Edit `assets/templates/code-templates.js` to add new templates:

```javascript
const templates = {
  myTemplate: {
    html: '<div>My HTML</div>',
    css: '.my-class { color: blue; }',
    js: 'console.log("Hello World!");'
  }
};
```

### Modifying Styles

- `base.css`: Core variables and typography
- `theme.css`: Theme-specific styles and dark mode
- `components.css`: Reusable UI components
- `playground.css`: Platform-specific layouts

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Development

### File Organization

- **CSS**: Modular stylesheets for maintainability
- **JavaScript**: Separated concerns with utility functions
- **Assets**: Organized by type for easy management

### Performance Features

- Debounced code updates
- Efficient syntax highlighting
- Minimal external dependencies
- Optimized for Vercel edge network

## 📄 License

MIT License - feel free to use this project for learning, teaching, or commercial purposes.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🆘 Support

- 📖 [Documentation](https://github.com/yourusername/live-coding-platform/wiki)
- 🐛 [Bug Reports](https://github.com/yourusername/live-coding-platform/issues)
- 💡 [Feature Requests](https://github.com/yourusername/live-coding-platform/discussions)

## 🎯 Roadmap

- [ ] Monaco Editor integration
- [ ] Multi-file project support
- [ ] Collaborative editing
- [ ] Code sharing and embedding
- [ ] Plugin system
- [ ] Additional export formats

---

Made with ❤️ for the web development community