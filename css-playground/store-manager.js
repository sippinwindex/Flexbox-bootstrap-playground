// js/core/storage-manager.js - Storage Management System

const StorageManager = {
    // Storage configuration
    PREFIX: 'css-playground',
    VERSION: '1.0.0',
    
    // Storage types
    STORAGE_TYPES: {
        LOCAL: 'localStorage',
        SESSION: 'sessionStorage',
        MEMORY: 'memory'
    },
    
    // In-memory storage fallback
    memoryStorage: new Map(),
    
    // Storage availability
    availability: {
        localStorage: false,
        sessionStorage: false
    },
    
    // Storage listeners
    listeners: new Map(),
    
    // Initialize storage manager
    init() {
        console.log('💾 Initializing Storage Manager...');
        
        // Check storage availability
        this.checkStorageAvailability();
        
        // Set up storage event listeners
        this.setupStorageListeners();
        
        // Migrate old data if needed
        this.migrateData();
        
        // Clean up expired data
        this.cleanupExpiredData();
        
        console.log('✅ Storage Manager initialized');
        return this;
    },
    
    // Check if storage types are available
    checkStorageAvailability() {
        // Test localStorage
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            this.availability.localStorage = true;
        } catch (error) {
            console.warn('localStorage not available:', error.message);
            this.availability.localStorage = false;
        }
        
        // Test sessionStorage
        try {
            const test = '__session_test__';
            sessionStorage.setItem(test, 'test');
            sessionStorage.removeItem(test);
            this.availability.sessionStorage = true;
        } catch (error) {
            console.warn('sessionStorage not available:', error.message);
            this.availability.sessionStorage = false;
        }
    },
    
    // Get storage instance
    getStorage(type = this.STORAGE_TYPES.LOCAL) {
        switch (type) {
            case this.STORAGE_TYPES.LOCAL:
                return this.availability.localStorage ? localStorage : null;
            case this.STORAGE_TYPES.SESSION:
                return this.availability.sessionStorage ? sessionStorage : null;
            case this.STORAGE_TYPES.MEMORY:
                return this.memoryStorage;
            default:
                return null;
        }
    },
    
    // Generate storage key with prefix
    getKey(key) {
        return `${this.PREFIX}:${key}`;
    },
    
    // Set item in storage
    set(key, value, options = {}) {
        const {
            type = this.STORAGE_TYPES.LOCAL,
            expires = null,
            compress = false,
            encrypt = false
        } = options;
        
        try {
            const storage = this.getStorage(type);
            if (!storage) {
                throw new Error(`Storage type "${type}" not available`);
            }
            
            // Prepare data object
            const data = {
                value,
                timestamp: Date.now(),
                version: this.VERSION,
                expires: expires ? Date.now() + expires : null,
                compressed: compress,
                encrypted: encrypt
            };
            
            // Process data
            let processedData = data;
            if (compress) {
                processedData = this.compressData(processedData);
            }
            if (encrypt) {
                processedData = this.encryptData(processedData);
            }
            
            // Store data
            const storageKey = this.getKey(key);
            if (type === this.STORAGE_TYPES.MEMORY) {
                storage.set(storageKey, processedData);
            } else {
                storage.setItem(storageKey, JSON.stringify(processedData));
            }
            
            // Notify listeners
            this.notifyListeners('set', key, value, type);
            
            return true;
        } catch (error) {
            console.error(`Failed to set storage item "${key}":`, error);
            return false;
        }
    },
    
    // Get item from storage
    get(key, options = {}) {
        const {
            type = this.STORAGE_TYPES.LOCAL,
            defaultValue = null,
            parse = true
        } = options;
        
        try {
            const storage = this.getStorage(type);
            if (!storage) {
                return defaultValue;
            }
            
            const storageKey = this.getKey(key);
            let rawData;
            
            if (type === this.STORAGE_TYPES.MEMORY) {
                rawData = storage.get(storageKey);
            } else {
                const item = storage.getItem(storageKey);
                if (!item) return defaultValue;
                rawData = JSON.parse(item);
            }
            
            if (!rawData) return defaultValue;
            
            // Check expiration
            if (rawData.expires && Date.now() > rawData.expires) {
                this.remove(key, { type });
                return defaultValue;
            }
            
            // Process data
            let processedData = rawData;
            if (rawData.encrypted) {
                processedData = this.decryptData(processedData);
            }
            if (rawData.compressed) {
                processedData = this.decompressData(processedData);
            }
            
            // Notify listeners
            this.notifyListeners('get', key, processedData.value, type);
            
            return processedData.value;
        } catch (error) {
            console.error(`Failed to get storage item "${key}":`, error);
            return defaultValue;
        }
    },
    
    // Remove item from storage
    remove(key, options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL } = options;
        
        try {
            const storage = this.getStorage(type);
            if (!storage) return false;
            
            const storageKey = this.getKey(key);
            
            if (type === this.STORAGE_TYPES.MEMORY) {
                const existed = storage.has(storageKey);
                storage.delete(storageKey);
                
                if (existed) {
                    this.notifyListeners('remove', key, null, type);
                }
                return existed;
            } else {
                const existed = storage.getItem(storageKey) !== null;
                storage.removeItem(storageKey);
                
                if (existed) {
                    this.notifyListeners('remove', key, null, type);
                }
                return existed;
            }
        } catch (error) {
            console.error(`Failed to remove storage item "${key}":`, error);
            return false;
        }
    },
    
    // Check if item exists
    has(key, options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL } = options;
        
        try {
            const storage = this.getStorage(type);
            if (!storage) return false;
            
            const storageKey = this.getKey(key);
            
            if (type === this.STORAGE_TYPES.MEMORY) {
                return storage.has(storageKey);
            } else {
                return storage.getItem(storageKey) !== null;
            }
        } catch (error) {
            console.error(`Failed to check storage item "${key}":`, error);
            return false;
        }
    },
    
    // Get all keys with prefix
    getKeys(options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL } = options;
        
        try {
            const storage = this.getStorage(type);
            if (!storage) return [];
            
            const prefix = this.getKey('');
            
            if (type === this.STORAGE_TYPES.MEMORY) {
                return Array.from(storage.keys())
                    .filter(key => key.startsWith(prefix))
                    .map(key => key.substring(prefix.length));
            } else {
                const keys = [];
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    if (key && key.startsWith(prefix)) {
                        keys.push(key.substring(prefix.length));
                    }
                }
                return keys;
            }
        } catch (error) {
            console.error('Failed to get storage keys:', error);
            return [];
        }
    },
    
    // Clear all items with prefix
    clear(options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL, confirm = true } = options;
        
        if (confirm && !window.confirm('Are you sure you want to clear all stored data?')) {
            return false;
        }
        
        try {
            const keys = this.getKeys({ type });
            keys.forEach(key => this.remove(key, { type }));
            
            this.notifyListeners('clear', null, null, type);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    },
    
    // Get storage usage information
    getUsage(type = this.STORAGE_TYPES.LOCAL) {
        try {
            const storage = this.getStorage(type);
            if (!storage) return { used: 0, available: 0, percentage: 0 };
            
            if (type === this.STORAGE_TYPES.MEMORY) {
                const used = JSON.stringify(Array.from(storage.entries())).length;
                return {
                    used,
                    available: Infinity,
                    percentage: 0,
                    items: storage.size
                };
            }
            
            // Calculate used space
            let used = 0;
            const prefix = this.getKey('');
            
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && key.startsWith(prefix)) {
                    const value = storage.getItem(key);
                    used += key.length + (value ? value.length : 0);
                }
            }
            
            // Estimate available space (rough approximation)
            const available = 5 * 1024 * 1024; // ~5MB typical limit
            const percentage = (used / available) * 100;
            
            return {
                used,
                available,
                percentage: Math.min(percentage, 100),
                items: this.getKeys({ type }).length
            };
        } catch (error) {
            console.error('Failed to get storage usage:', error);
            return { used: 0, available: 0, percentage: 0, items: 0 };
        }
    },
    
    // Set up storage event listeners
    setupStorageListeners() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key && event.key.startsWith(this.getKey(''))) {
                const key = event.key.substring(this.getKey('').length);
                this.notifyListeners('external-change', key, event.newValue, this.STORAGE_TYPES.LOCAL);
            }
        });
    },
    
    // Add storage change listener
    addListener(callback) {
        const id = this.generateListenerId();
        this.listeners.set(id, callback);
        return () => this.listeners.delete(id);
    },
    
    // Notify listeners of storage changes
    notifyListeners(action, key, value, type) {
        this.listeners.forEach(callback => {
            try {
                callback({ action, key, value, type, timestamp: Date.now() });
            } catch (error) {
                console.error('Error in storage listener:', error);
            }
        });
    },
    
    // Generate unique listener ID
    generateListenerId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Migrate data from older versions
    migrateData() {
        // Check for old data format and migrate if needed
        const version = this.get('_version', { defaultValue: '0.0.0' });
        
        if (version !== this.VERSION) {
            console.log(`Migrating data from version ${version} to ${this.VERSION}`);
            
            // Perform migration based on version differences
            // This is where you'd add migration logic for breaking changes
            
            this.set('_version', this.VERSION);
        }
    },
    
    // Clean up expired data
    cleanupExpiredData() {
        const keys = this.getKeys();
        const now = Date.now();
        
        keys.forEach(key => {
            try {
                const storage = this.getStorage();
                if (!storage) return;
                
                const item = storage.getItem(this.getKey(key));
                if (item) {
                    const data = JSON.parse(item);
                    if (data.expires && now > data.expires) {
                        this.remove(key);
                    }
                }
            } catch (error) {
                // Invalid data, remove it
                this.remove(key);
            }
        });
    },
    
    // Compress data (basic implementation)
    compressData(data) {
        // This is a placeholder for actual compression
        // In a real implementation, you might use libraries like pako for gzip compression
        return {
            ...data,
            value: this.simpleCompress(JSON.stringify(data.value)),
            compressed: true
        };
    },
    
    // Decompress data
    decompressData(data) {
        return {
            ...data,
            value: JSON.parse(this.simpleDecompress(data.value)),
            compressed: false
        };
    },
    
    // Simple compression (RLE-like for demo)
    simpleCompress(str) {
        return str.replace(/(.)\1+/g, (match, char) => `${char}${match.length}`);
    },
    
    // Simple decompression
    simpleDecompress(str) {
        return str.replace(/(.)\d+/g, (match, char, count) => char.repeat(parseInt(count)));
    },
    
    // Encrypt data (basic implementation)
    encryptData(data) {
        // This is a placeholder for actual encryption
        // In a real implementation, you'd use proper encryption libraries
        return {
            ...data,
            value: btoa(JSON.stringify(data.value)),
            encrypted: true
        };
    },
    
    // Decrypt data
    decryptData(data) {
        return {
            ...data,
            value: JSON.parse(atob(data.value)),
            encrypted: false
        };
    },
    
    // Export all data
    export(options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL, includeMetadata = true } = options;
        
        const keys = this.getKeys({ type });
        const data = {};
        
        keys.forEach(key => {
            const value = this.get(key, { type });
            if (value !== null) {
                data[key] = value;
            }
        });
        
        const exportData = {
            data,
            timestamp: new Date().toISOString(),
            version: this.VERSION
        };
        
        if (includeMetadata) {
            exportData.metadata = {
                storageType: type,
                usage: this.getUsage(type),
                keyCount: keys.length
            };
        }
        
        return exportData;
    },
    
    // Import data
    import(importData, options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL, overwrite = false, validate = true } = options;
        
        try {
            if (validate && !this.validateImportData(importData)) {
                throw new Error('Invalid import data format');
            }
            
            const { data } = importData;
            let importedCount = 0;
            let skippedCount = 0;
            
            Object.entries(data).forEach(([key, value]) => {
                if (!overwrite && this.has(key, { type })) {
                    skippedCount++;
                    return;
                }
                
                if (this.set(key, value, { type })) {
                    importedCount++;
                }
            });
            
            return {
                success: true,
                imported: importedCount,
                skipped: skippedCount,
                total: Object.keys(data).length
            };
        } catch (error) {
            console.error('Failed to import data:', error);
            return {
                success: false,
                error: error.message,
                imported: 0,
                skipped: 0,
                total: 0
            };
        }
    },
    
    // Validate import data format
    validateImportData(importData) {
        return (
            importData &&
            typeof importData === 'object' &&
            importData.data &&
            typeof importData.data === 'object' &&
            importData.version &&
            typeof importData.version === 'string'
        );
    },
    
    // Create backup of all data
    backup(options = {}) {
        const { includeSession = false } = options;
        
        const backup = {
            localStorage: this.export({ type: this.STORAGE_TYPES.LOCAL }),
            memoryStorage: this.export({ type: this.STORAGE_TYPES.MEMORY }),
            timestamp: new Date().toISOString(),
            version: this.VERSION
        };
        
        if (includeSession) {
            backup.sessionStorage = this.export({ type: this.STORAGE_TYPES.SESSION });
        }
        
        return backup;
    },
    
    // Restore from backup
    restore(backup, options = {}) {
        const { overwrite = false, storageTypes = ['localStorage'] } = options;
        
        try {
            const results = {};
            
            storageTypes.forEach(storageType => {
                if (backup[storageType]) {
                    const type = storageType === 'localStorage' ? this.STORAGE_TYPES.LOCAL :
                                storageType === 'sessionStorage' ? this.STORAGE_TYPES.SESSION :
                                this.STORAGE_TYPES.MEMORY;
                    
                    results[storageType] = this.import(backup[storageType], { type, overwrite });
                }
            });
            
            return {
                success: true,
                results
            };
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Watch for changes to a specific key
    watch(key, callback, options = {}) {
        const { type = this.STORAGE_TYPES.LOCAL, immediate = false } = options;
        
        // Store current value
        let currentValue = this.get(key, { type });
        
        if (immediate) {
            callback(currentValue, undefined, key);
        }
        
        // Create watcher function
        const watcher = ({ action, key: changedKey, value }) => {
            if (changedKey === key) {
                const oldValue = currentValue;
                currentValue = value;
                callback(value, oldValue, key);
            }
        };
        
        // Add listener
        const unsubscribe = this.addListener(watcher);
        
        return unsubscribe;
    },
    
    // Create a scoped storage interface
    createScope(scope) {
        return {
            set: (key, value, options) => this.set(`${scope}:${key}`, value, options),
            get: (key, options) => this.get(`${scope}:${key}`, options),
            remove: (key, options) => this.remove(`${scope}:${key}`, options),
            has: (key, options) => this.has(`${scope}:${key}`, options),
            getKeys: (options) => this.getKeys(options)
                .filter(key => key.startsWith(`${scope}:`))
                .map(key => key.substring(`${scope}:`.length)),
            clear: (options) => {
                const scopedKeys = this.getKeys(options)
                    .filter(key => key.startsWith(`${scope}:`));
                scopedKeys.forEach(key => this.remove(key, options));
                return scopedKeys.length;
            }
        };
    },
    
    // Debug information
    debug() {
        return {
            availability: this.availability,
            version: this.VERSION,
            prefix: this.PREFIX,
            usage: {
                localStorage: this.getUsage(this.STORAGE_TYPES.LOCAL),
                sessionStorage: this.getUsage(this.STORAGE_TYPES.SESSION),
                memoryStorage: this.getUsage(this.STORAGE_TYPES.MEMORY)
            },
            keyCount: {
                localStorage: this.getKeys({ type: this.STORAGE_TYPES.LOCAL }).length,
                sessionStorage: this.getKeys({ type: this.STORAGE_TYPES.SESSION }).length,
                memoryStorage: this.getKeys({ type: this.STORAGE_TYPES.MEMORY }).length
            },
            listeners: this.listeners.size
        };
    }
};

// Make StorageManager globally available
window.StorageManager = StorageManager;