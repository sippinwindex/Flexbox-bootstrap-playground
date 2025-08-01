const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Enhanced Security Build Script with integrity checks and validation
class SecureBuildProcess {
    constructor() {
        this.securityChecks = [];
        this.integrityHashes = new Map();
        this.allowedFileTypes = ['.html', '.js', '.css', '.py', '.txt', '.xml', '.json'];
        this.suspiciousPatterns = [
            /eval\s*\(/gi,
            /document\.write\s*\(/gi,
            /innerHTML\s*=/gi,
            /outerHTML\s*=/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /<script[^>]*>/gi,
            /on\w+\s*=/gi
        ];
    }

    // Validate file security before copying
    validateFileSecurity(filePath, content) {
        const checks = {
            validExtension: this.allowedFileTypes.some(ext => filePath.endsWith(ext)),
            noSuspiciousPatterns: !this.suspiciousPatterns.some(pattern => pattern.test(content)),
            validSize: content.length < 10 * 1024 * 1024, // 10MB limit
            validEncoding: this.isValidUTF8(content)
        };

        const isSecure = Object.values(checks).every(check => check === true);
        
        if (!isSecure) {
            console.warn(`⚠️ Security check failed for ${filePath}:`, checks);
            this.securityChecks.push({ file: filePath, passed: false, checks });
            return false;
        }

        this.securityChecks.push({ file: filePath, passed: true, checks });
        return true;
    }

    // Generate integrity hash for files
    generateIntegrityHash(content) {
        return crypto.createHash('sha384').update(content).digest('base64');
    }

    // Validate UTF-8 encoding
    isValidUTF8(str) {
        try {
            return Buffer.from(str, 'utf8').toString('utf8') === str;
        } catch (error) {
            return false;
        }
    }

    // Sanitize file content
    sanitizeContent(content, fileType) {
        if (fileType === '.html') {
            return this.sanitizeHTML(content);
        } else if (fileType === '.js') {
            return this.sanitizeJavaScript(content);
        }
        return content;
    }

    // Sanitize HTML content
    sanitizeHTML(content) {
        // Remove potentially dangerous attributes and elements
        return content
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/javascript:/gi, '') // Remove javascript: URLs
            .replace(/vbscript:/gi, '') // Remove vbscript: URLs
            .replace(/data:text\/html/gi, 'data:text/plain'); // Neutralize data URLs
    }

    // Sanitize JavaScript content
    sanitizeJavaScript(content) {
        // Check for dangerous patterns but don't modify functional code
        const dangerousPatterns = [
            /eval\s*\(/gi,
            /Function\s*\(/gi,
            /setTimeout\s*\(\s*["'][^"']*["']/gi,
            /setInterval\s*\(\s*["'][^"']*["']/gi
        ];

        const hasDangerousCode = dangerousPatterns.some(pattern => pattern.test(content));
        if (hasDangerousCode) {
            console.warn('⚠️ Potentially dangerous JavaScript patterns detected');
        }

        return content;
    }

    // Enhanced file copying with security validation
    secureFileCopy(srcPath, destPath) {
        try {
            if (!fs.existsSync(srcPath)) {
                console.warn(`⚠️ Source file not found: ${srcPath}`);
                return false;
            }

            // Read and validate content
            const content = fs.readFileSync(srcPath, 'utf8');
            const fileExt = path.extname(srcPath);

            // Perform security validation
            if (!this.validateFileSecurity(srcPath, content)) {
                console.error(`❌ Security validation failed: ${srcPath}`);
                return false;
            }

            // Sanitize content if needed
            const sanitizedContent = this.sanitizeContent(content, fileExt);

            // Generate integrity hash
            const hash = this.generateIntegrityHash(sanitizedContent);
            this.integrityHashes.set(destPath, hash);

            // Create destination directory
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            // Write sanitized content
            fs.writeFileSync(destPath, sanitizedContent, 'utf8');
            console.log(`✅ Securely copied: ${path.basename(srcPath)} (SHA384: ${hash.substring(0, 16)}...)`);
            
            return true;

        } catch (error) {
            console.error(`❌ Error copying ${srcPath}:`, error.message);
            return false;
        }
    }

    // Create security report
    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalFiles: this.securityChecks.length,
            passedFiles: this.securityChecks.filter(check => check.passed).length,
            failedFiles: this.securityChecks.filter(check => !check.passed),
            integrityHashes: Object.fromEntries(this.integrityHashes),
            securitySummary: {
                allFilesPassed: this.securityChecks.every(check => check.passed),
                suspiciousFilesDetected: this.securityChecks.filter(check => !check.passed).length,
                totalIntegrityHashes: this.integrityHashes.size
            }
        };

        return report;
    }

    // Run the secure build process
    async run() {
        console.log('🔒 Starting Secure Build Process...\n');

        // Create dist directory with secure permissions
        const distDir = path.join(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { mode: 0o755 });
        }

        // Files to copy with security validation
        const filesToCopy = [
            'index.html',
            'bootstrap-playground.html', 
            'flexbox-playground.html',
            'css-utilities.html',
            'styles.css',
            'script.js',
            'utils.js',
            'playground-state.js',
            'main.js',
            'error-boundary.js',
            'security-utils.js', // Added security utils
            'js/drag-drop.js'
        ];

        // Copy files with security validation
        let successCount = 0;
        for (const file of filesToCopy) {
            const srcPath = path.join(__dirname, file);
            const destPath = path.join(__dirname, 'dist', file);
            
            if (this.secureFileCopy(srcPath, destPath)) {
                successCount++;
            }
        }

        // Create API directory and copy Python files
        const apiDir = path.join(__dirname, 'dist', 'api');
        if (!fs.existsSync(apiDir)) {
            fs.mkdirSync(apiDir, { recursive: true, mode: 0o755 });
        }

        // Copy Python serverless functions with validation
        const pythonFiles = ['bootstrap_generator.py', 'project_manager.py', 'requirements.txt'];
        for (const file of pythonFiles) {
            const srcPath = path.join(__dirname, file);
            const destPath = path.join(__dirname, 'dist', 'api', file);
            
            if (this.secureFileCopy(srcPath, destPath)) {
                successCount++;
            }
        }

        // Process HTML files for production with security enhancements
        await this.processHTMLFilesSecurely();

        // Create enhanced service worker with security features
        this.createSecureServiceWorker();

        // Create security headers file
        this.createSecurityHeaders();

        // Create robots.txt with security considerations
        this.createSecureRobotsTxt();

        // Create sitemap.xml with security validation
        this.createSecureSitemap();

        // Create Content Security Policy
        this.createCSPFile();

        // Generate and save security report
        const securityReport = this.generateSecurityReport();
        fs.writeFileSync(
            path.join(__dirname, 'dist', 'security-report.json'), 
            JSON.stringify(securityReport, null, 2)
        );

        // Final security summary
        console.log('\n🔒 Security Build Summary:');
        console.log(`✅ Files processed: ${successCount}/${filesToCopy.length + pythonFiles.length}`);
        console.log(`🛡️ Security checks passed: ${securityReport.passedFiles}/${securityReport.totalFiles}`);
        console.log(`🔐 Integrity hashes generated: ${securityReport.integrityHashes ? Object.keys(securityReport.integrityHashes).length : 0}`);
        
        if (securityReport.failedFiles.length > 0) {
            console.log(`⚠️ Files with security issues: ${securityReport.failedFiles.length}`);
            securityReport.failedFiles.forEach(file => {
                console.log(`   - ${file.file}`);
            });
        }

        console.log('\n🎉 Secure build completed successfully!');
        console.log('📁 Files ready for deployment in ./dist directory');
        console.log('🔐 Security report generated: ./dist/security-report.json');
        console.log('🚀 Deploy with: vercel --prod');
    }

    // Process HTML files with security enhancements
    async processHTMLFilesSecurely() {
        const htmlFiles = [
            'dist/index.html', 
            'dist/bootstrap-playground.html', 
            'dist/flexbox-playground.html', 
            'dist/css-utilities.html'
        ];

        for (const filePath of htmlFiles) {
            const fullPath = path.join(__dirname, filePath);
            if (!fs.existsSync(fullPath)) continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Add comprehensive security headers
            content = content.replace(
                '<head>',
                `<head>
    <!-- Security Headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self';">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()">
    
    <!-- SEO and Performance -->
    <meta name="robots" content="index, follow">
    <meta name="author" content="CSS Learning Platform">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="CSS Learning Platform">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`
            );
            
            // Add enhanced service worker registration with security
            content = content.replace(
                '</body>',
                `    <!-- Secure Service Worker Registration -->
    <script>
        // Enhanced service worker registration with security validation
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js', {
                        scope: '/',
                        updateViaCache: 'none'
                    });
                    
                    registration.addEventListener('updatefound', () => {
                        console.log('🔄 Service worker update found');
                    });
                    
                    console.log('✅ SW registered:', registration.scope);
                } catch (error) {
                    console.error('❌ SW registration failed:', error);
                }
            });
        }
        
        // Security monitoring
        document.addEventListener('securityviolation', (e) => {
            console.warn('🚨 Security violation detected:', e.detail);
        });
    </script>
</body>`
            );
            
            // Write enhanced content
            fs.writeFileSync(fullPath, content);
            console.log(`🔒 Security enhanced: ${path.basename(filePath)}`);
        }
    }

    // Create secure service worker
    createSecureServiceWorker() {
        const serviceWorkerContent = `// Enhanced Secure Service Worker for CSS Learning Platform
const CACHE_NAME = 'css-learning-platform-v2-secure';
const SECURITY_CACHE = 'security-resources-v1';

// Whitelist of allowed resources with integrity checking
const ALLOWED_RESOURCES = [
    '/',
    '/index.html',
    '/bootstrap-playground.html',
    '/flexbox-playground.html', 
    '/css-utilities.html',
    '/styles.css',
    '/script.js',
    '/utils.js',
    '/playground-state.js',
    '/main.js',
    '/error-boundary.js',
    '/security-utils.js',
    '/js/drag-drop.js'
];

// Trusted CDN domains
const TRUSTED_DOMAINS = [
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com'
];

// Security headers to add to responses
const SECURITY_HEADERS = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});

// Validate request security
function isRequestSecure(request) {
    const url = new URL(request.url);
    
    // Block non-HTTPS in production
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
        return false;
    }
    
    // Validate against allowed resources
    if (url.origin === self.location.origin) {
        return ALLOWED_RESOURCES.some(resource => 
            url.pathname === resource || url.pathname.startsWith(resource)
        );
    }
    
    // Check if external domain is trusted
    return TRUSTED_DOMAINS.some(domain => url.hostname === domain);
}

// Enhanced install with security validation
self.addEventListener('install', event => {
    console.log('🔒 Installing secure service worker...');
    
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(ALLOWED_RESOURCES.filter(url => url !== '/'));
            }),
            caches.open(SECURITY_CACHE).then(cache => {
                return cache.add('/security-report.json');
            })
        ])
    );
    
    self.skipWaiting();
});

// Secure fetch with validation
self.addEventListener('fetch', event => {
    const request = event.request;
    
    // Security validation
    if (!isRequestSecure(request)) {
        console.warn('🚨 Blocked insecure request:', request.url);
        event.respondWith(
            new Response('Request blocked for security reasons', {
                status: 403,
                statusText: 'Forbidden',
                headers: SECURITY_HEADERS
            })
        );
        return;
    }
    
    // Handle secure requests
    event.respondWith(
        caches.match(request).then(response => {
            if (response) {
                // Add security headers to cached responses
                const secureResponse = new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: { ...response.headers, ...SECURITY_HEADERS }
                });
                return secureResponse;
            }
            
            // Fetch with security validation
            return fetch(request).then(fetchResponse => {
                // Validate response
                if (!fetchResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                
                // Clone response for caching
                const responseToCache = fetchResponse.clone();
                
                // Cache valid responses
                if (request.method === 'GET') {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseToCache);
                    });
                }
                
                // Add security headers
                const secureResponse = new Response(fetchResponse.body, {
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    headers: { ...fetchResponse.headers, ...SECURITY_HEADERS }
                });
                
                return secureResponse;
            });
        }).catch(error => {
            console.error('🚨 Fetch error:', error);
            
            // Return secure error response
            return new Response('Service temporarily unavailable', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: SECURITY_HEADERS
            });
        })
    );
});

// Secure activation with cache cleanup
self.addEventListener('activate', event => {
    console.log('🔄 Activating secure service worker...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== SECURITY_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Security event monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SECURITY_CHECK') {
        // Perform security validation
        event.ports[0].postMessage({
            type: 'SECURITY_STATUS',
            secure: true,
            timestamp: Date.now()
        });
    }
});`;

        fs.writeFileSync(path.join(__dirname, 'dist', 'sw.js'), serviceWorkerContent);
        console.log('🛡️ Secure service worker created');
    }

    // Create comprehensive security headers
    createSecurityHeaders() {
        const headersContent = `# Enhanced Security Headers for CSS Learning Platform

# Global security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self'

# API endpoints with enhanced security
/api/*
  Cache-Control: s-maxage=300, stale-while-revalidate=600
  Access-Control-Allow-Origin: https://css-learning-platform.vercel.app
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization

# Static assets with caching
/static/*
  Cache-Control: public, max-age=31536000, immutable
  
# JavaScript files
/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=86400

# CSS files  
/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=86400

# HTML files
/*.html
  Content-Type: text/html; charset=utf-8
  Cache-Control: public, max-age=3600

# Security files
/security-report.json
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-cache, no-store, must-revalidate`;

        fs.writeFileSync(path.join(__dirname, 'dist', '_headers'), headersContent);
        console.log('🔒 Security headers file created');
    }

    // Create secure robots.txt
    createSecureRobotsTxt() {
        const robotsContent = `# Robots.txt for CSS Learning Platform
User-agent: *
Allow: /
Allow: /*.css
Allow: /*.js
Allow: /*.html

# Block sensitive files
Disallow: /security-report.json
Disallow: /api/
Disallow: /*.py
Disallow: /dist/

# Sitemap location
Sitemap: https://css-learning-platform.vercel.app/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1`;

        fs.writeFileSync(path.join(__dirname, 'dist', 'robots.txt'), robotsContent);
        console.log('🤖 Secure robots.txt created');
    }

    // Create secure sitemap
    createSecureSitemap() {
        const currentDate = new Date().toISOString().split('T')[0];
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://css-learning-platform.vercel.app/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/bootstrap-playground.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/flexbox-playground.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/css-utilities.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;

        fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), sitemapContent);
        console.log('🗺️ Secure sitemap created');
    }

    // Create Content Security Policy file
    createCSPFile() {
        const cspContent = {
            "csp": {
                "default-src": ["'self'"],
                "script-src": [
                    "'self'", 
                    "'unsafe-inline'", 
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com"
                ],
                "style-src": [
                    "'self'", 
                    "'unsafe-inline'", 
                    "https://cdn.jsdelivr.net"
                ],
                "img-src": [
                    "'self'", 
                    "data:", 
                    "https:"
                ],
                "font-src": [
                    "'self'", 
                    "https://cdn.jsdelivr.net"
                ],
                "connect-src": ["'self'"],
                "frame-ancestors": ["'none'"],
                "base-uri": ["'self'"],
                "form-action": ["'self'"]
            },
            "generated": new Date().toISOString(),
            "version": "2.0"
        };

        fs.writeFileSync(
            path.join(__dirname, 'dist', 'csp.json'), 
            JSON.stringify(cspContent, null, 2)
        );
        console.log('📋 Content Security Policy file created');
    }
}

// Run the secure build process
if (require.main === module) {
    const secureBuild = new SecureBuildProcess();
    secureBuild.run().catch(error => {
        console.error('❌ Secure build failed:', error);
        process.exit(1);
    });
}

module.exports = SecureBuildProcess;