/**
 * Advanced Tab System for CSS Playground
 * Handles dynamic tab management, content switching, and state persistence
 */

class TabSystem {
    constructor(options = {}) {
        this.options = {
            container: '#tab-container',
            activeClass: 'tab-active',
            contentClass: 'tab-content',
            closeable: true,
            draggable: true,
            maxTabs: 10,
            persistState: true,
            animations: true,
            keyboard: true,
            ...options
        };

        this.tabs = new Map();
        this.activeTab = null;
        this.tabCounter = 0;
        this.eventManager = window.eventManager;
        this.storageManager = window.storageManager;
        
        this.init();
    }

    init() {
        this.container = document.querySelector(this.options.container);
        if (!this.container) {
            console.error('Tab container not found');
            return;
        }

        this.createTabStructure();
        this.bindEvents();
        this.loadPersistedState();
        this.setupKeyboardNavigation();
        
        // Create default tab if none exist
        if (this.tabs.size === 0) {
            this.createTab('CSS Properties', 'properties', true);
        }
    }

    createTabStructure() {
        this.container.innerHTML = `
            <div class="tab-header">
                <div class="tab-nav" role="tablist">
                    <div class="tab-nav-scroll">
                        <div class="tab-list"></div>
                    </div>
                    <div class="tab-controls">
                        <button class="tab-add-btn" title="Add New Tab" aria-label="Add new tab">
                            <i class="icon-plus"></i>
                        </button>
                        <button class="tab-menu-btn" title="Tab Menu" aria-label="Tab menu">
                            <i class="icon-menu"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="tab-content-area">
                <div class="tab-contents"></div>
            </div>
        `;

        this.tabList = this.container.querySelector('.tab-list');
        this.tabContents = this.container.querySelector('.tab-contents');
        this.addBtn = this.container.querySelector('.tab-add-btn');
        this.menuBtn = this.container.querySelector('.tab-menu-btn');
    }

    bindEvents() {
        // Add tab button
        this.addBtn?.addEventListener('click', () => this.showAddTabMenu());
        
        // Tab menu button
        this.menuBtn?.addEventListener('click', () => this.showTabMenu());
        
        // Tab list events (delegation)
        this.tabList?.addEventListener('click', this.handleTabClick.bind(this));
        this.tabList?.addEventListener('mousedown', this.handleTabMouseDown.bind(this));
        this.tabList?.addEventListener('contextmenu', this.handleTabContextMenu.bind(this));
        
        // Drag and drop for tab reordering
        if (this.options.draggable) {
            this.setupTabDragDrop();
        }
        
        // Window events
        window.addEventListener('beforeunload', () => this.saveState());
        window.addEventListener('resize', () => this.updateTabScrolling());
        
        // Custom events
        this.eventManager?.on('theme:changed', () => this.updateTabStyles());
        this.eventManager?.on('content:changed', (data) => this.updateTabContent(data));
    }

    createTab(title, type = 'custom', activate = false, content = null) {
        if (this.tabs.size >= this.options.maxTabs) {
            this.showError('Maximum number of tabs reached');
            return null;
        }

        const tabId = `tab-${++this.tabCounter}`;
        const tab = {
            id: tabId,
            title: title || `Tab ${this.tabCounter}`,
            type,
            content: content || this.getDefaultContent(type),
            modified: false,
            timestamp: Date.now()
        };

        // Create tab element
        const tabElement = this.createTabElement(tab);
        const contentElement = this.createContentElement(tab);

        // Add to DOM
        this.tabList.appendChild(tabElement);
        this.tabContents.appendChild(contentElement);

        // Store tab data
        this.tabs.set(tabId, {
            ...tab,
            element: tabElement,
            contentElement
        });

        // Activate if requested or if it's the first tab
        if (activate || this.tabs.size === 1) {
            this.activateTab(tabId);
        }

        this.updateTabScrolling();
        this.saveState();
        
        // Emit event
        this.eventManager?.emit('tab:created', { tabId, tab });
        
        return tabId;
    }

    createTabElement(tab) {
        const tabEl = document.createElement('div');
        tabEl.className = 'tab-item';
        tabEl.setAttribute('data-tab-id', tab.id);
        tabEl.setAttribute('role', 'tab');
        tabEl.setAttribute('aria-selected', 'false');
        tabEl.setAttribute('tabindex', '-1');

        tabEl.innerHTML = `
            <div class="tab-content-wrapper">
                <div class="tab-icon">
                    <i class="icon-${this.getTabIcon(tab.type)}"></i>
                </div>
                <div class="tab-title" title="${tab.title}">${tab.title}</div>
                <div class="tab-modified-indicator" ${!tab.modified ? 'style="display: none;"' : ''}>
                    <i class="icon-dot"></i>
                </div>
                ${this.options.closeable ? `
                    <button class="tab-close-btn" title="Close tab" aria-label="Close ${tab.title}">
                        <i class="icon-x"></i>
                    </button>
                ` : ''}
            </div>
        `;

        return tabEl;
    }

    createContentElement(tab) {
        const contentEl = document.createElement('div');
        contentEl.className = `tab-content ${this.options.contentClass}`;
        contentEl.setAttribute('data-tab-id', tab.id);
        contentEl.setAttribute('role', 'tabpanel');
        contentEl.setAttribute('aria-hidden', 'true');
        contentEl.style.display = 'none';
        
        contentEl.innerHTML = tab.content;
        
        return contentEl;
    }

    activateTab(tabId) {
        if (!this.tabs.has(tabId)) return false;

        // Deactivate current tab
        if (this.activeTab) {
            const currentTab = this.tabs.get(this.activeTab);
            currentTab.element.classList.remove(this.options.activeClass);
            currentTab.element.setAttribute('aria-selected', 'false');
            currentTab.element.setAttribute('tabindex', '-1');
            currentTab.contentElement.style.display = 'none';
            currentTab.contentElement.setAttribute('aria-hidden', 'true');
        }

        // Activate new tab
        const tab = this.tabs.get(tabId);
        tab.element.classList.add(this.options.activeClass);
        tab.element.setAttribute('aria-selected', 'true');
        tab.element.setAttribute('tabindex', '0');
        tab.contentElement.style.display = 'block';
        tab.contentElement.setAttribute('aria-hidden', 'false');

        this.activeTab = tabId;
        this.scrollToTab(tab.element);
        
        // Focus management
        if (this.options.keyboard) {
            tab.element.focus();
        }

        // Emit event
        this.eventManager?.emit('tab:activated', { tabId, tab });
        
        return true;
    }

    closeTab(tabId, force = false) {
        if (!this.tabs.has(tabId)) return false;
        
        const tab = this.tabs.get(tabId);
        
        // Check for unsaved changes
        if (!force && tab.modified) {
            if (!confirm(`Tab "${tab.title}" has unsaved changes. Close anyway?`)) {
                return false;
            }
        }

        // If closing active tab, activate another
        if (this.activeTab === tabId) {
            const tabArray = Array.from(this.tabs.keys());
            const currentIndex = tabArray.indexOf(tabId);
            const nextTab = tabArray[currentIndex + 1] || tabArray[currentIndex - 1];
            
            if (nextTab) {
                this.activateTab(nextTab);
            } else {
                this.activeTab = null;
            }
        }

        // Remove from DOM
        tab.element.remove();
        tab.contentElement.remove();
        
        // Remove from storage
        this.tabs.delete(tabId);
        
        // If no tabs left, create a default one
        if (this.tabs.size === 0) {
            this.createTab('New Tab', 'custom', true);
        }

        this.updateTabScrolling();
        this.saveState();
        
        // Emit event
        this.eventManager?.emit('tab:closed', { tabId, tab });
        
        return true;
    }

    handleTabClick(event) {
        const tabItem = event.target.closest('.tab-item');
        if (!tabItem) return;

        const tabId = tabItem.getAttribute('data-tab-id');
        
        // Handle close button
        if (event.target.closest('.tab-close-btn')) {
            event.stopPropagation();
            this.closeTab(tabId);
            return;
        }

        // Activate tab
        this.activateTab(tabId);
    }

    handleTabMouseDown(event) {
        // Middle click to close
        if (event.button === 1) {
            event.preventDefault();
            const tabItem = event.target.closest('.tab-item');
            if (tabItem) {
                const tabId = tabItem.getAttribute('data-tab-id');
                this.closeTab(tabId);
            }
        }
    }

    handleTabContextMenu(event) {
        event.preventDefault();
        const tabItem = event.target.closest('.tab-item');
        if (!tabItem) return;

        const tabId = tabItem.getAttribute('data-tab-id');
        this.showTabContextMenu(event, tabId);
    }

    setupTabDragDrop() {
        let draggedTab = null;
        let draggedTabId = null;

        this.tabList.addEventListener('dragstart', (event) => {
            const tabItem = event.target.closest('.tab-item');
            if (!tabItem) return;

            draggedTab = tabItem;
            draggedTabId = tabItem.getAttribute('data-tab-id');
            
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', tabItem.outerHTML);
            
            tabItem.classList.add('tab-dragging');
        });

        this.tabList.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            const tabItem = event.target.closest('.tab-item');
            if (!tabItem || tabItem === draggedTab) return;

            const rect = tabItem.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            
            // Visual feedback
            this.tabList.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('drag-over-left', 'drag-over-right');
            });

            if (event.clientX < midpoint) {
                tabItem.classList.add('drag-over-left');
            } else {
                tabItem.classList.add('drag-over-right');
            }
        });

        this.tabList.addEventListener('drop', (event) => {
            event.preventDefault();
            
            const targetTab = event.target.closest('.tab-item');
            if (!targetTab || targetTab === draggedTab) return;

            const rect = targetTab.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            const insertBefore = event.clientX < midpoint;

            // Reorder tabs
            if (insertBefore) {
                this.tabList.insertBefore(draggedTab, targetTab);
            } else {
                this.tabList.insertBefore(draggedTab, targetTab.nextSibling);
            }

            this.reorderTabContents();
            this.saveState();
            
            // Emit event
            this.eventManager?.emit('tab:reordered', { 
                tabId: draggedTabId, 
                newPosition: Array.from(this.tabList.children).indexOf(draggedTab)
            });
        });

        this.tabList.addEventListener('dragend', () => {
            if (draggedTab) {
                draggedTab.classList.remove('tab-dragging');
                draggedTab = null;
                draggedTabId = null;
            }
            
            // Clean up visual feedback
            this.tabList.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('drag-over-left', 'drag-over-right');
            });
        });
    }

    reorderTabContents() {
        const tabOrder = Array.from(this.tabList.children).map(tab => 
            tab.getAttribute('data-tab-id')
        );
        
        tabOrder.forEach(tabId => {
            const tab = this.tabs.get(tabId);
            if (tab) {
                this.tabContents.appendChild(tab.contentElement);
            }
        });
    }

    setupKeyboardNavigation() {
        if (!this.options.keyboard) return;

        this.container.addEventListener('keydown', (event) => {
            if (event.target.closest('.tab-item')) {
                this.handleTabKeydown(event);
            }
        });
    }

    handleTabKeydown(event) {
        const tabItem = event.target.closest('.tab-item');
        const tabId = tabItem.getAttribute('data-tab-id');
        const tabs = Array.from(this.tabList.children);
        const currentIndex = tabs.indexOf(tabItem);

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    const prevTabId = tabs[currentIndex - 1].getAttribute('data-tab-id');
                    this.activateTab(prevTabId);
                }
                break;

            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < tabs.length - 1) {
                    const nextTabId = tabs[currentIndex + 1].getAttribute('data-tab-id');
                    this.activateTab(nextTabId);
                }
                break;

            case 'Home':
                event.preventDefault();
                if (tabs.length > 0) {
                    const firstTabId = tabs[0].getAttribute('data-tab-id');
                    this.activateTab(firstTabId);
                }
                break;

            case 'End':
                event.preventDefault();
                if (tabs.length > 0) {
                    const lastTabId = tabs[tabs.length - 1].getAttribute('data-tab-id');
                    this.activateTab(lastTabId);
                }
                break;

            case 'Delete':
            case 'Backspace':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.closeTab(tabId);
                }
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                // Could trigger tab edit mode
                this.editTabTitle(tabId);
                break;
        }
    }

    updateTabContent(tabId, content) {
        if (!this.tabs.has(tabId)) return false;

        const tab = this.tabs.get(tabId);
        tab.content = content;
        tab.contentElement.innerHTML = content;
        this.markTabModified(tabId);
        
        return true;
    }

    markTabModified(tabId, modified = true) {
        if (!this.tabs.has(tabId)) return;

        const tab = this.tabs.get(tabId);
        tab.modified = modified;
        
        const indicator = tab.element.querySelector('.tab-modified-indicator');
        if (indicator) {
            indicator.style.display = modified ? 'block' : 'none';
        }
        
        this.saveState();
    }

    updateTabTitle(tabId, title) {
        if (!this.tabs.has(tabId)) return false;

        const tab = this.tabs.get(tabId);
        tab.title = title;
        
        const titleEl = tab.element.querySelector('.tab-title');
        if (titleEl) {
            titleEl.textContent = title;
            titleEl.setAttribute('title', title);
        }
        
        tab.element.setAttribute('aria-label', title);
        this.saveState();
        
        return true;
    }

    editTabTitle(tabId) {
        if (!this.tabs.has(tabId)) return;

        const tab = this.tabs.get(tabId);
        const titleEl = tab.element.querySelector('.tab-title');
        const currentTitle = tab.title;

        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tab-title-edit';
        input.value = currentTitle;
        input.style.width = titleEl.offsetWidth + 'px';

        // Replace title with input
        titleEl.style.display = 'none';
        titleEl.parentNode.insertBefore(input, titleEl);
        
        input.focus();
        input.select();

        const finishEdit = (save = false) => {
            const newTitle = input.value.trim();
            
            if (save && newTitle && newTitle !== currentTitle) {
                this.updateTabTitle(tabId, newTitle);
            }
            
            input.remove();
            titleEl.style.display = 'block';
        };

        input.addEventListener('blur', () => finishEdit(true));
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                finishEdit(true);
            } else if (event.key === 'Escape') {
                finishEdit(false);
            }
        });
    }

    showAddTabMenu() {
        const menu = document.createElement('div');
        menu.className = 'tab-add-menu';
        menu.innerHTML = `
            <div class="menu-item" data-type="properties">
                <i class="icon-settings"></i> CSS Properties
            </div>
            <div class="menu-item" data-type="layout">
                <i class="icon-layout"></i> Layout Demo
            </div>
            <div class="menu-item" data-type="animation">
                <i class="icon-play"></i> Animation
            </div>
            <div class="menu-item" data-type="custom">
                <i class="icon-code"></i> Custom CSS
            </div>
        `;

        // Position menu
        const rect = this.addBtn.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = rect.bottom + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.zIndex = '10000';

        document.body.appendChild(menu);

        // Handle menu clicks
        menu.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item');
            if (menuItem) {
                const type = menuItem.getAttribute('data-type');
                const title = menuItem.textContent.trim();
                this.createTab(title, type, true);
            }
            menu.remove();
        });

        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    showTabMenu() {
        const menu = document.createElement('div');
        menu.className = 'tab-menu';
        menu.innerHTML = `
            <div class="menu-item" data-action="close-others">
                <i class="icon-x"></i> Close Others
            </div>
            <div class="menu-item" data-action="close-all">
                <i class="icon-x-circle"></i> Close All
            </div>
            <div class="menu-separator"></div>
            <div class="menu-item" data-action="save-session">
                <i class="icon-save"></i> Save Session
            </div>
            <div class="menu-item" data-action="restore-session">
                <i class="icon-folder-open"></i> Restore Session
            </div>
        `;

        // Position and show menu (similar to add menu)
        const rect = this.menuBtn.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = rect.bottom + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        menu.style.zIndex = '10000';

        document.body.appendChild(menu);

        // Handle menu actions
        menu.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item');
            if (menuItem) {
                const action = menuItem.getAttribute('data-action');
                this.handleTabMenuAction(action);
            }
            menu.remove();
        });

        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    handleTabMenuAction(action) {
        switch (action) {
            case 'close-others':
                Array.from(this.tabs.keys()).forEach(tabId => {
                    if (tabId !== this.activeTab) {
                        this.closeTab(tabId);
                    }
                });
                break;

            case 'close-all':
                if (confirm('Close all tabs?')) {
                    Array.from(this.tabs.keys()).forEach(tabId => {
                        this.closeTab(tabId, true);
                    });
                }
                break;

            case 'save-session':
                this.saveSession();
                break;

            case 'restore-session':
                this.showRestoreSessionDialog();
                break;
        }
    }

    showTabContextMenu(event, tabId) {
        const tab = this.tabs.get(tabId);
        const menu = document.createElement('div');
        menu.className = 'tab-context-menu';
        menu.innerHTML = `
            <div class="menu-item" data-action="rename">
                <i class="icon-edit"></i> Rename
            </div>
            <div class="menu-item" data-action="duplicate">
                <i class="icon-copy"></i> Duplicate
            </div>
            <div class="menu-separator"></div>
            <div class="menu-item" data-action="close">
                <i class="icon-x"></i> Close
            </div>
            <div class="menu-item" data-action="close-others">
                <i class="icon-x"></i> Close Others
            </div>
        `;

        menu.style.position = 'fixed';
        menu.style.top = event.clientY + 'px';
        menu.style.left = event.clientX + 'px';
        menu.style.zIndex = '10000';

        document.body.appendChild(menu);

        menu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const action = menuItem.getAttribute('data-action');
                this.handleTabContextAction(action, tabId);
            }
            menu.remove();
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    handleTabContextAction(action, tabId) {
        const tab = this.tabs.get(tabId);
        
        switch (action) {
            case 'rename':
                this.editTabTitle(tabId);
                break;

            case 'duplicate':
                this.createTab(
                    `${tab.title} (Copy)`,
                    tab.type,
                    true,
                    tab.content
                );
                break;

            case 'close':
                this.closeTab(tabId);
                break;

            case 'close-others':
                Array.from(this.tabs.keys()).forEach(id => {
                    if (id !== tabId) {
                        this.closeTab(id);
                    }
                });
                break;
        }
    }

    scrollToTab(tabElement) {
        const navScroll = this.container.querySelector('.tab-nav-scroll');
        if (!navScroll) return;

        const tabRect = tabElement.getBoundingClientRect();
        const navRect = navScroll.getBoundingClientRect();

        if (tabRect.left < navRect.left) {
            navScroll.scrollLeft -= navRect.left - tabRect.left + 20;
        } else if (tabRect.right > navRect.right) {
            navScroll.scrollLeft += tabRect.right - navRect.right + 20;
        }
    }

    updateTabScrolling() {
        const navScroll = this.container.querySelector('.tab-nav-scroll');
        const tabList = this.container.querySelector('.tab-list');
        
        if (!navScroll || !tabList) return;

        // Add scroll buttons if needed
        const needsScrolling = tabList.scrollWidth > navScroll.clientWidth;
        
        this.container.classList.toggle('tabs-scrollable', needsScrolling);
    }

    getTabIcon(type) {
        const icons = {
            properties: 'settings',
            layout: 'layout',
            animation: 'play',
            custom: 'code',
            demo: 'eye'
        };
        return icons[type] || 'file';
    }

    getDefaultContent(type) {
        const templates = {
            properties: '<div class="property-panel">Loading properties...</div>',
            layout: '<div class="layout-demo">Layout demo content</div>',
            animation: '<div class="animation-demo">Animation workspace</div>',
            custom: '<div class="css-editor">/* Custom CSS */</div>',
            demo: '<div class="demo-preview">Demo preview</div>'
        };
        return templates[type] || '<div class="tab-placeholder">Empty tab</div>';
    }

    saveState() {
        if (!this.options.persistState || !this.storageManager) return;

        const state = {
            tabs: Array.from(this.tabs.entries()).map(([id, tab]) => ({
                id,
                title: tab.title,
                type: tab.type,
                content: tab.content,
                modified: tab.modified,
                timestamp: tab.timestamp
            })),
            activeTab: this.activeTab,
            timestamp: Date.now()
        };

        this.storageManager.set('tab-system-state', state, { 
            expires: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
    }

    loadPersistedState() {
        if (!this.options.persistState || !this.storageManager) return;

        const state = this.storageManager.get('tab-system-state');
        if (!state || !state.tabs) return;

        // Restore tabs
        state.tabs.forEach(tabData => {
            const tabId = this.createTab(
                tabData.title,
                tabData.type,
                false,
                tabData.content
            );
            
            if (tabId) {
                const tab = this.tabs.get(tabId);
                tab.modified = tabData.modified;
                tab.timestamp = tabData.timestamp;
                
                if (tabData.modified) {
                    this.markTabModified(tabId, true);
                }
            }
        });

        // Restore active tab
        if (state.activeTab && this.tabs.has(state.activeTab)) {
            this.activateTab(state.activeTab);
        } else if (this.tabs.size > 0) {
            this.activateTab(Array.from(this.tabs.keys())[0]);
        }
    }

    saveSession() {
        const sessionData = {
            tabs: Array.from(this.tabs.entries()).map(([id, tab]) => ({
                id,
                title: tab.title,
                type: tab.type,
                content: tab.content,
                modified: tab.modified
            })),
            activeTab: this.activeTab,
            timestamp: Date.now(),
            name: `Session ${new Date().toLocaleDateString()}`
        };

        const sessions = this.storageManager?.get('tab-sessions') || [];
        sessions.unshift(sessionData);
        
        // Keep only last 10 sessions
        if (sessions.length > 10) {
            sessions.splice(10);
        }
        
        this.storageManager?.set('tab-sessions', sessions);
        this.showToast('Session saved successfully');
    }

    showRestoreSessionDialog() {
        const sessions = this.storageManager?.get('tab-sessions') || [];
        if (sessions.length === 0) {
            this.showToast('No saved sessions found');
            return;
        }

        // Create dialog (simplified - could be enhanced)
        const dialog = document.createElement('div');
        dialog.className = 'session-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Restore Session</h3>
                <div class="session-list">
                    ${sessions.map((session, index) => `
                        <div class="session-item" data-index="${index}">
                            <div class="session-name">${session.name}</div>
                            <div class="session-info">
                                ${session.tabs.length} tabs • ${new Date(session.timestamp).toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="dialog-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-restore" disabled>Restore</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Handle dialog interaction
        let selectedIndex = -1;
        
        dialog.addEventListener('click', (event) => {
            const sessionItem = event.target.closest('.session-item');
            if (sessionItem) {
                dialog.querySelectorAll('.session-item').forEach(item => 
                    item.classList.remove('selected'));
                sessionItem.classList.add('selected');
                selectedIndex = parseInt(sessionItem.getAttribute('data-index'));
                dialog.querySelector('.btn-restore').disabled = false;
            }

            if (event.target.classList.contains('btn-cancel')) {
                dialog.remove();
            }

            if (event.target.classList.contains('btn-restore') && selectedIndex >= 0) {
                this.restoreSession(sessions[selectedIndex]);
                dialog.remove();
            }
        });
    }

    restoreSession(sessionData) {
        // Close all current tabs
        Array.from(this.tabs.keys()).forEach(tabId => {
            this.closeTab(tabId, true);
        });

        // Restore session tabs
        sessionData.tabs.forEach(tabData => {
            const tabId = this.createTab(
                tabData.title,
                tabData.type,
                false,
                tabData.content
            );
            
            if (tabId && tabData.modified) {
                this.markTabModified(tabId, true);
            }
        });

        // Restore active tab
        if (sessionData.activeTab && this.tabs.has(sessionData.activeTab)) {
            this.activateTab(sessionData.activeTab);
        } else if (this.tabs.size > 0) {
            this.activateTab(Array.from(this.tabs.keys())[0]);
        }

        this.showToast('Session restored successfully');
    }

    showToast(message, type = 'success') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    // Public API methods
    getActiveTab() {
        return this.activeTab ? this.tabs.get(this.activeTab) : null;
    }

    getAllTabs() {
        return Array.from(this.tabs.values());
    }

    getTab(tabId) {
        return this.tabs.get(tabId);
    }

    updateTabStyles() {
        // Re-apply theme styles if needed
        this.container.classList.toggle('dark-theme', 
            document.body.classList.contains('dark-theme'));
    }

    destroy() {
        this.saveState();
        this.container.innerHTML = '';
        this.tabs.clear();
        this.activeTab = null;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabSystem;
} else {
    window.TabSystem = TabSystem;
}