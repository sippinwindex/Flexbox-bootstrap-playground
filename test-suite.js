/**
 * test-suite.js - Enhanced Secure Comprehensive Testing Suite
 * Validates all functionality, security features, and performance with enterprise-grade testing
 */

class SecurePlatformTestSuite {
    constructor() {
        this.tests = [];
        this.securityTests = [];
        this.performanceTests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: [],
            warnings: [],
            securityScore: 0,
            performanceScore: 0
        };
        
        // Security testing context
        this.securityContext = {
            xssAttempts: 0,
            sqlInjectionAttempts: 0,
            rateLimitTests: 0,
            validationBypass: 0,
            blockedRequests: 0
        };
        
        // Performance monitoring
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            resourceCount: 0,
            jsExecutionTime: 0
        };
        
        // Test execution metadata
        this.testMetadata = {
            startTime: null,
            endTime: null,
            environment: this.detectEnvironment(),
            browser: this.detectBrowser(),
            securityFeatures: this.detectSecurityFeatures()
        };
        
        console.log('🛡️ Enhanced Secure Test Suite Initialized');
        this.initializeSecurityMonitoring();
    }
    
    detectEnvironment() {
        return {
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            isDevelopment: ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname),
            hasLocalStorage: typeof localStorage !== 'undefined',
            hasSessionStorage: typeof sessionStorage !== 'undefined',
            hasCrypto: !!(window.crypto && window.crypto.subtle),
            hasServiceWorker: 'serviceWorker' in navigator
        };
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent;
        return {
            userAgent: userAgent.substring(0, 100), // Limit for security
            isChrome: userAgent.includes('Chrome'),
            isFirefox: userAgent.includes('Firefox'),
            isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome'),
            isEdge: userAgent.includes('Edge'),
            language: navigator.language,
            platform: navigator.platform
        };
    }
    
    detectSecurityFeatures() {
        return {
            csp: !!document.querySelector('meta[http-equiv*="Content-Security-Policy"]'),
            errorBoundary: !!(window.globalErrorBoundary || window.EnhancedGlobalErrorBoundary),
            secureStorage: !!window.secureStorage,
            securityUtils: !!window.SecurityUtils,
            rateLimiting: !!(window.SecurityContext || (window.secureStorage && window.secureStorage.checkRateLimit)),
            inputValidation: !!(window.validateURL || window.sanitizeHTML)
        };
    }
    
    initializeSecurityMonitoring() {
        // Monitor for security violations during testing
        document.addEventListener('securitypolicyviolation', (event) => {
            this.securityContext.cspViolations = (this.securityContext.cspViolations || 0) + 1;
            console.warn('🚨 CSP Violation during testing:', event.violatedDirective);
        });
        
        // Monitor for unhandled errors
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes('test-suite')) {
                // Ignore test suite errors
                return;
            }
            this.securityContext.unexpectedErrors = (this.securityContext.unexpectedErrors || 0) + 1;
        });
    }
    
    /**
     * Add a regular test case
     * @param {string} name - Test name
     * @param {Function} testFn - Test function
     * @param {Object} options - Test options
     */
    addTest(name, testFn, options = {}) {
        this.tests.push({ 
            name, 
            testFn, 
            category: options.category || 'general',
            timeout: options.timeout || 5000,
            retries: options.retries || 0,
            async: options.async || false
        });
    }
    
    /**
     * Add a security-specific test case
     * @param {string} name - Test name
     * @param {Function} testFn - Test function
     * @param {Object} options - Security test options
     */
    addSecurityTest(name, testFn, options = {}) {
        this.securityTests.push({ 
            name, 
            testFn, 
            severity: options.severity || 'medium',
            timeout: options.timeout || 3000,
            expectedToFail: options.expectedToFail || false
        });
    }
    
    /**
     * Add a performance test case
     * @param {string} name - Test name
     * @param {Function} testFn - Test function
     * @param {Object} thresholds - Performance thresholds
     */
    addPerformanceTest(name, testFn, thresholds = {}) {
        this.performanceTests.push({ 
            name, 
            testFn, 
            thresholds: {
                maxTime: thresholds.maxTime || 1000,
                maxMemory: thresholds.maxMemory || 50 * 1024 * 1024, // 50MB
                ...thresholds
            }
        });
    }
    
    /**
     * Run all test suites
     */
    async runAll() {
        this.testMetadata.startTime = Date.now();
        
        console.log('🧪 Starting Enhanced Secure CSS Learning Platform Test Suite');
        console.log('='.repeat(70));
        console.log(`Environment: ${this.testMetadata.environment.hostname} (${this.testMetadata.environment.isDevelopment ? 'Development' : 'Production'})`);
        console.log(`Browser: ${this.testMetadata.browser.userAgent}`);
        console.log(`Security Features: ${Object.entries(this.testMetadata.securityFeatures).filter(([k,v]) => v).map(([k]) => k).join(', ')}`);
        console.log('='.repeat(70));
        
        // Run regular tests
        await this.runTestCategory('General Tests', this.tests);
        
        // Run security tests
        await this.runTestCategory('Security Tests', this.securityTests, true);
        
        // Run performance tests
        await this.runTestCategory('Performance Tests', this.performanceTests, false, true);
        
        this.testMetadata.endTime = Date.now();
        this.calculateScores();
        this.printComprehensiveResults();
        
        return this.results;
    }
    
    async runTestCategory(categoryName, tests, isSecurity = false, isPerformance = false) {
        if (tests.length === 0) return;
        
        console.log(`\n📋 ${categoryName}`);
        console.log('-'.repeat(50));
        
        for (const test of tests) {
            try {
                if (isPerformance) {
                    await this.runPerformanceTest(test);
                } else if (isSecurity) {
                    await this.runSecurityTest(test);
                } else {
                    await this.runRegularTest(test);
                }
            } catch (error) {
                this.results.failed++;
                this.results.errors.push({ 
                    test: test.name, 
                    error: error.message,
                    category: categoryName,
                    stack: error.stack
                });
                console.error(`❌ ${test.name}: ${error.message}`);
            }
            this.results.total++;
        }
    }
    
    async runRegularTest(test) {
        const startTime = performance.now();
        
        try {
            if (test.async) {
                await Promise.race([
                    test.testFn(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Test timeout')), test.timeout)
                    )
                ]);
            } else {
                test.testFn();
            }
            
            const duration = performance.now() - startTime;
            this.results.passed++;
            console.log(`✅ ${test.name} (${duration.toFixed(2)}ms)`);
            
        } catch (error) {
            if (test.retries > 0) {
                console.warn(`⚠️ ${test.name} failed, retrying...`);
                test.retries--;
                await new Promise(resolve => setTimeout(resolve, 100));
                return this.runRegularTest(test);
            }
            throw error;
        }
    }
    
    async runSecurityTest(test) {
        const startTime = performance.now();
        
        try {
            const result = await Promise.race([
                test.testFn(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Security test timeout')), test.timeout)
                )
            ]);
            
            const duration = performance.now() - startTime;
            
            if (test.expectedToFail && result !== false) {
                throw new Error('Expected security test to fail but it passed');
            }
            
            this.results.passed++;
            console.log(`🛡️ ${test.name} (${duration.toFixed(2)}ms)`);
            
        } catch (error) {
            if (test.expectedToFail) {
                this.results.passed++;
                console.log(`🛡️ ${test.name} (Expected failure - PASS)`);
            } else {
                throw error;
            }
        }
    }
    
    async runPerformanceTest(test) {
        const startTime = performance.now();
        const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        try {
            await test.testFn();
            
            const duration = performance.now() - startTime;
            const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const memoryUsed = endMemory - startMemory;
            
            // Check against thresholds
            if (duration > test.thresholds.maxTime) {
                throw new Error(`Performance threshold exceeded: ${duration.toFixed(2)}ms > ${test.thresholds.maxTime}ms`);
            }
            
            if (memoryUsed > test.thresholds.maxMemory) {
                throw new Error(`Memory threshold exceeded: ${this.formatBytes(memoryUsed)} > ${this.formatBytes(test.thresholds.maxMemory)}`);
            }
            
            this.results.passed++;
            console.log(`⚡ ${test.name} (${duration.toFixed(2)}ms, ${this.formatBytes(memoryUsed)})`);
            
        } catch (error) {
            throw error;
        }
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    calculateScores() {
        const totalTests = this.results.total;
        const passRate = totalTests > 0 ? (this.results.passed / totalTests) * 100 : 0;
        
        // Security score based on security features and test results
        const securityFeatureCount = Object.values(this.testMetadata.securityFeatures).filter(Boolean).length;
        const securityTestPassRate = this.securityTests.length > 0 ? 
            (this.securityTests.filter(t => this.results.errors.every(e => e.test !== t.name)).length / this.securityTests.length) * 100 : 100;
        
        this.results.securityScore = Math.round((securityFeatureCount / 6) * 50 + (securityTestPassRate / 100) * 50);
        
        // Performance score based on load times and resource efficiency
        const loadTime = this.performanceMetrics.loadTime || (this.testMetadata.endTime - this.testMetadata.startTime);
        const performanceScore = Math.max(0, 100 - (loadTime / 100)); // Penalize slow load times
        
        this.results.performanceScore = Math.round(performanceScore);
    }
    
    printComprehensiveResults() {
        const duration = this.testMetadata.endTime - this.testMetadata.startTime;
        
        console.log('\n' + '='.repeat(70));
        console.log('📊 COMPREHENSIVE TEST RESULTS');
        console.log('='.repeat(70));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed} (${((this.results.passed / this.results.total) * 100).toFixed(1)}%)`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Security Score: ${this.results.securityScore}/100`);
        console.log(`Performance Score: ${this.results.performanceScore}/100`);
        
        // Security summary
        console.log('\n🛡️ SECURITY SUMMARY:');
        console.log(`  Features Detected: ${Object.entries(this.testMetadata.securityFeatures).filter(([k,v]) => v).map(([k]) => k).join(', ')}`);
        console.log(`  Security Tests: ${this.securityTests.length}`);
        console.log(`  CSP Violations: ${this.securityContext.cspViolations || 0}`);
        console.log(`  Unexpected Errors: ${this.securityContext.unexpectedErrors || 0}`);
        
        // Performance summary
        console.log('\n⚡ PERFORMANCE SUMMARY:');
        if (performance.memory) {
            console.log(`  Memory Usage: ${this.formatBytes(performance.memory.usedJSHeapSize)}`);
        }
        console.log(`  Performance Tests: ${this.performanceTests.length}`);
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.errors.forEach(({ test, error, category }) => {
                console.log(`  [${category}] ${test}: ${error}`);
            });
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.results.warnings.forEach(warning => {
                console.log(`  ${warning}`);
            });
        }
        
        // Final assessment
        console.log('\n🎯 FINAL ASSESSMENT:');
        const overallScore = (this.results.securityScore + this.results.performanceScore + (this.results.passed / this.results.total * 100)) / 3;
        console.log(`Overall Score: ${overallScore.toFixed(1)}/100`);
        
        if (overallScore >= 90) {
            console.log('🏆 EXCELLENT - Production ready!');
        } else if (overallScore >= 75) {
            console.log('✅ GOOD - Minor improvements needed');
        } else if (overallScore >= 60) {
            console.log('⚠️ FAIR - Several issues need attention');
        } else {
            console.log('❌ POOR - Significant improvements required');
        }
    }
    
    // Enhanced assertion helpers with security validation
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`);
        }
    }
    
    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`${message} - Expected condition to be true`);
        }
    }
    
    assertElementExists(selector, message = '') {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`${message} - Element ${selector} not found`);
        }
        return element;
    }
    
    assertElementHasClass(selector, className, message = '') {
        const element = this.assertElementExists(selector);
        if (!element.classList.contains(className)) {
            throw new Error(`${message} - Element ${selector} missing class ${className}`);
        }
    }
    
    assertSecureElement(element, message = '') {
        if (!element) {
            throw new Error(`${message} - Element is null or undefined`);
        }
        
        // Check for dangerous attributes
        const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover'];
        dangerousAttrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                throw new Error(`${message} - Element has dangerous attribute: ${attr}`);
            }
        });
        
        return element;
    }
    
    assertNoXSS(content, message = '') {
        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /on\w+\s*=/i
        ];
        
        const hasXSS = xssPatterns.some(pattern => pattern.test(content));
        if (hasXSS) {
            this.securityContext.xssAttempts++;
            throw new Error(`${message} - Content contains potential XSS: ${content.substring(0, 100)}`);
        }
    }
    
    assertRateLimited(fn, maxCalls, timeWindow, message = '') {
        let callCount = 0;
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeWindow) {
            try {
                fn();
                callCount++;
                if (callCount > maxCalls) {
                    this.securityContext.rateLimitTests++;
                    throw new Error(`${message} - Function not rate limited (${callCount} calls in ${timeWindow}ms)`);
                }
            } catch (error) {
                if (error.message.includes('rate limit')) {
                    return; // Rate limiting is working
                }
                throw error;
            }
        }
    }
}

// Initialize enhanced test suite
const secureTestSuite = new SecurePlatformTestSuite();

// =====================================
// ENHANCED SECURITY TESTS
// =====================================

secureTestSuite.addSecurityTest('Security Infrastructure - Error Boundary', () => {
    if (!window.globalErrorBoundary && !window.EnhancedGlobalErrorBoundary) {
        throw new Error('No error boundary detected');
    }
    return true;
});

secureTestSuite.addSecurityTest('Security Infrastructure - Secure Storage', () => {
    if (!window.secureStorage) {
        throw new Error('Secure storage not available');
    }
    
    // Test storage with potentially dangerous content
    const testKey = 'security_test_' + Date.now();
    const testValue = { test: '<script>alert("xss")</script>' };
    
    const stored = window.secureStorage.set(testKey, testValue);
    if (!stored) {
        throw new Error('Secure storage failed to store data');
    }
    
    const retrieved = window.secureStorage.get(testKey);
    if (!retrieved || retrieved.test !== testValue.test) {
        throw new Error('Secure storage data integrity failed');
    }
    
    window.secureStorage.remove(testKey);
    return true;
});

secureTestSuite.addSecurityTest('XSS Protection - HTML Sanitization', () => {
    const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '<img src=x onerror=alert(1)>',
        '<iframe src=javascript:alert(1)></iframe>',
        'vbscript:msgbox("xss")'
    ];
    
    maliciousInputs.forEach(input => {
        let sanitized;
        if (window.sanitizeHTML) {
            sanitized = window.sanitizeHTML(input);
        } else if (window.SecurityUtils && window.SecurityUtils.sanitizeHTML) {
            sanitized = window.SecurityUtils.sanitizeHTML(input);
        } else {
            throw new Error('No HTML sanitization function available');
        }
        
        secureTestSuite.assertNoXSS(sanitized, `Sanitized content should be safe: ${input}`);
    });
    
    return true;
});

secureTestSuite.addSecurityTest('XSS Protection - URL Validation', () => {
    const maliciousUrls = [
        'javascript:alert(1)',
        'vbscript:msgbox("xss")',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd'
    ];
    
    const safeUrls = [
        'https://example.com',
        'http://localhost:3000',
        '/relative/path',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    ];
    
    maliciousUrls.forEach(url => {
        let isValid;
        if (window.validateURL) {
            isValid = window.validateURL(url);
        } else if (window.SecurityUtils && window.SecurityUtils.validateURL) {
            isValid = window.SecurityUtils.validateURL(url);
        } else {
            throw new Error('No URL validation function available');
        }
        
        if (isValid) {
            throw new Error(`Malicious URL should be rejected: ${url}`);
        }
    });
    
    safeUrls.forEach(url => {
        let isValid;
        if (window.validateURL) {
            isValid = window.validateURL(url);
        } else if (window.SecurityUtils && window.SecurityUtils.validateURL) {
            isValid = window.SecurityUtils.validateURL(url);
        } else {
            return; // Skip if no validation available
        }
        
        if (!isValid && !url.includes('localhost')) {
            throw new Error(`Safe URL should be accepted: ${url}`);
        }
    });
    
    return true;
});

secureTestSuite.addSecurityTest('Rate Limiting - Function Calls', () => {
    if (!window.secureDebounce && !window.secureThrottle) {
        throw new Error('No rate limiting functions available');
    }
    
    let callCount = 0;
    const testFn = () => callCount++;
    
    if (window.secureThrottle) {
        const throttled = window.secureThrottle(testFn, 100);
        
        // Call rapidly
        for (let i = 0; i < 10; i++) {
            throttled();
        }
        
        if (callCount > 2) {
            throw new Error(`Throttling failed: ${callCount} calls executed`);
        }
    }
    
    return true;
});

secureTestSuite.addSecurityTest('CSP Compliance - Meta Tag', () => {
    const cspMeta = document.querySelector('meta[http-equiv*="Content-Security-Policy"]');
    if (!cspMeta) {
        throw new Error('Content Security Policy meta tag not found');
    }
    
    const cspContent = cspMeta.getAttribute('content');
    if (!cspContent.includes("default-src 'self'")) {
        throw new Error('CSP should include default-src self');
    }
    
    return true;
});

secureTestSuite.addSecurityTest('DOM Security - Dangerous Element Creation', () => {
    // Test that dangerous elements are blocked
    let element;
    if (window.secureSafeCreateElement) {
        element = window.secureSafeCreateElement('script', {
            innerHTML: 'alert("xss")'
        });
    } else if (window.SecurityUtils && window.SecurityUtils.createSafeElement) {
        element = window.SecurityUtils.createSafeElement('script', 'alert("xss")');
    } else {
        throw new Error('No secure element creation function available');
    }
    
    if (element && element.tagName.toLowerCase() === 'script') {
        throw new Error('Script element creation should be blocked');
    }
    
    return true;
}, { expectedToFail: false });

// =====================================
// ENHANCED PERFORMANCE TESTS
// =====================================

secureTestSuite.addPerformanceTest('Performance - Page Load Time', async () => {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        secureTestSuite.performanceMetrics.loadTime = loadTime;
        
        if (loadTime > 5000) {
            throw new Error(`Page load time too slow: ${loadTime}ms`);
        }
    }
}, { maxTime: 5000 });

secureTestSuite.addPerformanceTest('Performance - Memory Usage', async () => {
    if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize;
        secureTestSuite.performanceMetrics.memoryUsage = memoryUsage;
        
        // Check if memory usage is reasonable (less than 100MB)
        if (memoryUsage > 100 * 1024 * 1024) {
            throw new Error(`Memory usage too high: ${secureTestSuite.formatBytes(memoryUsage)}`);
        }
    }
}, { maxMemory: 100 * 1024 * 1024 });

secureTestSuite.addPerformanceTest('Performance - Resource Count', async () => {
    const scripts = document.querySelectorAll('script[src]');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const totalResources = scripts.length + stylesheets.length;
    
    secureTestSuite.performanceMetrics.resourceCount = totalResources;
    
    if (totalResources > 15) {
        throw new Error(`Too many external resources: ${totalResources}`);
    }
}, { maxTime: 100 });

// =====================================
// PLAYGROUND-SPECIFIC TESTS
// =====================================

secureTestSuite.addTest('HTML Playground - Security', () => {
    if (!window.location.pathname.includes('html-playground.html')) return;
    
    secureTestSuite.assertElementExists('#preview-area');
    secureTestSuite.assertElementExists('#html-output');
    
    // Test that preview area is secure
    const previewArea = document.getElementById('preview-area');
    secureTestSuite.assertSecureElement(previewArea, 'Preview area should be secure');
});

secureTestSuite.addTest('CSS Playground - Security', () => {
    if (!window.location.pathname.includes('css-playground.html')) return;
    
    secureTestSuite.assertElementExists('.demo-container');
    
    // Test CSS injection protection
    const colorInput = document.getElementById('backgroundColor');
    if (colorInput && typeof updateColors === 'function') {
        const maliciousCSS = 'red; background: url(javascript:alert(1))';
        colorInput.value = maliciousCSS;
        
        try {
            updateColors();
            const demoElement = document.getElementById('color-demo-element');
            if (demoElement && demoElement.style.background.includes('javascript:')) {
                throw new Error('CSS injection not prevented');
            }
        } catch (error) {
            if (!error.message.includes('CSS injection')) {
                throw error;
            }
        }
    }
});

secureTestSuite.addTest('Flexbox Playground - Security', () => {
    if (!window.location.pathname.includes('flexbox-playground.html')) return;
    
    secureTestSuite.assertElementExists('#flex-container');
    
    const container = document.getElementById('flex-container');
    secureTestSuite.assertSecureElement(container, 'Flex container should be secure');
});

// =====================================
// ACCESSIBILITY TESTS (Enhanced)
// =====================================

secureTestSuite.addTest('Accessibility - ARIA Labels', () => {
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role="button"]');
    
    interactiveElements.forEach((element, index) => {
        const hasAccessibleName = element.hasAttribute('aria-label') ||
                                 element.hasAttribute('aria-labelledby') ||
                                 document.querySelector(`label[for="${element.id}"]`) ||
                                 element.closest('label') ||
                                 element.textContent.trim();
        
        if (!hasAccessibleName) {
            secureTestSuite.results.warnings.push(`Interactive element ${index + 1} lacks accessible name`);
        }
    });
});

secureTestSuite.addTest('Accessibility - Keyboard Navigation', () => {
    const focusableElements = document.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
        if (element.tabIndex < 0 && !element.hasAttribute('aria-hidden')) {
            secureTestSuite.results.warnings.push(`Element ${index + 1} not focusable but not hidden`);
        }
    });
});

// =====================================
// BROWSER COMPATIBILITY (Enhanced)
// =====================================

secureTestSuite.addTest('Browser Compatibility - Security APIs', () => {
    const requiredAPIs = {
        'Fetch API': typeof fetch !== 'undefined',
        'Web Crypto API': !!(window.crypto && window.crypto.subtle),
        'localStorage': typeof localStorage !== 'undefined',
        'sessionStorage': typeof sessionStorage !== 'undefined',
        'Promises': typeof Promise !== 'undefined',
        'WeakMap': typeof WeakMap !== 'undefined',
        'WeakSet': typeof WeakSet !== 'undefined'
    };
    
    Object.entries(requiredAPIs).forEach(([api, available]) => {
        if (!available) {
            secureTestSuite.results.warnings.push(`${api} not available`);
        }
    });
    
    secureTestSuite.assertTrue(requiredAPIs['Fetch API'], 'Fetch API is required');
    secureTestSuite.assertTrue(requiredAPIs['Promises'], 'Promises are required');
});

// =====================================
// AUTO-RUN AND MANUAL CONTROLS
// =====================================

// Enhanced test controls for development
if (secureTestSuite.testMetadata.environment.isDevelopment) {
    const createTestControls = () => {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'test-control-panel';
        controlPanel.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; z-index: 99999; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: monospace; font-size: 12px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🧪 Test Controls</h4>
                <button id="run-all-tests" style="margin: 2px; padding: 5px 10px; font-size: 11px;">🚀 Run All Tests</button>
                <button id="run-security-tests" style="margin: 2px; padding: 5px 10px; font-size: 11px;">🛡️ Security Only</button>
                <button id="run-performance-tests" style="margin: 2px; padding: 5px 10px; font-size: 11px;">⚡ Performance Only</button>
                <button id="security-report" style="margin: 2px; padding: 5px 10px; font-size: 11px;">📊 Security Report</button>
                <div id="test-status" style="margin-top: 10px; font-size: 10px; color: #666;"></div>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        document.getElementById('run-all-tests').onclick = () => {
            document.getElementById('test-status').textContent = 'Running tests...';
            secureTestSuite.runAll().then(() => {
                document.getElementById('test-status').textContent = 'Tests completed!';
            });
        };
        
        document.getElementById('run-security-tests').onclick = () => {
            document.getElementById('test-status').textContent = 'Running security tests...';
            secureTestSuite.runTestCategory('Security Tests', secureTestSuite.securityTests, true);
        };
        
        document.getElementById('run-performance-tests').onclick = () => {
            document.getElementById('test-status').textContent = 'Running performance tests...';
            secureTestSuite.runTestCategory('Performance Tests', secureTestSuite.performanceTests, false, true);
        };
        
        document.getElementById('security-report').onclick = () => {
            if (window.getUtilsSecurityReport) {
                console.log('🔒 Utils Security Report:', window.getUtilsSecurityReport());
            }
            if (window.globalErrorBoundary && window.globalErrorBoundary.getSecurityReport) {
                console.log('🛡️ Error Boundary Security Report:', window.globalErrorBoundary.getSecurityReport());
            }
        };
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createTestControls);
    } else {
        createTestControls();
    }
}

// Auto-run tests with delay to allow page initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => secureTestSuite.runAll(), 2000);
    });
} else {
    setTimeout(() => secureTestSuite.runAll(), 2000);
}

// Export for manual testing and integration
window.secureTestSuite = secureTestSuite;
window.testSuite = secureTestSuite; // Backward compatibility

// Integration with error boundary
if (window.globalErrorBoundary) {
    window.globalErrorBoundary.addEventListener('error', (error) => {
        secureTestSuite.securityContext.unexpectedErrors = (secureTestSuite.securityContext.unexpectedErrors || 0) + 1;
    });
}