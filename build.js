const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Files to copy to dist directory
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
    'js/drag-drop.js'
];

// Copy files to dist directory
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(__dirname, 'dist', file);
    
    // Create directory if needed
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied: ${file}`);
    } else {
        console.warn(`⚠️  File not found: ${file}`);
    }
});

// Create API directory and copy Python files
const apiDir = path.join(__dirname, 'dist', 'api');
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Copy Python serverless functions
const pythonFiles = [
    'bootstrap_generator.py',
    'project_manager.py',
    'requirements.txt'
];

pythonFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(__dirname, 'dist', 'api', file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied Python file: ${file}`);
    } else {
        console.warn(`⚠️  Python file not found: ${file}`);
    }
});

// Process HTML files for production
function processHTMLFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add production optimizations
    content = content.replace(
        '<head>',
        `<head>
    <meta name="robots" content="index, follow">
    <meta name="author" content="CSS Learning Platform">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="CSS Learning Platform">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`
    );
    
    // Add service worker registration
    content = content.replace(
        '</body>',
        `    <script>
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
            });
        }
    </script>
</body>`
    );
    
    fs.writeFileSync(filePath, content);
}

// Process main HTML files
['dist/index.html', 'dist/bootstrap-playground.html', 'dist/flexbox-playground.html', 'dist/css-utilities.html'].forEach(processHTMLFile);

// Create service worker
const serviceWorkerContent = `// Service Worker for CSS Learning Platform
const CACHE_NAME = 'css-learning-platform-v1';
const urlsToCache = [
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
    '/js/drag-drop.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});`;

fs.writeFileSync(path.join(__dirname, 'dist', 'sw.js'), serviceWorkerContent);

// Create _headers file for Netlify (alternative hosting)
const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/api/*
  Cache-Control: s-maxage=300, stale-while-revalidate=600

/static/*
  Cache-Control: public, max-age=31536000, immutable`;

fs.writeFileSync(path.join(__dirname, 'dist', '_headers'), headersContent);

// Create robots.txt
const robotsContent = `User-agent: *
Allow: /

Sitemap: https://css-learning-platform.vercel.app/sitemap.xml`;

fs.writeFileSync(path.join(__dirname, 'dist', 'robots.txt'), robotsContent);

// Create sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://css-learning-platform.vercel.app/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/bootstrap-playground.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/flexbox-playground.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://css-learning-platform.vercel.app/css-utilities.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), sitemapContent);

console.log('\n🎉 Build completed successfully!');
console.log('📁 Files ready for deployment in ./dist directory');
console.log('🚀 Deploy to Vercel: vercel --prod');
console.log('🌐 Or deploy to Netlify by uploading ./dist folder');