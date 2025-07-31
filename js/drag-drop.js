/**
 * drag-drop.js - Accessible Drag and Drop System
 * Provides keyboard and mouse drag & drop with comprehensive error handling
 */

class AccessibleDragDrop {
    constructor(playgroundState) {
        // FIXED: Validate dependencies
        if (!playgroundState) {
            throw new Error('AccessibleDragDrop requires playgroundState');
        }
        
        this.playgroundState = playgroundState;
        this.draggedElement = null;
        this.dropIndicator = null;
        this.eventHandlers = new Map();
        this.container = null;
        this.liveRegion = null;
        this.initialized = false;
        
        // Touch and keyboard state
        this.touchState = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            isDragging: false
        };
        
        // FIXED: Bind all methods to preserve context
        this.setupElementDrag = this.setupElementDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.initialize();
    }
    
    initialize() {
        try {
            console.log('🎯 Initializing AccessibleDragDrop...');
            
            // Create drop indicator
            this.dropIndicator = safeCreateElement('div', {
                className: 'drop-indicator',
                attributes: {
                    'aria-hidden': 'true'
                },
                styles: {
                    position: 'absolute',
                    width: '4px',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    borderRadius: '9999px',
                    opacity: '0',
                    transition: 'all 0.3s ease',
                    alignSelf: 'stretch',
                    zIndex: '1000',
                    boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)'
                }
            });
            
            // Set up live region for accessibility
            this.liveRegion = safeCreateElement('div', {
                attributes: {
                    'aria-live': 'assertive',
                    'aria-atomic': 'true',
                    id: 'drag-drop-announcer'
                },
                className: 'sr-only',
                styles: {
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }
            });
            
            if (this.liveRegion && document.body) {
                document.body.appendChild(this.liveRegion);
            }
            
            this.initialized = true;
            console.log('✅ AccessibleDragDrop initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing AccessibleDragDrop:', error);
            if (window.globalErrorBoundary) {
                window.globalErrorBoundary.handleError(error, { 
                    component: 'AccessibleDragDrop', 
                    method: 'initialize' 
                });
            }
        }
    }
    
    /**
     * Setup drag functionality for an element
     * @param {Element} element - Element to make draggable
     * @returns {Element|null} The element or null if failed
     */
    setupElementDrag(element) {
        // FIXED: Comprehensive validation
        if (!element || !(element instanceof HTMLElement)) {
            console.error('AccessibleDragDrop.setupElementDrag: Invalid element provided', element);
            return null;
        }
        
        if (!this.initialized) {
            console.error('AccessibleDragDrop not initialized');
            return null;
        }
        
        try {
            // Make element draggable
            element.setAttribute('draggable', 'true');
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            element.setAttribute('aria-grabbed', 'false');
            
            const description = this.getElementDescription(element);
            element.setAttribute('aria-label', `Draggable item: ${description}. Press space or enter to grab, arrow keys to move, space or enter to drop.`);
            
            // Add visual indicator for keyboard users
            this.addKeyboardVisualIndicators(element);
            
            // Add event listeners with proper context binding
            this.addEventHandler(element, 'dragstart', this.handleDragStart);
            this.addEventHandler(element, 'dragend', this.handleDragEnd);
            this.addEventHandler(element, 'keydown', this.handleKeyboardNavigation);
            
            // Touch events for mobile support
            if (supportsTouchEvents()) {
                this.addEventHandler(element, 'touchstart', this.handleTouchStart, { passive: false });
                this.addEventHandler(element, 'touchmove', this.handleTouchMove, { passive: false });
                this.addEventHandler(element, 'touchend', this.handleTouchEnd);
            }
            
            console.log('✅ Element drag setup complete:', description);
            return element;
            
        } catch (error) {
            console.error('❌ Error setting up element drag:', error);
            if (window.globalErrorBoundary) {
                window.globalErrorBoundary.handleError(error, { 
                    component: 'AccessibleDragDrop', 
                    method: 'setupElementDrag' 
                });
            }
            return null;
        }
    }
    
    /**
     * Initialize container for drag and drop
     * @param {Element} container - Container element
     * @returns {boolean} Success
     */
    initializeContainer(container) {
        if (!container || !(container instanceof HTMLElement)) {
            console.error('AccessibleDragDrop.initializeContainer: Invalid container provided');
            return false;
        }
        
        try {
            this.container = container;
            
            // Add container event listeners
            this.addEventHandler(container, 'dragover', this.handleDragOver);
            this.addEventHandler(container, 'dragleave', this.handleDragLeave);
            this.addEventHandler(container, 'drop', this.handleDrop);
            
            // Setup existing draggable elements
            const existingElements = safeQuerySelectorAll('[draggable="true"]', container);
            let setupCount = 0;
            
            existingElements.forEach(element => {
                if (this.setupElementDrag(element)) {
                    setupCount++;
                }
            });
            
            console.log(`✅ Container initialized with ${setupCount} draggable elements`);
            return true;
            
        } catch (error) {
            console.error('❌ Error initializing container:', error);
            if (window.globalErrorBoundary) {
                window.globalErrorBoundary.handleError(error, { 
                    component: 'AccessibleDragDrop', 
                    method: 'initializeContainer' 
                });
            }
            return false;
        }
    }
    
    /**
     * Add event handler with cleanup tracking
     * @param {Element} element - Element to add handler to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventHandler(element, event, handler, options = {}) {
        try {
            const cleanup = safeAddEventListener(element, event, handler, options);
            
            // Track for cleanup
            if (!this.eventHandlers.has(element)) {
                this.eventHandlers.set(element, []);
            }
            this.eventHandlers.get(element).push({ event, handler, cleanup });
            
        } catch (error) {
            console.error('❌ Error adding event handler:', error);
        }
    }
    
    /**
     * Add visual indicators for keyboard users
     * @param {Element} element - Element to enhance
     */
    addKeyboardVisualIndicators(element) {
        try {
            // Add CSS classes for enhanced keyboard navigation
            element.classList.add('keyboard-draggable');
            
            // Add focus styles
            const focusHandler = () => element.classList.add('keyboard-focus');
            const blurHandler = () => element.classList.remove('keyboard-focus');
            
            this.addEventHandler(element, 'focus', focusHandler);
            this.addEventHandler(element, 'blur', blurHandler);
            
        } catch (error) {
            console.error('Error adding keyboard visual indicators:', error);
        }
    }
    
    /**
     * Handle drag start event
     * @param {DragEvent} event - Drag event
     */
    handleDragStart(event) {
        try {
            this.draggedElement = event.target.closest('[draggable="true"]');
            if (!this.draggedElement) return;
            
            this.draggedElement.classList.add('dragging');
            this.draggedElement.setAttribute('aria-grabbed', 'true');
            
            // Set drag data
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', this.draggedElement.outerHTML);
            event.dataTransfer.setData('text/plain', this.getElementDescription(this.draggedElement));
            
            // Update state
            this.playgroundState.setState(prevState => ({
                ...prevState,
                dragState: { 
                    ...prevState.dragState,
                    draggedElement: this.draggedElement, 
                    isDragging: true,
                    draggedIndex: this.getElementIndex(this.draggedElement)
                }
            }), { skipUndo: true });
            
            const description = this.getElementDescription(this.draggedElement);
            this.announce(`Started dragging ${description}. Move to desired location and release.`);
            
            // Add ghost image styling
            setTimeout(() => {
                if (this.draggedElement) {
                    this.draggedElement.style.opacity = '0.5';
                }
            }, 0);
            
        } catch (error) {
            console.error('❌ Error in handleDragStart:', error);
        }
    }
    
    /**
     * Handle drag end event
     * @param {DragEvent} event - Drag event
     */
    handleDragEnd(event) {
        try {
            if (this.draggedElement) {
                this.draggedElement.classList.remove('dragging');
                this.draggedElement.setAttribute('aria-grabbed', 'false');
                this.draggedElement.style.opacity = '';
                this.removeDropIndicator();
                
                const description = this.getElementDescription(this.draggedElement);
                this.announce(`Finished dragging ${description}`);
                
                this.draggedElement = null;
            }
            
            if (this.container) {
                this.container.classList.remove('drag-over');
            }
            
            // Update state
            this.playgroundState.setState(prevState => ({
                ...prevState,
                dragState: { 
                    ...prevState.dragState,
                    draggedElement: null, 
                    isDragging: false,
                    draggedIndex: null,
                    dropTarget: null
                }
            }), { skipUndo: true });
            
        } catch (error) {
            console.error('❌ Error in handleDragEnd:', error);
        }
    }
    
    /**
     * Handle drag over event
     * @param {DragEvent} event - Drag event
     */
    handleDragOver(event) {
        if (!this.draggedElement) return;
        
        try {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            
            if (this.container) {
                this.container.classList.add('drag-over');
            }
            
            const rect = this.container.getBoundingClientRect();
            const afterElement = this.getDragAfterElement(
                event.clientX - rect.left, 
                event.clientY - rect.top
            );
            
            this.showDropIndicator(afterElement);
            
        } catch (error) {
            console.error('❌ Error in handleDragOver:', error);
        }
    }
    
    /**
     * Handle drag leave event
     * @param {DragEvent} event - Drag event
     */
    handleDragLeave(event) {
        try {
            if (this.container && !this.container.contains(event.relatedTarget)) {
                this.container.classList.remove('drag-over');
                this.removeDropIndicator();
            }
        } catch (error) {
            console.error('❌ Error in handleDragLeave:', error);
        }
    }
    
    /**
     * Handle drop event
     * @param {DragEvent} event - Drag event
     */
    handleDrop(event) {
        try {
            event.preventDefault();
            
            if (this.container) {
                this.container.classList.remove('drag-over');
            }
            this.removeDropIndicator();
            
            if (this.draggedElement) {
                const rect = this.container.getBoundingClientRect();
                const afterElement = this.getDragAfterElement(
                    event.clientX - rect.left, 
                    event.clientY - rect.top
                );
                
                this.performDrop(afterElement);
            }
            
        } catch (error) {
            console.error('❌ Error in handleDrop:', error);
        }
    }
    
    /**
     * Get element that should come after the dragged element
     * @param {number} x - X coordinate relative to container
     * @param {number} y - Y coordinate relative to container
     * @returns {Element|null} Element to insert before
     */
    getDragAfterElement(x, y) {
        if (!this.container) return null;
        
        try {
            const draggableElements = Array.from(
                safeQuerySelectorAll('[draggable="true"]:not(.dragging)', this.container)
            );
            
            if (draggableElements.length === 0) return null;
            
            const containerStyles = getComputedStyleProperty(this.container, 'flex-direction');
            const isVertical = containerStyles.includes('column');
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const containerRect = this.container.getBoundingClientRect();
                
                // Calculate relative position
                const childX = box.left - containerRect.left + box.width / 2;
                const childY = box.top - containerRect.top + box.height / 2;
                
                const offset = isVertical 
                    ? y - childY
                    : x - childX;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
            
        } catch (error) {
            console.error('❌ Error in getDragAfterElement:', error);
            return null;
        }
    }
    
    /**
     * Show drop indicator at position
     * @param {Element|null} afterElement - Element to show indicator before
     */
    showDropIndicator(afterElement) {
        try {
            this.removeDropIndicator();
            
            if (!this.container || !this.dropIndicator) return;
            
            if (afterElement) {
                afterElement.parentNode.insertBefore(this.dropIndicator, afterElement);
            } else {
                this.container.appendChild(this.dropIndicator);
            }
            
            rafBatch(() => {
                if (this.dropIndicator) {
                    this.dropIndicator.style.opacity = '1';
                    this.dropIndicator.style.transform = 'scale(1.2)';
                    this.dropIndicator.classList.add('show');
                }
            });
            
        } catch (error) {
            console.error('❌ Error in showDropIndicator:', error);
        }
    }
    
    /**
     * Remove drop indicator
     */
    removeDropIndicator() {
        try {
            if (this.dropIndicator) {
                this.dropIndicator.style.opacity = '0';
                this.dropIndicator.style.transform = 'scale(1)';
                this.dropIndicator.classList.remove('show');
                
                if (this.dropIndicator.parentNode) {
                    this.dropIndicator.parentNode.removeChild(this.dropIndicator);
                }
            }
        } catch (error) {
            console.error('❌ Error in removeDropIndicator:', error);
        }
    }
    
    /**
     * Perform the actual drop operation
     * @param {Element|null} afterElement - Element to insert before
     */
    performDrop(afterElement) {
        try {
            if (!this.draggedElement || !this.container) return;
            
            const oldIndex = this.getElementIndex(this.draggedElement);
            
            if (afterElement == null) {
                this.container.appendChild(this.draggedElement);
            } else {
                this.container.insertBefore(this.draggedElement, afterElement);
            }
            
            const newIndex = this.getElementIndex(this.draggedElement);
            
            // Animate the drop
            this.animateDrop(this.draggedElement);
            
            const description = this.getElementDescription(this.draggedElement);
            this.announce(`Dropped ${description} in new position (${newIndex + 1})`);
            
            // Update state with new order
            this.updateElementOrder();
            
        } catch (error) {
            console.error('❌ Error in performDrop:', error);
        }
    }
    
    /**
     * Animate drop with smooth transition
     * @param {Element} element - Element to animate
     */
    animateDrop(element) {
        try {
            if (!element) return;
            
            // Simple scale animation
            const originalTransform = element.style.transform;
            const originalTransition = element.style.transition;
            
            element.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    element.style.transform = originalTransform;
                    element.style.transition = originalTransition;
                }, 200);
            }, 50);
            
        } catch (error) {
            console.error('❌ Error in animateDrop:', error);
        }
    }
    
    /**
     * Handle keyboard navigation for drag and drop
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardNavigation(event) {
        try {
            const element = event.target.closest('[draggable="true"]');
            if (!element) return;

            const isGrabbed = element.getAttribute('aria-grabbed') === 'true';

            switch(event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    if (isGrabbed) {
                        this.moveElement(element, -1);
                    } else {
                        this.focusAdjacentElement(element, -1);
                    }
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    if (isGrabbed) {
                        this.moveElement(element, 1);
                    } else {
                        this.focusAdjacentElement(element, 1);
                    }
                    break;
                    
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.toggleGrabState(element);
                    break;
                    
                case 'Escape':
                    if (isGrabbed) {
                        this.releaseElement(element);
                    }
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    if (isGrabbed) {
                        this.moveElementToPosition(element, 0);
                    }
                    break;
                    
                case 'End':
                    event.preventDefault();
                    if (isGrabbed) {
                        this.moveElementToEnd(element);
                    }
                    break;
            }
        } catch (error) {
            console.error('❌ Error in handleKeyboardNavigation:', error);
        }
    }
    
    /**
     * Move element relative to its current position
     * @param {Element} element - Element to move
     * @param {number} direction - Direction (-1 for backward, 1 for forward)
     */
    moveElement(element, direction) {
        try {
            if (!this.container) return;
            
            const siblings = Array.from(this.container.children).filter(child => 
                child.matches('[draggable="true"]') && child !== this.dropIndicator
            );
            
            const currentIndex = siblings.indexOf(element);
            const newIndex = Math.max(0, Math.min(siblings.length - 1, currentIndex + direction));
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < siblings.length) {
                const targetElement = siblings[newIndex];
                
                if (direction > 0) {
                    // Moving forward
                    if (targetElement.nextSibling) {
                        this.container.insertBefore(element, targetElement.nextSibling);
                    } else {
                        this.container.appendChild(element);
                    }
                } else {
                    // Moving backward
                    this.container.insertBefore(element, targetElement);
                }
                
                element.focus();
                this.animateDrop(element);
                
                const description = this.getElementDescription(element);
                const newPosition = this.getElementIndex(element) + 1;
                this.announce(`Moved ${description} ${direction > 0 ? 'forward' : 'backward'} to position ${newPosition}`);
                
                // Update element order in state
                this.updateElementOrder();
            }
            
        } catch (error) {
            console.error('❌ Error in moveElement:', error);
        }
    }
    
    /**
     * Focus adjacent element for keyboard navigation
     * @param {Element} element - Current element
     * @param {number} direction - Direction to move focus
     */
    focusAdjacentElement(element, direction) {
        try {
            if (!this.container) return;
            
            const focusableElements = Array.from(
                safeQuerySelectorAll('[draggable="true"][tabindex="0"]', this.container)
            );
            
            const currentIndex = focusableElements.indexOf(element);
            const newIndex = currentIndex + direction;
            
            if (newIndex >= 0 && newIndex < focusableElements.length) {
                focusableElements[newIndex].focus();
            }
            
        } catch (error) {
            console.error('❌ Error in focusAdjacentElement:', error);
        }
    }
    
    /**
     * Toggle grab state for keyboard users
     * @param {Element} element - Element to toggle
     */
    toggleGrabState(element) {
        try {
            const isGrabbed = element.getAttribute('aria-grabbed') === 'true';
            element.setAttribute('aria-grabbed', isGrabbed ? 'false' : 'true');
            
            const description = this.getElementDescription(element);
            
            if (isGrabbed) {
                element.classList.remove('keyboard-grabbed');
                this.announce(`Released ${description}`);
            } else {
                element.classList.add('keyboard-grabbed');
                this.announce(`Grabbed ${description}. Use arrow keys to move, Enter to drop, Escape to cancel`);
            }
            
        } catch (error) {
            console.error('❌ Error in toggleGrabState:', error);
        }
    }
    
    /**
     * Release grabbed element
     * @param {Element} element - Element to release
     */
    releaseElement(element) {
        try {
            element.setAttribute('aria-grabbed', 'false');
            element.classList.remove('keyboard-grabbed');
            
            const description = this.getElementDescription(element);
            this.announce(`Cancelled dragging ${description}`);
            
        } catch (error) {
            console.error('❌ Error in releaseElement:', error);
        }
    }
    
    /**
     * Move element to specific position
     * @param {Element} element - Element to move
     * @param {number} position - Target position (0-based)
     */
    moveElementToPosition(element, position) {
        try {
            if (!this.container) return;
            
            const siblings = Array.from(this.container.children).filter(child => 
                child.matches('[draggable="true"]') && child !== this.dropIndicator
            );
            
            const targetElement = siblings[position];
            
            if (targetElement && targetElement !== element) {
                this.container.insertBefore(element, targetElement);
                element.focus();
                this.animateDrop(element);
                
                const description = this.getElementDescription(element);
                this.announce(`Moved ${description} to beginning`);
                
                this.updateElementOrder();
            }
            
        } catch (error) {
            console.error('❌ Error in moveElementToPosition:', error);
        }
    }
    
    /**
     * Move element to end
     * @param {Element} element - Element to move
     */
    moveElementToEnd(element) {
        try {
            if (!this.container) return;
            
            this.container.appendChild(element);
            element.focus();
            this.animateDrop(element);
            
            const description = this.getElementDescription(element);
            this.announce(`Moved ${description} to end`);
            
            this.updateElementOrder();
            
        } catch (error) {
            console.error('❌ Error in moveElementToEnd:', error);
        }
    }
    
    /**
     * Handle touch start for mobile devices
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        try {
            if (event.touches.length !== 1) return;
            
            const touch = event.touches[0];
            this.touchState = {
                startX: touch.clientX,
                startY: touch.clientY,
                currentX: touch.clientX,
                currentY: touch.clientY,
                isDragging: false
            };
            
            // Start drag after delay to distinguish from scroll
            this.touchStartTimeout = setTimeout(() => {
                this.touchState.isDragging = true;
                event.target.classList.add('touch-dragging');
                this.draggedElement = event.target.closest('[draggable="true"]');
                
                if (this.draggedElement) {
                    this.announce('Touch drag started. Move to reposition.');
                }
            }, 150);
            
        } catch (error) {
            console.error('❌ Error in handleTouchStart:', error);
        }
    }
    
    /**
     * Handle touch move for mobile devices
     * @param {TouchEvent} event - Touch event
     */
    handleTouchMove(event) {
        try {
            if (!this.touchState.isDragging || event.touches.length !== 1) return;
            
            event.preventDefault(); // Prevent scrolling
            
            const touch = event.touches[0];
            this.touchState.currentX = touch.clientX;
            this.touchState.currentY = touch.clientY;
            
            // Update visual feedback
            if (this.draggedElement) {
                const deltaX = touch.clientX - this.touchState.startX;
                const deltaY = touch.clientY - this.touchState.startY;
                
                this.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
                this.draggedElement.style.zIndex = '1000';
                this.draggedElement.style.opacity = '0.8';
            }
            
        } catch (error) {
            console.error('❌ Error in handleTouchMove:', error);
        }
    }
    
    /**
     * Handle touch end for mobile devices
     * @param {TouchEvent} event - Touch event
     */
    handleTouchEnd(event) {
        try {
            if (this.touchStartTimeout) {
                clearTimeout(this.touchStartTimeout);
            }
            
            if (this.touchState.isDragging && this.draggedElement) {
                // Reset visual styles
                this.draggedElement.style.transform = '';
                this.draggedElement.style.zIndex = '';
                this.draggedElement.style.opacity = '';
                this.draggedElement.classList.remove('touch-dragging');
                
                // Find drop target
                const touch = event.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropTarget = elementBelow?.closest('.demo-flex-container');
                
                if (dropTarget && dropTarget === this.container) {
                    this.performTouchDrop(touch.clientX, touch.clientY);
                }
                
                const description = this.getElementDescription(this.draggedElement);
                this.announce(`Touch drag completed for ${description}`);
                
                this.draggedElement = null;
            }
            
            this.touchState = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                isDragging: false
            };
            
        } catch (error) {
            console.error('❌ Error in handleTouchEnd:', error);
        }
    }
    
    /**
     * Perform drop for touch interaction
     * @param {number} x - Touch X coordinate
     * @param {number} y - Touch Y coordinate
     */
    performTouchDrop(x, y) {
        try {
            if (!this.container || !this.draggedElement) return;
            
            const rect = this.container.getBoundingClientRect();
            const afterElement = this.getDragAfterElement(
                x - rect.left, 
                y - rect.top
            );
            
            this.performDrop(afterElement);
            
        } catch (error) {
            console.error('❌ Error in performTouchDrop:', error);
        }
    }
    
    /**
     * Get element description for announcements
     * @param {Element} element - Element to describe
     * @returns {string} Element description
     */
    getElementDescription(element) {
        try {
            if (!element) return 'unknown element';
            
            const type = element.getAttribute('data-type') || 'item';
            const heading = element.querySelector('h4, h3, h2, h1');
            const text = heading?.textContent || 
                        element.querySelector('p')?.textContent || 
                        element.querySelector('img')?.alt || 
                        element.textContent ||
                        `${type} element`;
            
            return text.slice(0, 50).trim(); // Limit length for screen readers
            
        } catch (error) {
            console.error('❌ Error in getElementDescription:', error);
            return 'unknown element';
        }
    }
    
    /**
     * Get element index in container
     * @param {Element} element - Element to find index for
     * @returns {number} Element index
     */
    getElementIndex(element) {
        try {
            if (!this.container || !element) return -1;
            
            const siblings = Array.from(this.container.children).filter(child => 
                child.matches('[draggable="true"]') && child !== this.dropIndicator
            );
            
            return siblings.indexOf(element);
            
        } catch (error) {
            console.error('❌ Error in getElementIndex:', error);
            return -1;
        }
    }
    
    /**
     * Update element order in state
     */
    updateElementOrder() {
        try {
            if (!this.container) return;
            
            const elements = Array.from(this.container.children).filter(child => 
                child.matches('[draggable="true"]') && child !== this.dropIndicator  
            );
            
            // Update state with new order if needed
            if (this.playgroundState) {
                this.playgroundState.setState(prevState => ({
                    ...prevState,
                    hasUnsavedChanges: true
                }), { skipUndo: true });
            }
            
        } catch (error) {
            console.error('❌ Error in updateElementOrder:', error);
        }
    }
    
    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announce(message) {
        try {
            if (this.liveRegion && typeof message === 'string') {
                this.liveRegion.textContent = message;
                
                // Clear after announcement to allow repeat announcements
                setTimeout(() => {
                    if (this.liveRegion) {
                        this.liveRegion.textContent = '';
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Error in announce:', error);
        }
    }
    
    /**
     * Get drag and drop statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            initialized: this.initialized,
            draggableElements: this.container ? 
                safeQuerySelectorAll('[draggable="true"]', this.container).length : 0,
            eventHandlers: this.eventHandlers.size,
            currentlyDragging: !!this.draggedElement,
            touchSupported: supportsTouchEvents()
        };
    }
    
    /**
     * Cleanup resources and event listeners
     */
    cleanup() {
        try {
            console.log('🧹 Cleaning up AccessibleDragDrop...');
            
            // Clear touch timeout
            if (this.touchStartTimeout) {
                clearTimeout(this.touchStartTimeout);
            }
            
            // Remove all event listeners
            this.eventHandlers.forEach((handlers, element) => {
                handlers.forEach(({ cleanup }) => {
                    if (typeof cleanup === 'function') {
                        cleanup();
                    }
                });
            });
            this.eventHandlers.clear();
            
            // Remove live region
            if (this.liveRegion && this.liveRegion.parentNode) {
                this.liveRegion.parentNode.removeChild(this.liveRegion);
            }
            
            // Remove drop indicator
            if (this.dropIndicator && this.dropIndicator.parentNode) {
                this.dropIndicator.parentNode.removeChild(this.dropIndicator);
            }
            
            // Reset state
            this.draggedElement = null;
            this.container = null;
            this.initialized = false;
            
            console.log('✅ AccessibleDragDrop cleaned up successfully');
            
        } catch (error) {
            console.error('❌ Error in AccessibleDragDrop cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AccessibleDragDrop = AccessibleDragDrop;
}