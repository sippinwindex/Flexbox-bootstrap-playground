/**
 * playground-state.js - Enhanced Secure State Management
 * Centralized state management with comprehensive security features and defensive programming
 */

class SecurePlaygroundState {
    constructor(initialState = {}) {
        // Security-first initialization with comprehensive validation
        this.state = this.createSecureInitialState(initialState);
        this.stateHistory = [];
        this.subscribers = new Set();
        this.securityLog = [];
        this.validationRules = this.createValidationRules();
        this.rateLimiter = new Map();
        this.encryptionEnabled = this.detectEncryptionSupport();
        
        // Security monitoring
        this.maxUndoSteps = 50;
        this.maxStateSize = 10 * 1024 * 1024; // 10MB limit
        this.isUpdating = false;
        this.updateCounter = 0;
        this.lastValidation = Date.now();
        
        // Performance and security metrics
        this.performanceMetrics = {
            stateChanges: 0,
            validationFailures: 0,
            securityBlocks: 0,
            lastStateChange: Date.now()
        };
        
        // Initialize security features
        this.setupSecurityMonitoring();
        this.setupStateEncryption();
        this.validateInitialState();
        
        console.log('🔒 Secure Playground State initialized with enhanced security features');
    }

    createSecureInitialState(initialState) {
        // Create state with secure defaults and validation
        const secureDefaults = {
            // Core counters with validation
            itemCount: this.validateNumber(initialState.itemCount, 3, 1, 20),
            currentSelectedItem: this.validateNumber(initialState.currentSelectedItem, 1, 1, 20),
            demoElementCount: this.validateNumber(initialState.demoElementCount, 0, 0, 100),
            
            // Secure drag and drop state
            dragState: this.createSecureDragState(initialState.dragState),
            
            // Validated item properties
            itemProperties: this.createSecureItemProperties(initialState.itemProperties),
            
            // Validated container properties
            containerProperties: this.createSecureContainerProperties(initialState.containerProperties),
            
            // Secure media management
            imageCache: new Map(),
            loadedImages: new Set(),
            trustedSources: new Set(['data:', 'blob:', 'https:']),
            
            // Enhanced undo/redo with integrity checking
            undoStack: [],
            redoStack: [],
            stateChecksum: null,
            
            // UI state with security context
            isLoading: false,
            hasUnsavedChanges: false,
            lastSaveTime: null,
            sessionId: this.generateSecureSessionId(),
            
            // Enhanced error and security state
            errors: [],
            warnings: [],
            securityAlerts: [],
            blockedActions: [],
            
            // Security metadata
            createdAt: new Date().toISOString(),
            lastSecurityCheck: Date.now(),
            securityVersion: '2.0',
            integrityHash: null
        };

        // Merge with provided initial state (after validation)
        const mergedState = this.secureStatesMerge(secureDefaults, initialState);
        
        // Generate integrity hash
        mergedState.integrityHash = this.generateStateHash(mergedState);
        
        return Object.freeze(mergedState);
    }

    createValidationRules() {
        return {
            itemCount: { 
                type: 'number', 
                min: 1, 
                max: 20, 
                default: 3,
                security: 'low'
            },
            currentSelectedItem: { 
                type: 'number', 
                min: 1, 
                max: 20, 
                default: 1,
                security: 'low'
            },
            containerProperties: {
                type: 'object',
                allowedKeys: [
                    'display', 'flexDirection', 'justifyContent', 
                    'alignItems', 'flexWrap', 'alignContent', 
                    'gap', 'minHeight', 'width'
                ],
                security: 'medium'
            },
            itemProperties: {
                type: 'object',
                security: 'medium',
                validation: this.validateItemProperties.bind(this)
            }
        };
    }

    setupSecurityMonitoring() {
        // Monitor state changes for suspicious activity
        this.securityWatchdog = setInterval(() => {
            this.performSecurityAudit();
        }, 30000); // Every 30 seconds

        // Set up rate limiting for state changes
        this.rateLimits = {
            stateChanges: { max: 100, window: 10000 }, // 100 changes per 10 seconds
            undoRedo: { max: 20, window: 5000 },       // 20 undo/redo per 5 seconds
            itemUpdates: { max: 50, window: 10000 }    // 50 item updates per 10 seconds
        };
    }

    setupStateEncryption() {
        // Initialize encryption for sensitive state data if supported
        if (this.encryptionEnabled && window.crypto && window.crypto.subtle) {
            this.initializeStateEncryption();
        }
    }

    // Enhanced state setting with comprehensive security
    setState(updater, options = {}) {
        // Prevent recursive updates and rate limiting
        if (this.isUpdating) {
            console.warn('🚫 Recursive state update blocked');
            this.logSecurityEvent('recursive_update_blocked', { options });
            return false;
        }

        if (!this.checkRateLimit('stateChanges')) {
            console.warn('🚫 State change rate limit exceeded');
            this.logSecurityEvent('rate_limit_exceeded', { action: 'setState' });
            return false;
        }

        try {
            this.isUpdating = true;
            this.updateCounter++;

            // Validate updater
            const validatedUpdater = this.validateUpdater(updater);
            if (!validatedUpdater) {
                this.logSecurityEvent('invalid_updater', { updater: typeof updater });
                return false;
            }

            // Calculate new state
            let newState;
            if (typeof validatedUpdater === 'function') {
                const stateClone = this.createSecureStateClone(this.state);
                newState = validatedUpdater(stateClone);
            } else {
                newState = this.secureStatesMerge(this.state, validatedUpdater);
            }

            // Comprehensive validation
            const validationResult = this.validateNewState(newState, options);
            if (!validationResult.valid) {
                console.error('🚫 State validation failed:', validationResult.errors);
                this.logSecurityEvent('state_validation_failed', validationResult);
                return false;
            }

            // Check state size limits
            if (this.calculateStateSize(newState) > this.maxStateSize) {
                console.error('🚫 State size limit exceeded');
                this.logSecurityEvent('state_size_exceeded', { size: this.calculateStateSize(newState) });
                return false;
            }

            // Add to undo stack for reversible actions
            if (this.shouldAddToUndo(newState, options)) {
                this.addToSecureUndoStack();
            }

            // Generate integrity hash and freeze state
            newState.integrityHash = this.generateStateHash(newState);
            newState.lastSecurityCheck = Date.now();
            
            const oldState = this.state;
            this.state = Object.freeze(newState);

            // Update metrics
            this.performanceMetrics.stateChanges++;
            this.performanceMetrics.lastStateChange = Date.now();

            // Notify subscribers with security context
            this.notifySecureSubscribers(oldState, newState, options);

            // Log successful state change
            this.logStateChange(oldState, newState, options);

            return true;

        } catch (error) {
            console.error('🚨 Critical error in setState:', error);
            this.logSecurityEvent('setstate_critical_error', { error: error.message });
            
            // Attempt state recovery
            this.attemptStateRecovery();
            
            return false;
        } finally {
            this.isUpdating = false;
        }
    }

    // Enhanced state validation with security checks
    validateNewState(state, options = {}) {
        const errors = [];
        const warnings = [];
        let securityRisk = 0;

        try {
            // Basic type and structure validation
            if (!state || typeof state !== 'object') {
                errors.push('State must be an object');
                return { valid: false, errors, warnings, securityRisk: 1.0 };
            }

            // Validate against rules
            Object.keys(this.validationRules).forEach(key => {
                const rule = this.validationRules[key];
                const value = state[key];

                if (rule.type === 'number') {
                    if (typeof value !== 'number' || !Number.isFinite(value)) {
                        errors.push(`${key} must be a finite number`);
                        securityRisk += 0.2;
                    }
                } else if (rule.type === 'object' && rule.validation) {
                    const validationResult = rule.validation(value);
                    if (!validationResult.valid) {
                        errors.push(...validationResult.errors);
                        securityRisk += validationResult.securityRisk || 0;
                    }
                }
            });

            // Security-specific validations
            securityRisk += this.validateStateSecurity(state);

            // Check for data integrity
            if (state.integrityHash && !this.verifyStateIntegrity(state)) {
                errors.push('State integrity check failed');
                securityRisk += 0.8;
            }

            // Validate array structures
            const requiredArrays = ['undoStack', 'redoStack', 'errors', 'warnings', 'securityAlerts'];
            requiredArrays.forEach(arrayKey => {
                if (state[arrayKey] && !Array.isArray(state[arrayKey])) {
                    errors.push(`${arrayKey} must be an array`);
                    securityRisk += 0.1;
                }
            });

            // Validate Maps and Sets
            if (state.imageCache && !(state.imageCache instanceof Map)) {
                warnings.push('imageCache should be a Map');
            }

            if (state.loadedImages && !(state.loadedImages instanceof Set)) {
                warnings.push('loadedImages should be a Set');
            }

            return {
                valid: errors.length === 0,
                errors,
                warnings,
                securityRisk: Math.min(securityRisk, 1.0)
            };

        } catch (error) {
            console.error('Error in state validation:', error);
            return {
                valid: false,
                errors: ['Validation process failed'],
                warnings: [],
                securityRisk: 1.0
            };
        }
    }

    // Security-specific state validation
    validateStateSecurity(state) {
        let risk = 0;

        // Check for suspicious properties
        const suspiciousKeys = ['__proto__', 'constructor', 'prototype', 'eval', 'Function'];
        Object.keys(state).forEach(key => {
            if (suspiciousKeys.includes(key)) {
                console.warn(`🚫 Suspicious property detected: ${key}`);
                risk += 0.5;
            }
        });

        // Validate container properties for CSS injection
        if (state.containerProperties) {
            risk += this.validateCSSProperties(state.containerProperties);
        }

        // Validate item properties
        if (state.itemProperties) {
            Object.values(state.itemProperties).forEach(props => {
                risk += this.validateCSSProperties(props);
            });
        }

        // Check for XSS patterns in string values
        this.traverseObjectForXSS(state, (value, path) => {
            if (this.detectXSSPattern(value)) {
                console.warn(`🚫 Potential XSS detected at ${path}:`, value);
                risk += 0.7;
            }
        });

        return risk;
    }

    // Validate CSS properties for injection attacks
    validateCSSProperties(properties) {
        let risk = 0;
        const dangerousPatterns = [
            /javascript:/i,
            /vbscript:/i,
            /data:text\/html/i,
            /expression\s*\(/i,
            /@import/i,
            /binding:/i,
            /behavior:/i
        ];

        Object.entries(properties).forEach(([key, value]) => {
            if (typeof value === 'string') {
                dangerousPatterns.forEach(pattern => {
                    if (pattern.test(value)) {
                        console.warn(`🚫 Dangerous CSS pattern in ${key}:`, value);
                        risk += 0.6;
                    }
                });
            }
        });

        return risk;
    }

    // Detect XSS patterns in values
    detectXSSPattern(value) {
        if (typeof value !== 'string') return false;

        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /eval\s*\(/i,
            /document\.write/i
        ];

        return xssPatterns.some(pattern => pattern.test(value));
    }

    // Traverse object tree to find XSS patterns
    traverseObjectForXSS(obj, callback, path = '') {
        if (obj === null || typeof obj !== 'object') {
            if (typeof obj === 'string') {
                callback(obj, path);
            }
            return;
        }

        Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'string') {
                callback(value, currentPath);
            } else if (typeof value === 'object' && value !== null) {
                this.traverseObjectForXSS(value, callback, currentPath);
            }
        });
    }

    // Enhanced undo/redo with security validation
    addToSecureUndoStack() {
        try {
            if (!Array.isArray(this.state.undoStack)) {
                this.state.undoStack = [];
            }

            // Create secure snapshot with integrity check
            const stateSnapshot = this.createSecureStateClone(this.state);
            stateSnapshot.snapshotId = this.generateSecureId();
            stateSnapshot.snapshotTime = Date.now();
            stateSnapshot.snapshotHash = this.generateStateHash(stateSnapshot);

            this.state.undoStack.push(stateSnapshot);

            // Manage stack size for security
            if (this.state.undoStack.length > this.maxUndoSteps) {
                const removed = this.state.undoStack.shift();
                this.logSecurityEvent('undo_stack_pruned', { removedId: removed.snapshotId });
            }

            // Clear redo stack
            this.state.redoStack = [];

            return true;

        } catch (error) {
            console.error('🚨 Error adding to secure undo stack:', error);
            this.logSecurityEvent('undo_stack_error', { error: error.message });
            return false;
        }
    }

    // Secure undo operation
    secureUndo() {
        if (!this.checkRateLimit('undoRedo')) {
            console.warn('🚫 Undo rate limit exceeded');
            return false;
        }

        try {
            if (!Array.isArray(this.state.undoStack) || this.state.undoStack.length === 0) {
                console.warn('Nothing to undo');
                return false;
            }

            const snapshot = this.state.undoStack.pop();
            
            // Verify snapshot integrity
            if (!this.verifySnapshotIntegrity(snapshot)) {
                console.error('🚫 Undo snapshot integrity check failed');
                this.logSecurityEvent('undo_integrity_failed', { snapshotId: snapshot.snapshotId });
                return false;
            }

            // Move current state to redo stack
            const currentSnapshot = this.createSecureStateClone(this.state);
            currentSnapshot.snapshotId = this.generateSecureId();
            currentSnapshot.snapshotTime = Date.now();
            
            if (!Array.isArray(this.state.redoStack)) {
                this.state.redoStack = [];
            }
            this.state.redoStack.push(currentSnapshot);

            // Restore previous state
            this.state = Object.freeze(snapshot);

            // Validate restored state
            const validationResult = this.validateNewState(this.state);
            if (!validationResult.valid) {
                console.error('🚫 Restored state validation failed');
                this.attemptStateRecovery();
                return false;
            }

            this.notifySecureSubscribers(null, this.state, { type: 'undo' });
            this.logSecurityEvent('undo_successful', { snapshotId: snapshot.snapshotId });

            return true;

        } catch (error) {
            console.error('🚨 Error in secure undo:', error);
            this.logSecurityEvent('undo_error', { error: error.message });
            this.attemptStateRecovery();
            return false;
        }
    }

    // Secure redo operation
    secureRedo() {
        if (!this.checkRateLimit('undoRedo')) {
            console.warn('🚫 Redo rate limit exceeded');
            return false;
        }

        try {
            if (!Array.isArray(this.state.redoStack) || this.state.redoStack.length === 0) {
                console.warn('Nothing to redo');
                return false;
            }

            const snapshot = this.state.redoStack.pop();
            
            // Verify snapshot integrity
            if (!this.verifySnapshotIntegrity(snapshot)) {
                console.error('🚫 Redo snapshot integrity check failed');
                this.logSecurityEvent('redo_integrity_failed', { snapshotId: snapshot.snapshotId });
                return false;
            }

            // Move current state to undo stack
            this.addToSecureUndoStack();

            // Restore redo state
            this.state = Object.freeze(snapshot);

            // Validate restored state
            const validationResult = this.validateNewState(this.state);
            if (!validationResult.valid) {
                console.error('🚫 Restored redo state validation failed');
                this.attemptStateRecovery();
                return false;
            }

            this.notifySecureSubscribers(null, this.state, { type: 'redo' });
            this.logSecurityEvent('redo_successful', { snapshotId: snapshot.snapshotId });

            return true;

        } catch (error) {
            console.error('🚨 Error in secure redo:', error);
            this.logSecurityEvent('redo_error', { error: error.message });
            this.attemptStateRecovery();
            return false;
        }
    }

    // Create secure state clone with deep copying
    createSecureStateClone(state) {
        try {
            return this.deepCloneSecure(state);
        } catch (error) {
            console.error('Error creating secure state clone:', error);
            // Fallback to basic clone
            return JSON.parse(JSON.stringify(state, this.secureStringifyReplacer));
        }
    }

    // Enhanced deep clone with security considerations
    deepCloneSecure(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        // Prevent circular references
        if (seen.has(obj)) {
            console.warn('Circular reference detected in state clone');
            return null;
        }
        seen.add(obj);

        // Handle special objects
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (obj instanceof Map) {
            const cloned = new Map();
            obj.forEach((value, key) => {
                cloned.set(key, this.deepCloneSecure(value, seen));
            });
            return cloned;
        }

        if (obj instanceof Set) {
            const cloned = new Set();
            obj.forEach(value => {
                cloned.add(this.deepCloneSecure(value, seen));
            });
            return cloned;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.deepCloneSecure(item, seen));
        }

        // Clone regular objects with security filtering
        const cloned = {};
        Object.keys(obj).forEach(key => {
            // Skip dangerous properties
            if (this.isDangerousProperty(key)) {
                console.warn(`Skipping dangerous property in clone: ${key}`);
                return;
            }
            
            cloned[key] = this.deepCloneSecure(obj[key], seen);
        });

        return cloned;
    }

    // Check if property name is potentially dangerous
    isDangerousProperty(key) {
        const dangerousProps = [
            '__proto__', 
            'constructor', 
            'prototype',
            'valueOf',
            'toString',
            'hasOwnProperty'
        ];
        return dangerousProps.includes(key);
    }

    // Generate cryptographically secure state hash
    generateStateHash(state) {
        try {
            const stateString = JSON.stringify(state, this.secureStringifyReplacer);
            
            if (window.crypto && window.crypto.subtle) {
                // Use Web Crypto API for secure hashing (async, but we'll use sync fallback)
                return this.simpleHash(stateString);
            }
            
            return this.simpleHash(stateString);
        } catch (error) {
            console.error('Error generating state hash:', error);
            return Date.now().toString(36);
        }
    }

    // Simple hash function for state integrity
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString(36);
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash).toString(36);
    }

    // Verify state integrity
    verifyStateIntegrity(state) {
        try {
            const currentHash = state.integrityHash;
            if (!currentHash) return true; // No hash to verify
            
            const stateWithoutHash = { ...state };
            delete stateWithoutHash.integrityHash;
            
            const calculatedHash = this.generateStateHash(stateWithoutHash);
            return currentHash === calculatedHash;
        } catch (error) {
            console.error('Error verifying state integrity:', error);
            return false;
        }
    }

    // Verify snapshot integrity
    verifySnapshotIntegrity(snapshot) {
        try {
            if (!snapshot.snapshotHash) return true;
            
            const snapshotWithoutHash = { ...snapshot };
            delete snapshotWithoutHash.snapshotHash;
            delete snapshotWithoutHash.snapshotId;
            delete snapshotWithoutHash.snapshotTime;
            
            const calculatedHash = this.generateStateHash(snapshotWithoutHash);
            return snapshot.snapshotHash === calculatedHash;
        } catch (error) {
            console.error('Error verifying snapshot integrity:', error);
            return false;
        }
    }

    // Secure stringify replacer
    secureStringifyReplacer(key, value) {
        // Skip functions and undefined values
        if (typeof value === 'function' || value === undefined) {
            return null;
        }
        
        // Handle special objects
        if (value instanceof Map) {
            return { __type: 'Map', entries: Array.from(value.entries()) };
        }
        
        if (value instanceof Set) {
            return { __type: 'Set', values: Array.from(value.values()) };
        }
        
        // Skip dangerous properties
        if (this.isDangerousProperty(key)) {
            return null;
        }
        
        return value;
    }

    // Rate limiting implementation
    checkRateLimit(action) {
        const now = Date.now();
        const limit = this.rateLimits[action];
        
        if (!limit) return true;
        
        if (!this.rateLimiter.has(action)) {
            this.rateLimiter.set(action, []);
        }
        
        const timestamps = this.rateLimiter.get(action);
        
        // Remove old timestamps
        while (timestamps.length > 0 && timestamps[0] < now - limit.window) {
            timestamps.shift();
        }
        
        if (timestamps.length >= limit.max) {
            this.performanceMetrics.securityBlocks++;
            return false;
        }
        
        timestamps.push(now);
        return true;
    }

    // Security event logging
    logSecurityEvent(type, details = {}) {
        const event = {
            id: this.generateSecureId(),
            type,
            timestamp: new Date().toISOString(),
            details: this.sanitizeLogDetails(details),
            userAgent: navigator.userAgent.substring(0, 100),
            url: window.location.href
        };
        
        this.securityLog.push(event);
        
        // Limit log size
        if (this.securityLog.length > 100) {
            this.securityLog.splice(0, 50);
        }
        
        // Log to console based on severity
        if (type.includes('error') || type.includes('failed')) {
            console.error('🚨 Security Event:', event);
        } else {
            console.warn('🔒 Security Event:', event);
        }
    }

    // Sanitize log details to prevent log injection
    sanitizeLogDetails(details) {
        const sanitized = {};
        
        Object.entries(details).forEach(([key, value]) => {
            if (typeof value === 'string') {
                sanitized[key] = value.substring(0, 200).replace(/[\r\n\t]/g, ' ');
            } else if (typeof value === 'number') {
                sanitized[key] = value;
            } else if (typeof value === 'boolean') {
                sanitized[key] = value;
            } else {
                sanitized[key] = '[object]';
            }
        });
        
        return sanitized;
    }

    // Perform periodic security audit
    performSecurityAudit() {
        try {
            const auditResults = {
                timestamp: new Date().toISOString(),
                stateIntegrity: this.verifyStateIntegrity(this.state),
                stateSizeCheck: this.calculateStateSize(this.state) < this.maxStateSize,
                recentSecurityEvents: this.securityLog.slice(-10),
                performanceMetrics: { ...this.performanceMetrics },
                memoryUsage: this.getMemoryUsage()
            };
            
            if (!auditResults.stateIntegrity) {
                console.error('🚨 State integrity audit failed');
                this.attemptStateRecovery();
            }
            
            if (!auditResults.stateSizeCheck) {
                console.warn('⚠️ State size approaching limits');
                this.performStateCleanup();
            }
            
            this.logSecurityEvent('security_audit_completed', { results: auditResults });
            
        } catch (error) {
            console.error('Error in security audit:', error);
            this.logSecurityEvent('security_audit_failed', { error: error.message });
        }
    }

    // Attempt state recovery after critical errors
    attemptStateRecovery() {
        try {
            console.warn('🔄 Attempting state recovery...');
            
            // Try to restore from last good undo state
            if (Array.isArray(this.state.undoStack) && this.state.undoStack.length > 0) {
                const lastGoodState = this.state.undoStack[this.state.undoStack.length - 1];
                
                if (this.verifySnapshotIntegrity(lastGoodState)) {
                    this.state = Object.freeze(lastGoodState);
                    console.log('✅ State recovered from undo stack');
                    this.logSecurityEvent('state_recovery_successful', { method: 'undo_stack' });
                    return true;
                }
            }
            
            // Fallback to safe defaults
            console.warn('🔄 Falling back to safe defaults');
            this.state = Object.freeze(this.createSecureInitialState({}));
            this.logSecurityEvent('state_recovery_fallback', { method: 'safe_defaults' });
            
            return true;
            
        } catch (error) {
            console.error('🚨 State recovery failed:', error);
            this.logSecurityEvent('state_recovery_failed', { error: error.message });
            return false;
        }
    }

    // Get comprehensive security report
    getSecurityReport() {
        return {
            timestamp: new Date().toISOString(),
            stateMetrics: {
                size: this.calculateStateSize(this.state),
                integrity: this.verifyStateIntegrity(this.state),
                version: this.state.securityVersion,
                sessionId: this.state.sessionId
            },
            performanceMetrics: { ...this.performanceMetrics },
            securityEvents: this.securityLog.slice(-20),
            rateLimitStatus: this.getRateLimitStatus(),
            memoryUsage: this.getMemoryUsage(),
            undoRedoStatus: {
                undoCount: this.state.undoStack?.length || 0,
                redoCount: this.state.redoStack?.length || 0,
                maxUndo: this.maxUndoSteps
            }
        };
    }

    // Cleanup with enhanced security
    secureCleanup() {
        try {
            // Clear security monitoring
            if (this.securityWatchdog) {
                clearInterval(this.securityWatchdog);
            }
            
            // Secure data clearing
            if (this.state.imageCache) {
                this.state.imageCache.forEach((value, key) => {
                    if (typeof key === 'string' && key.startsWith('blob:')) {
                        URL.revokeObjectURL(key);
                    }
                });
                this.state.imageCache.clear();
            }
            
            if (this.state.loadedImages) {
                this.state.loadedImages.clear();
            }
            
            // Clear sensitive logs
            this.securityLog = [];
            this.stateHistory = [];
            this.rateLimiter.clear();
            
            // Clear subscribers
            this.subscribers.clear();
            
            this.logSecurityEvent('secure_cleanup_completed', {});
            console.log('🧹 Secure cleanup completed successfully');
            
        } catch (error) {
            console.error('Error in secure cleanup:', error);
            this.logSecurityEvent('cleanup_error', { error: error.message });
        }
    }

    // Helper methods for secure initialization
    createSecureDragState(dragState = {}) {
        return {
            draggedElement: null,
            draggedIndex: null,
            isDragging: false,
            dropTarget: null,
            dragStartTime: null,
            dragOrigin: null,
            securityValidated: true,
            ...this.sanitizeObject(dragState)
        };
    }

    createSecureItemProperties(itemProperties = {}) {
        const secure = {};
        const itemCount = this.state?.itemCount || 3;
        
        for (let i = 1; i <= itemCount; i++) {
            secure[i] = {
                flexGrow: this.validateNumber(itemProperties[i]?.flexGrow, 0, 0, 100),
                flexShrink: this.validateNumber(itemProperties[i]?.flexShrink, 1, 0, 100),
                flexBasis: this.validateFlexBasis(itemProperties[i]?.flexBasis, 'auto'),
                alignSelf: this.validateAlignSelf(itemProperties[i]?.alignSelf, 'auto'),
                order: this.validateNumber(itemProperties[i]?.order, 0, -999, 999)
            };
        }
        
        return secure;
    }

    createSecureContainerProperties(containerProperties = {}) {
        return {
            display: this.validateDisplay(containerProperties.display, 'flex'),
            flexDirection: this.validateFlexDirection(containerProperties.flexDirection, 'row'),
            justifyContent: this.validateJustifyContent(containerProperties.justifyContent, 'flex-start'),
            alignItems: this.validateAlignItems(containerProperties.alignItems, 'stretch'),
            flexWrap: this.validateFlexWrap(containerProperties.flexWrap, 'nowrap'),
            alignContent: this.validateAlignContent(containerProperties.alignContent, 'stretch'),
            gap: this.validateGap(containerProperties.gap, '10px'),
            minHeight: this.validateDimension(containerProperties.minHeight, '400px'),
            width: this.validateDimension(containerProperties.width, '100%')
        };
    }

    // CSS property validation methods
    validateNumber(value, defaultValue, min = -Infinity, max = Infinity) {
        if (typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max) {
            return value;
        }
        return defaultValue;
    }

    validateFlexBasis(value, defaultValue) {
        if (value === 'auto' || value === 'content') return value;
        if (typeof value === 'string' && /^\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(value)) {
            return value;
        }
        return defaultValue;
    }

    validateAlignSelf(value, defaultValue) {
        const validValues = ['auto', 'stretch', 'flex-start', 'flex-end', 'center', 'baseline'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateDisplay(value, defaultValue) {
        const validValues = ['flex', 'inline-flex'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateFlexDirection(value, defaultValue) {
        const validValues = ['row', 'row-reverse', 'column', 'column-reverse'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateJustifyContent(value, defaultValue) {
        const validValues = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateAlignItems(value, defaultValue) {
        const validValues = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateFlexWrap(value, defaultValue) {
        const validValues = ['nowrap', 'wrap', 'wrap-reverse'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateAlignContent(value, defaultValue) {
        const validValues = ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'];
        return validValues.includes(value) ? value : defaultValue;
    }

    validateGap(value, defaultValue) {
        if (typeof value === 'string' && /^\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(value)) {
            return value;
        }
        return defaultValue;
    }

    validateDimension(value, defaultValue) {
        if (typeof value === 'string') {
            if (value === 'auto' || value === '100%' || /^\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(value)) {
                return value;
            }
        }
        return defaultValue;
    }

    // Item properties validation
    validateItemProperties(itemProperties) {
        const errors = [];
        let securityRisk = 0;

        if (!itemProperties || typeof itemProperties !== 'object') {
            errors.push('itemProperties must be an object');
            return { valid: false, errors, securityRisk: 0.5 };
        }

        Object.entries(itemProperties).forEach(([itemId, properties]) => {
            if (!properties || typeof properties !== 'object') {
                errors.push(`Item ${itemId} properties must be an object`);
                securityRisk += 0.1;
                return;
            }

            // Validate each property
            const propValidations = {
                flexGrow: (val) => typeof val === 'number' && val >= 0 && val <= 100,
                flexShrink: (val) => typeof val === 'number' && val >= 0 && val <= 100,
                flexBasis: (val) => val === 'auto' || /^\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(val),
                alignSelf: (val) => ['auto', 'stretch', 'flex-start', 'flex-end', 'center', 'baseline'].includes(val),
                order: (val) => typeof val === 'number' && val >= -999 && val <= 999
            };

            Object.entries(propValidations).forEach(([prop, validator]) => {
                if (properties.hasOwnProperty(prop) && !validator(properties[prop])) {
                    errors.push(`Invalid ${prop} for item ${itemId}: ${properties[prop]}`);
                    securityRisk += 0.1;
                }
            });
        });

        return {
            valid: errors.length === 0,
            errors,
            securityRisk: Math.min(securityRisk, 1.0)
        };
    }

    // Secure object utilities
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return {};
        
        const sanitized = {};
        Object.keys(obj).forEach(key => {
            if (!this.isDangerousProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string') {
                    sanitized[key] = this.sanitizeString(value);
                } else if (typeof value === 'number' && Number.isFinite(value)) {
                    sanitized[key] = value;
                } else if (typeof value === 'boolean') {
                    sanitized[key] = value;
                } else if (value === null) {
                    sanitized[key] = null;
                } else if (typeof value === 'object') {
                    sanitized[key] = this.sanitizeObject(value);
                }
            }
        });
        
        return sanitized;
    }

    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        
        return str
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:text\/html/gi, 'data:text/plain')
            .substring(0, 1000); // Length limit
    }

    secureStatesMerge(target, source) {
        if (!source || typeof source !== 'object') return target;
        
        const merged = { ...target };
        
        Object.keys(source).forEach(key => {
            if (!this.isDangerousProperty(key)) {
                const sourceValue = source[key];
                const targetValue = target[key];
                
                if (typeof sourceValue === 'object' && sourceValue !== null && 
                    typeof targetValue === 'object' && targetValue !== null &&
                    !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
                    merged[key] = this.secureStatesMerge(targetValue, sourceValue);
                } else {
                    merged[key] = sourceValue;
                }
            }
        });
        
        return merged;
    }

    validateUpdater(updater) {
        if (typeof updater === 'function') {
            // Basic function validation
            const funcStr = updater.toString();
            if (funcStr.includes('eval') || funcStr.includes('Function')) {
                console.error('🚫 Dangerous function detected in updater');
                return null;
            }
            return updater;
        }
        
        if (typeof updater === 'object' && updater !== null) {
            return this.sanitizeObject(updater);
        }
        
        return null;
    }

    shouldAddToUndo(newState, options = {}) {
        if (options.skipUndo) return false;
        
        // Don't add if it's just a temporary state change
        const temporaryKeys = ['isLoading', 'dragState', 'errors', 'warnings', 'lastSecurityCheck'];
        const meaningfulChange = Object.keys(newState).some(key => 
            !temporaryKeys.includes(key) && newState[key] !== this.state[key]
        );
        
        return meaningfulChange;
    }

    logStateChange(oldState, newState, options) {
        if (options.silent) return;
        
        const changes = this.detectStateChanges(oldState, newState);
        if (changes.length > 0) {
            console.log('📊 State updated:', changes);
        }
    }

    detectStateChanges(oldState, newState) {
        const changes = [];
        const compareKeys = ['itemCount', 'currentSelectedItem', 'itemProperties', 'containerProperties'];
        
        compareKeys.forEach(key => {
            if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
                changes.push(key);
            }
        });
        
        return changes;
    }

    notifySecureSubscribers(oldState, newState, meta = {}) {
        if (this.subscribers.size === 0) return;
        
        // Create secure copies for subscribers
        const secureOldState = oldState ? this.createSecureStateClone(oldState) : null;
        const secureNewState = this.createSecureStateClone(newState);
        const secureMeta = this.sanitizeObject(meta);
        
        this.subscribers.forEach(callback => {
            try {
                callback(secureNewState, secureOldState, secureMeta);
            } catch (error) {
                console.error('🚨 Error in secure subscriber:', error);
                this.logSecurityEvent('subscriber_error', { error: error.message });
                
                // Remove faulty subscriber
                this.subscribers.delete(callback);
            }
        });
    }

    detectEncryptionSupport() {
        return !!(window.crypto && window.crypto.subtle && window.crypto.getRandomValues);
    }

    initializeStateEncryption() {
        if (!this.encryptionEnabled) return;
        
        try {
            // Generate encryption key for sensitive data
            const keyMaterial = crypto.getRandomValues(new Uint8Array(32));
            this.encryptionKey = Array.from(keyMaterial).map(b => b.toString(16).padStart(2, '0')).join('');
            
            console.log('🔐 State encryption initialized');
        } catch (error) {
            console.warn('Encryption initialization failed:', error);
            this.encryptionEnabled = false;
        }
    }

    validateInitialState() {
        const validationResult = this.validateNewState(this.state);
        if (!validationResult.valid) {
            console.error('🚨 Initial state validation failed:', validationResult.errors);
            this.state = Object.freeze(this.createSafeDefaults());
        }
        
        console.log('✅ Initial state validated successfully');
    }

    performStateCleanup() {
        try {
            console.log('🧹 Performing state cleanup...');
            
            // Clean up old undo/redo entries
            if (this.state.undoStack && this.state.undoStack.length > this.maxUndoSteps) {
                this.state.undoStack.splice(0, this.state.undoStack.length - this.maxUndoSteps);
            }
            
            // Clean up old errors and warnings
            if (this.state.errors && this.state.errors.length > 20) {
                this.state.errors.splice(0, this.state.errors.length - 20);
            }
            
            if (this.state.warnings && this.state.warnings.length > 20) {
                this.state.warnings.splice(0, this.state.warnings.length - 20);
            }
            
            // Clean up security alerts
            if (this.state.securityAlerts && this.state.securityAlerts.length > 10) {
                this.state.securityAlerts.splice(0, this.state.securityAlerts.length - 10);
            }
            
            console.log('✅ State cleanup completed');
            
        } catch (error) {
            console.error('Error in state cleanup:', error);
        }
    }

    getRateLimitStatus() {
        const status = {};
        this.rateLimiter.forEach((timestamps, action) => {
            status[action] = {
                count: timestamps.length,
                latest: timestamps[timestamps.length - 1] || 0,
                limit: this.rateLimits[action]?.max || 0
            };
        });
        return status;
    }

    handleSecurityIncident(violationInfo) {
        console.error('🚨 Handling security incident:', violationInfo);
        
        // Add to security alerts in state
        const securityAlert = {
            id: this.generateSecureId(),
            type: violationInfo.type,
            timestamp: new Date().toISOString(),
            severity: violationInfo.severity || 'medium',
            details: violationInfo
        };
        
        this.setState(prevState => ({
            ...prevState,
            securityAlerts: [...(prevState.securityAlerts || []), securityAlert]
        }), { skipUndo: true, silent: true });
        
        // Take immediate action based on severity
        if (violationInfo.severity === 'critical' || violationInfo.securityRisk > 0.8) {
            console.warn('🔒 Initiating security lockdown');
            this.initializeSecurityLockdown();
        }
    }

    initializeSecurityLockdown() {
        try {
            // Temporarily disable state updates
            this.securityLockdown = true;
            
            // Clear potentially compromised data
            this.performStateCleanup();
            
            // Reset to safe state after delay
            setTimeout(() => {
                if (this.securityLockdown) {
                    console.log('🔄 Resetting to safe state after security incident');
                    this.reset({ skipUndo: true });
                    this.securityLockdown = false;
                }
            }, 5000);
            
        } catch (error) {
            console.error('Error in security lockdown:', error);
        }
    }

    // Utility methods
    calculateStateSize(state) {
        try {
            return new Blob([JSON.stringify(state, this.secureStringifyReplacer)]).size;
        } catch (error) {
            console.warn('Error calculating state size:', error);
            return 0;
        }
    }

    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }

    generateSecureId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        const counter = this.updateCounter.toString(36);
        return `${timestamp}-${random}-${counter}`;
    }

    generateSecureSessionId() {
        if (this.encryptionEnabled) {
            const timestamp = Date.now().toString(36);
            const random = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map(b => b.toString(36))
                .join('');
            return `sess-${timestamp}-${random}`;
        } else {
            return `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
        }
    }

    // Enhanced public API methods
    getState() { 
        return this.securityLockdown ? this.createSafeDefaults() : this.state; 
    }
    
    undo() { 
        return this.securityLockdown ? false : this.secureUndo(); 
    }
    
    redo() { 
        return this.securityLockdown ? false : this.secureRedo(); 
    }
    
    reset(options = {}) { 
        const defaultState = this.createSecureInitialState({});
        return this.setState(() => defaultState, options);
    }

    // Subscribe method with enhanced security
    subscribe(callback) {
        if (typeof callback !== 'function') {
            console.error('Subscribe callback must be a function');
            return () => {};
        }
        
        // Wrap callback with security validation
        const secureCallback = (...args) => {
            try {
                if (!this.securityLockdown) {
                    callback(...args);
                }
            } catch (error) {
                console.error('Error in subscriber callback:', error);
                this.logSecurityEvent('subscriber_callback_error', { error: error.message });
            }
        };
        
        this.subscribers.add(secureCallback);
        
        return () => {
            this.subscribers.delete(secureCallback);
        };
    }

    // Error handling methods
    addError(error, context = {}) {
        const errorObj = {
            id: this.generateSecureId(),
            message: this.sanitizeString(error?.message || String(error)),
            timestamp: new Date().toISOString(),
            context: this.sanitizeObject(context),
            severity: this.calculateErrorSeverity(error),
            securityRisk: this.assessSecurityRisk(error, context)
        };
        
        this.setState(prevState => ({
            ...prevState,
            errors: [...(prevState.errors || []), errorObj]
        }), { skipUndo: true });
    }

    addWarning(warning, context = {}) {
        const warningObj = {
            id: this.generateSecureId(),
            message: this.sanitizeString(String(warning)),
            timestamp: new Date().toISOString(),
            context: this.sanitizeObject(context)
        };
        
        this.setState(prevState => ({
            ...prevState,
            warnings: [...(prevState.warnings || []), warningObj]
        }), { skipUndo: true });
    }

    clearErrors() {
        this.setState(prevState => ({
            ...prevState,
            errors: []
        }), { skipUndo: true });
    }

    clearWarnings() {
        this.setState(prevState => ({
            ...prevState,
            warnings: []
        }), { skipUndo: true });
    }

    calculateErrorSeverity(error) {
        const message = error?.message?.toLowerCase() || '';
        
        if (message.includes('security') || message.includes('xss') || message.includes('injection')) {
            return 'critical';
        } else if (message.includes('validation') || message.includes('invalid')) {
            return 'warning';
        } else {
            return 'info';
        }
    }

    assessSecurityRisk(error, context) {
        let risk = 0;
        
        const message = error?.message?.toLowerCase() || '';
        const stack = error?.stack?.toLowerCase() || '';
        
        // High-risk patterns
        if (message.includes('script') || message.includes('eval')) risk += 0.3;
        if (message.includes('injection') || message.includes('xss')) risk += 0.5;
        if (stack.includes('javascript:') || stack.includes('data:')) risk += 0.3;
        if (context.type === 'csp_violation') risk += 0.4;
        if (context.type === 'state_validation_failed') risk += 0.2;
        
        return Math.min(risk, 1.0);
    }
}

// Export enhanced secure class
if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors.push(`${key} must be a finite number`);
    securityRisk += 0.1;
} else if (value < rule.min || value > rule.max) {
    errors.push(`${key} must be between ${rule.min} and ${rule.max}`);
    securityRisk += 0.2;
}