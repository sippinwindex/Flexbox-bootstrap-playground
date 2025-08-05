/**
 * Live Coding Platform - Main functionality
 * Fixed version with proper template literal termination
 */

class LiveCodingPlatform {
    constructor() {
        this.state = {
            currentTab: 'html',
            editors: {},
            codeMirrorInstances: {},
            updateTimeout: null,
            autoSaveInterval: 30000,
            syntaxTheme: 'dracula',
            isDarkMode: true,
            isFullscreen: false,
            lastSaveTime: null,
            errorCount: 0,
            maxErrors: 10
        };
        
        this.init();
    }

    init() {
        try {
            console.log('🚀 Enhanced Live Coding Platform initializing...');
            
            this.setupErrorBoundary();
            this.setupEditors();
            this.initializeCodeMirror();
            this.setupEventListeners();
            this.loadFromStorage();
            
            if (!this.hasStoredContent()) {
                this.loadDefaultContent();
            }
            
            this.startAutoSave();
            this.debounceUpdate();
            
            this.logToTerminal('Platform initialized successfully!', 'success');
            this.logToTerminal('Start coding to see live changes!', 'info');
            
        } catch (error) {
            this.handleError(error, 'Platform initialization failed');
        }
    }

    setupErrorBoundary() {
        // Global error boundary for the platform
        window.globalErrorBoundary = {
            handleError: (error, context = {}) => {
                this.state.errorCount++;
                
                if (this.state.errorCount > this.state.maxErrors) {
                    this.logToTerminal('Too many errors detected. Please refresh the page.', 'error');
                    return;
                }
                
                console.error('Platform Error:', error);
                this.logToTerminal(`Error: ${error.message}`, 'error');
            }
        };
        
        // Global error handlers
        window.addEventListener('error', (e) => {
            window.globalErrorBoundary.handleError(e.error || new Error(e.message), {
                filename: e.filename,
                line: e.lineno,
                column: e.colno
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            window.globalErrorBoundary.handleError(new Error(`Unhandled Promise: ${e.reason}`), {
                type: 'unhandled_promise'
            });
        });
    }

    handleError(error, context) {
        if (window.globalErrorBoundary) {
            window.globalErrorBoundary.handleError(error, { context });
        } else {
            console.error(`${context}:`, error);
        }
    }

    setupEditors() {
        try {
            this.state.editors = {
                html: document.getElementById('htmlEditor'),
                css: document.getElementById('cssEditor'),
                js: document.getElementById('jsEditor')
            };
            
            // Validate editor elements exist
            Object.entries(this.state.editors).forEach(([type, editor]) => {
                if (!editor) {
                    throw new Error(`${type} editor element not found`);
                }
            });
            
        } catch (error) {
            this.handleError(error, 'Editor setup');
        }
    }

    initializeCodeMirror() {
        try {
            const currentSyntaxTheme = window.ThemeManager ? 
                window.ThemeManager.getCurrentSyntaxTheme() : 'dracula';
            
            const commonOptions = {
                lineNumbers: true,
                autoCloseTags: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                styleActiveLine: true,
                indentUnit: 2,
                tabSize: 2,
                lineWrapping: true,
                theme: currentSyntaxTheme,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "Ctrl-/": "toggleComment",
                    "Tab": (cm) => {
                        if (cm.somethingSelected()) {
                            cm.indentSelection("add");
                        } else {
                            cm.replaceSelection("  ", "end");
                        }
                    }
                }
            };

            this.state.codeMirrorInstances.html = CodeMirror.fromTextArea(this.state.editors.html, {
                ...commonOptions,
                mode: 'htmlmixed'
            });

            this.state.codeMirrorInstances.css = CodeMirror.fromTextArea(this.state.editors.css, {
                ...commonOptions,
                mode: 'css'
            });

            this.state.codeMirrorInstances.js = CodeMirror.fromTextArea(this.state.editors.js, {
                ...commonOptions,
                mode: 'javascript'
            });

            // Add event listeners
            Object.entries(this.state.codeMirrorInstances).forEach(([type, instance]) => {
                if (!instance) return;
                
                instance.on('change', () => {
                    try {
                        this.debounceUpdate();
                        this.updateStats();
                    } catch (error) {
                        this.handleError(error, `${type} editor change handler`);
                    }
                });

                instance.on('cursorActivity', () => {
                    try {
                        this.updateStats();
                    } catch (error) {
                        this.handleError(error, `${type} cursor activity handler`);
                    }
                });
            });
            
            this.logToTerminal('CodeMirror editors initialized', 'success');
            
        } catch (error) {
            this.handleError(error, 'CodeMirror initialization');
        }
    }

    setupEventListeners() {
        try {
            // Global keyboard shortcuts
            document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
            window.addEventListener('beforeunload', () => this.saveToStorage());
            window.addEventListener('message', (e) => this.handleIframeMessage(e));
            
            // Listen for theme changes
            window.addEventListener('themeChanged', () => {
                this.updateStats();
            });
            
            window.addEventListener('syntaxThemeChanged', (e) => {
                try {
                    const syntaxTheme = e.detail.syntaxTheme;
                    Object.values(this.state.codeMirrorInstances).forEach(instance => {
                        if (instance) {
                            instance.setOption('theme', syntaxTheme);
                        }
                    });
                } catch (error) {
                    this.handleError(error, 'Syntax theme change');
                }
            });
            
            // Fullscreen event listeners
            ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
                .forEach(event => {
                    document.addEventListener(event, () => this.handleFullscreenChange());
                });
                
        } catch (error) {
            this.handleError(error, 'Event listener setup');
        }
    }

    handleGlobalKeydown(e) {
        try {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveToStorage();
                this.showToast('💾 Project saved!', 'success');
            }
            
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
        } catch (error) {
            this.handleError(error, 'Global keydown handler');
        }
    }

    debounceUpdate() {
        clearTimeout(this.state.updateTimeout);
        this.state.updateTimeout = setTimeout(() => this.updatePreview(), 300);
    }

    updatePreview() {
        try {
            const iframe = document.getElementById('previewFrame');
            if (!iframe) {
                this.logToTerminal('Preview frame not found', 'error');
                return;
            }
            
            const htmlValue = this.state.codeMirrorInstances.html.getValue();
            const cssValue = this.state.codeMirrorInstances.css.getValue();
            const jsValue = this.state.codeMirrorInstances.js.getValue();
            
            const content = this.generatePreviewContent(htmlValue, cssValue, jsValue);
            iframe.srcdoc = content;
            
        } catch (error) {
            this.handleError(error, 'Preview update');
        }
    }

    generatePreviewContent(html, css, js) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Console redirection
        (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            function postMessage(level, args) {
                try {
                    const message = args.map(arg => {
                        if (typeof arg === 'object') {
                            return JSON.stringify(arg, null, 2);
                        }
                        return String(arg);
                    }).join(' ');
                    
                    window.parent.postMessage({ 
                        type: "console", 
                        level: level, 
                        message: message
                    }, "*");
                } catch (e) {
                    // Fail silently
                }
            }
            
            console.log = function(...args) {
                postMessage("log", args);
                originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
                postMessage("error", args);
                originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
                postMessage("warn", args);
                originalWarn.apply(console, args);
            };
            
            console.info = function(...args) {
                postMessage("info", args);
                originalInfo.apply(console, args);
            };

            window.addEventListener("error", function(event) {
                postMessage("error", [event.error ? event.error.toString() : event.message]);
            });

            window.addEventListener("unhandledrejection", function(event) {
                postMessage("error", ["Unhandled Promise Rejection: " + event.reason]);
            });

            try {
                ${js}
            } catch (error) {
                postMessage("error", [error.toString()]);
            }
        })();
    </script>
</body>
</html>`;
    }

    handleIframeMessage(e) {
        try {
            const iframe = document.getElementById('previewFrame');
            if (!iframe || e.source !== iframe.contentWindow) return;
            
            if (!e.data || typeof e.data !== 'object') return;
            
            if (e.data.type === 'error') {
                this.logToTerminal(`JS Error: ${e.data.message}`, 'error');
            } else if (e.data.type === 'console') {
                const level = ['log', 'info', 'warn', 'error'].includes(e.data.level) ? e.data.level : 'info';
                this.logToTerminal(`Console.${level}: ${e.data.message}`, level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info');
            }
            
        } catch (error) {
            this.handleError(error, 'Iframe message handler');
        }
    }

    runCode() {
        try {
            this.updatePreview();
            this.logToTerminal('Code executed successfully', 'success');
            this.showToast('▶️ Code executed!', 'success');
        } catch (error) {
            this.handleError(error, 'Code execution');
        }
    }

    formatCode() {
        try {
            const currentInstance = this.state.codeMirrorInstances[this.state.currentTab];
            if (!currentInstance) return;
            
            const cursor = currentInstance.getCursor();
            const totalLines = currentInstance.lineCount();
            
            currentInstance.operation(() => {
                for (let i = 0; i < totalLines; i++) {
                    currentInstance.indentLine(i);
                }
            });
            
            currentInstance.setCursor(cursor);
            this.logToTerminal(`${this.state.currentTab.toUpperCase()} code formatted`, 'info');
            this.showToast('📝 Code formatted!', 'success');
            
        } catch (error) {
            this.handleError(error, 'Code formatting');
        }
    }

    clearCurrentEditor() {
        try {
            const currentInstance = this.state.codeMirrorInstances[this.state.currentTab];
            if (!currentInstance) return;
            
            if (confirm(`Are you sure you want to clear the ${this.state.currentTab.toUpperCase()} editor?`)) {
                currentInstance.setValue('');
                this.debounceUpdate();
                this.logToTerminal(`${this.state.currentTab.toUpperCase()} editor cleared`, 'warn');
            }
        } catch (error) {
            this.handleError(error, 'Clear editor');
        }
    }

    switchEditorTab(tab) {
        try {
            if (!['html', 'css', 'js'].includes(tab)) return;
            
            this.state.currentTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            const targetTab = document.getElementById(`${tab}Tab`);
            if (targetTab) targetTab.classList.add('active');
            
            // Update editor panels
            document.querySelectorAll('.editor-panel').forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(`${tab}Panel`);
            if (targetPanel) targetPanel.classList.add('active');
            
            // Refresh and focus current editor
            setTimeout(() => {
                if (this.state.codeMirrorInstances[tab]) {
                    this.state.codeMirrorInstances[tab].refresh();
                    this.state.codeMirrorInstances[tab].focus();
                }
            }, 10);
            
            this.updateStats();
            
        } catch (error) {
            this.handleError(error, 'Tab switching');
        }
    }

    updateStats() {
        try {
            const currentInstance = this.state.codeMirrorInstances[this.state.currentTab];
            if (!currentInstance) return;
            
            const cursor = currentInstance.getCursor();
            const text = currentInstance.getValue();
            
            const cursorPosElement = document.getElementById('cursorPosition');
            const wordCountElement = document.getElementById('wordCount');
            const charCountElement = document.getElementById('characterCount');
            const editorStatusElement = document.getElementById('editorStatus');
            
            if (cursorPosElement) {
                cursorPosElement.textContent = `Line ${cursor.line + 1}, Col ${cursor.ch + 1}`;
            }
            
            if (wordCountElement) {
                const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
                wordCountElement.textContent = `${wordCount} words`;
            }
            
            if (charCountElement) {
                charCountElement.textContent = `${text.length} chars`;
            }
            
            if (editorStatusElement) {
                editorStatusElement.textContent = `Editing ${this.state.currentTab.toUpperCase()}`;
            }
            
        } catch (error) {
            this.handleError(error, 'Stats update');
        }
    }

    setPreviewSize(width) {
        try {
            const frame = document.getElementById('previewFrame');
            if (!frame) return;
            
            document.querySelectorAll('.responsive-btn').forEach(btn => btn.classList.remove('active'));
            
            let targetButton;
            if (width === '100%') targetButton = document.querySelector('.responsive-btn .bi-display');
            else if (width === '768px') targetButton = document.querySelector('.responsive-btn .bi-tablet');
            else if (width === '375px') targetButton = document.querySelector('.responsive-btn .bi-phone');
            
            if (targetButton) targetButton.closest('button').classList.add('active');
            
            frame.style.width = width;
            frame.style.margin = width !== '100%' ? '0 auto' : '0';
            
        } catch (error) {
            this.handleError(error, 'Preview size change');
        }
    }

    toggleFullscreen() {
        try {
            const previewSection = document.getElementById('previewSection');
            if (!previewSection) return;
            
            if (!this.state.isFullscreen) {
                if (previewSection.requestFullscreen) {
                    previewSection.requestFullscreen();
                } else if (previewSection.webkitRequestFullscreen) {
                    previewSection.webkitRequestFullscreen();
                } else {
                    previewSection.classList.add('fullscreen');
                    this.state.isFullscreen = true;
                    this.updateFullscreenButton();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else {
                    previewSection.classList.remove('fullscreen');
                    this.state.isFullscreen = false;
                    this.updateFullscreenButton();
                }
            }
        } catch (error) {
            this.handleError(error, 'Fullscreen toggle');
        }
    }

    handleFullscreenChange() {
        try {
            const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                            document.mozFullScreenElement || document.msFullscreenElement);
            
            this.state.isFullscreen = isCurrentlyFullscreen;
            this.updateFullscreenButton();
        } catch (error) {
            this.handleError(error, 'Fullscreen change handler');
        }
    }

    updateFullscreenButton() {
        try {
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            if (!fullscreenBtn) return;
            
            if (this.state.isFullscreen) {
                fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit"></i> Exit Fullscreen';
            } else {
                fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen"></i> Fullscreen';
            }
        } catch (error) {
            this.handleError(error, 'Fullscreen button update');
        }
    }

    loadTemplate(template) {
        try {
            if (!template) return;
            
            if (!confirm(`This will replace the current content. Are you sure you want to load the "${template}" template?`)) {
                const selectElement = document.querySelector('select.nav-btn');
                if (selectElement) selectElement.value = "";
                return;
            }

            // Use code templates from your existing code-template.js file
            if (window.CodeTemplates && window.CodeTemplates[template]) {
                const selectedTemplate = window.CodeTemplates[template];
                
                this.state.codeMirrorInstances.html.setValue(selectedTemplate.html || '');
                this.state.codeMirrorInstances.css.setValue(selectedTemplate.css || '');
                this.state.codeMirrorInstances.js.setValue(selectedTemplate.js || '');
                
                this.debounceUpdate();
                this.logToTerminal(`Template "${template}" loaded`, 'success');
                this.showToast(`📋 Template "${template}" loaded!`, 'info');
            } else {
                this.logToTerminal(`Template "${template}" not found`, 'error');
            }
            
            const selectElement = document.querySelector('select.nav-btn');
            if (selectElement) selectElement.value = "";
            
        } catch (error) {
            this.handleError(error, 'Template loading');
        }
    }

    downloadProject() {
        try {
            const html = this.state.codeMirrorInstances.html.getValue();
            const css = this.state.codeMirrorInstances.css.getValue();
            const js = this.state.codeMirrorInstances.js.getValue();
            
            const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Live Coding Project</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
${js}
    </script>
</body>
</html>`;
            
            const blob = new Blob([fullHTML], { type: 'text/html' });
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `live-coding-project-${timestamp}.html`;
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('📥 Project downloaded!', 'success');
            this.logToTerminal(`Project downloaded as ${filename}`, 'success');
            
        } catch (error) {
            this.handleError(error, 'Project download');
        }
    }

    openInCodePen() {
        try {
            const html = this.state.codeMirrorInstances.html.getValue();
            const css = this.state.codeMirrorInstances.css.getValue();
            const js = this.state.codeMirrorInstances.js.getValue();
            
            const data = {
                title: 'Live Coding Project',
                html: html,
                css: css,
                js: js
            };
            
            const form = document.createElement('form');
            form.action = 'https://codepen.io/pen/define';
            form.method = 'POST';
            form.target = '_blank';
            
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'data';
            input.value = JSON.stringify(data);
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            this.showToast('🖊️ Opening in CodePen...', 'info');
            this.logToTerminal('Project sent to CodePen', 'info');
            
        } catch (error) {
            this.handleError(error, 'CodePen export');
        }
    }

    openInJSFiddle() {
        try {
            const html = this.state.codeMirrorInstances.html.getValue();
            const css = this.state.codeMirrorInstances.css.getValue();
            const js = this.state.codeMirrorInstances.js.getValue();
            
            const form = document.createElement('form');
            form.action = 'https://jsfiddle.net/api/post/library/pure/';
            form.method = 'POST';
            form.target = '_blank';
            
            const inputs = [
                { name: 'title', value: 'Live Coding Project' },
                { name: 'html', value: html },
                { name: 'css', value: css },
                { name: 'js', value: js }
            ];
            
            inputs.forEach(inputData => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = inputData.name;
                input.value = inputData.value;
                form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            this.showToast('🎯 Opening in JSFiddle...', 'info');
            this.logToTerminal('Project sent to JSFiddle', 'info');
            
        } catch (error) {
            this.handleError(error, 'JSFiddle export');
        }
    }

    resetWorkspace() {
        try {
            if (confirm('Are you sure you want to reset the entire workspace? This will clear all editors and storage.')) {
                Object.values(this.state.codeMirrorInstances).forEach(instance => {
                    if (instance) instance.setValue('');
                });
                
                localStorage.removeItem('liveCodingHtml');
                localStorage.removeItem('liveCodingCss');
                localStorage.removeItem('liveCodingJs');
                
                this.loadDefaultContent();
                this.logToTerminal('Workspace has been reset to default', 'warn');
                this.showToast('🔄 Workspace Reset!', 'warn');
            }
        } catch (error) {
            this.handleError(error, 'Workspace reset');
        }
    }

    loadDefaultContent() {
        try {
            const defaultContent = {
                html: `<div class="hero-container">
    <div class="hero-content">
        <h1 class="hero-title">🚀 Welcome to Enhanced Live Coding!</h1>
        <p class="hero-subtitle">Start editing to see live changes in real-time!</p>
        <div class="hero-buttons">
            <button class="btn btn-primary" onclick="showDemo()">
                <i class="icon">▶</i> Try JavaScript
            </button>
            <button class="btn btn-secondary" onclick="changeTheme()">
                <i class="icon">🎨</i> Change Theme
            </button>
        </div>
        <div class="info-card">
            <h3>🔥 Pro Tips</h3>
            <ul>
                <li><strong>Ctrl+Enter</strong> to run code</li>
                <li><strong>Ctrl+S</strong> to save project</li>
                <li><strong>F11</strong> for fullscreen preview</li>
            </ul>
        </div>
    </div>
</div>`,
                css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.hero-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.hero-content {
    text-align: center;
    color: white;
    max-width: 800px;
}

.hero-title {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.5rem);
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.btn-primary {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
}

.btn-secondary {
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
}

.info-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
}

.info-card ul {
    list-style: none;
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
}

.info-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}`,
                js: `// Welcome functions
function showDemo() {
    console.log("🎉 JavaScript is working perfectly!");
    console.log("🚀 Enhanced Live Coding Platform Demo");
    console.log("💡 Try editing the HTML, CSS, or JavaScript!");
    
    alert("JavaScript Demo! Check the console for more details.");
}

function changeTheme() {
    const themes = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    ];
    
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.body.style.background = randomTheme;
    
    console.log('🎨 Theme changed!');
}

console.log("🚀 Enhanced Live Coding Platform Initialized!");
console.log("💡 Click the buttons above to explore features!");`
            };

            this.state.codeMirrorInstances.html.setValue(defaultContent.html);
            this.state.codeMirrorInstances.css.setValue(defaultContent.css);
            this.state.codeMirrorInstances.js.setValue(defaultContent.js);
            
            this.updatePreview();
            
        } catch (error) {
            this.handleError(error, 'Load default content');
        }
    }

    startAutoSave() {
        try {
            setInterval(() => {
                this.saveToStorage();
                const autoSaveStatus = document.getElementById('autoSaveStatus');
                if (autoSaveStatus) {
                    autoSaveStatus.textContent = `Auto-saved: ${new Date().toLocaleTimeString()}`;
                }
            }, this.state.autoSaveInterval);
            
        } catch (error) {
            this.handleError(error, 'Auto-save setup');
        }
    }

    saveToStorage() {
        try {
            const html = this.state.codeMirrorInstances.html.getValue();
            const css = this.state.codeMirrorInstances.css.getValue();
            const js = this.state.codeMirrorInstances.js.getValue();
            
            localStorage.setItem('liveCodingHtml', html);
            localStorage.setItem('liveCodingCss', css);
            localStorage.setItem('liveCodingJs', js);
            
            this.state.lastSaveTime = new Date();
            
        } catch (error) {
            this.handleError(error, 'Save to storage');
        }
    }

    loadFromStorage() {
        try {
            const html = localStorage.getItem('liveCodingHtml');
            const css = localStorage.getItem('liveCodingCss');
            const js = localStorage.getItem('liveCodingJs');

            if (html && this.state.codeMirrorInstances.html) {
                this.state.codeMirrorInstances.html.setValue(html);
            }
            if (css && this.state.codeMirrorInstances.css) {
                this.state.codeMirrorInstances.css.setValue(css);
            }
            if (js && this.state.codeMirrorInstances.js) {
                this.state.codeMirrorInstances.js.setValue(js);
            }

            if (html || css || js) {
                this.logToTerminal('Loaded saved project from storage', 'info');
            }
            
        } catch (error) {
            this.handleError(error, 'Load from storage');
        }
    }

    hasStoredContent() {
        try {
            return localStorage.getItem('liveCodingHtml') || 
                   localStorage.getItem('liveCodingCss') || 
                   localStorage.getItem('liveCodingJs');
        } catch (error) {
            this.handleError(error, 'Check stored content');
            return false;
        }
    }

    clearTerminal() {
        try {
            const terminal = document.getElementById('terminalContent');
            if (terminal) {
                terminal.innerHTML = '';
                this.logToTerminal('Console cleared', 'info');
            }
        } catch (error) {
            this.handleError(error, 'Clear terminal');
        }
    }

    logToTerminal(message, type = 'info') {
        try {
            const terminal = document.getElementById('terminalContent');
            if (!terminal) return;
            
            const line = document.createElement('div');
            line.className = `terminal-line terminal-${type}`;
            const timestamp = new Date().toLocaleTimeString();
            
            const sanitizedMessage = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            line.innerHTML = `<span>[${timestamp}]</span> <span class="terminal-${type}">[${type.toUpperCase()}]</span> ${sanitizedMessage}`;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
            
        } catch (error) {
            console.error('Terminal logging error:', error);
        }
    }

    showToast(message, type = 'info') {
        try {
            if (typeof showToast === 'function') {
                showToast(message, type);
            } else {
                console.log(`Toast: ${message} (${type})`);
            }
        } catch (error) {
            console.log(`Toast: ${message} (${type})`);
        }
    }
}

// Global functions for HTML onclick handlers
let platform;

function runCode() {
    if (platform) platform.runCode();
}

function formatCode() {
    if (platform) platform.formatCode();
}

function clearCurrentEditor() {
    if (platform) platform.clearCurrentEditor();
}

function switchEditorTab(tab) {
    if (platform) platform.switchEditorTab(tab);
}

function setPreviewSize(width) {
    if (platform) platform.setPreviewSize(width);
}

function toggleFullscreen() {
    if (platform) platform.toggleFullscreen();
}

function loadTemplate(template) {
    if (platform) platform.loadTemplate(template);
}

function downloadProject() {
    if (platform) platform.downloadProject();
}

function openInCodePen() {
    if (platform) platform.openInCodePen();
}

function openInJSFiddle() {
    if (platform) platform.openInJSFiddle();
}

function resetWorkspace() {
    if (platform) platform.resetWorkspace();
}

function clearTerminal() {
    if (platform) platform.clearTerminal();
}

// Initialize the platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        platform = new LiveCodingPlatform();
        window.platform = platform;
        
        console.log('🚀 Enhanced Live Coding Platform fully loaded and ready!');
        
    } catch (error) {
        console.error('Platform initialization error:', error);
    }
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    try {
        // F5 to run code (override refresh)
        if (e.key === 'F5') {
            e.preventDefault();
            runCode();
        }

        // Esc to exit fullscreen
        if (e.key === 'Escape' && platform && platform.state.isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
        }
        
    } catch (error) {
        console.error('Keyboard shortcut error:', error);
    }
});

console.log('📚 Live Coding Platform script loaded successfully!');