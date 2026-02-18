/**
 * AetherView Router
 * Handles SPA-like navigation between pages by loading content dynamically
 */

let currentPage = 'home';
const router_logging = false;
const loadedScripts = new Set(); // Track loaded external scripts to avoid duplicates

// Initialize immediately and also on DOMContentLoaded to ensure it runs
initRouter();

document.addEventListener('DOMContentLoaded', () => {
    if (router_logging) console.log('DOM fully loaded, initializing router...');
    initRouter();
    
    // Safety timeout to hide loading indicators if they're still visible
    setTimeout(() => {
        const loadingIndicators = document.querySelectorAll('.loading-indicator');
        if (loadingIndicators.length > 0) {
            if (router_logging) console.log('Found loading indicators still visible, hiding them');
            loadingIndicators.forEach(indicator => {
                indicator.style.display = 'none';
            });
        }
    }, 3000);
});

function initRouter() {
    if (router_logging) console.log('Initializing router...');
    
    // Get the site content container
    const contentContainer = document.getElementById('site-content');
    if (!contentContainer) {
        console.error('Error: site-content container not found!');
        return;
    }
    
    if (router_logging) console.log('Content container found:', contentContainer);
    
    // Initial page load
    const currentPath = window.location.pathname;
    if (router_logging) console.log('Current path:', currentPath);
    currentPage = getPageFromPath(currentPath);
    if (router_logging) console.log('Current page:', currentPage);
    loadContent(currentPage);
    
    // Clear any existing event listeners using clone/replace technique
    const navLinks = document.querySelectorAll('.main-nav a, .footer-links a');
    if (router_logging) console.log('Found', navLinks.length, 'navigation links');
    
    navLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            if (router_logging) console.log('Link clicked:', this.getAttribute('href'));
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            const pageName = this.getAttribute('data-page') || getPageFromPath(href);
            if (router_logging) console.log('Navigating to page:', pageName, 'URL:', href);
            
            // Don't reload if clicking the current page
            if (pageName === currentPage) {
                if (router_logging) console.log('Already on page', pageName, '- not reloading');
                return;
            }
            
            navigateTo(pageName, href);
            return false;
        });
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        if (router_logging) console.log('Popstate event triggered', e.state);
        if (e.state && e.state.page) {
            loadContent(e.state.page, false);
            updateActiveNav(e.state.page);
        }
    });
    
    if (router_logging) console.log('Router initialization complete');
}

/**
 * Navigate to a specific page
 * @param {string} pageName - The page name to navigate to
 * @param {string} url - The URL to update in the browser history
 */
function navigateTo(pageName, url) {
    if (router_logging) console.log('navigateTo() called with page:', pageName, 'URL:', url);
    
    try {
        // Push state to browser history
        const state = { page: pageName };
        window.history.pushState(state, '', url);
        if (router_logging) console.log('History state pushed:', state);
        
        // Update current page
        currentPage = pageName;
        
        // Load the content
        loadContent(pageName, false); // Don't update history again
        
        // Update active navigation
        updateActiveNav(pageName);
    } catch (error) {
        console.error('Error in navigateTo():', error);
    }
}

/**
 * Get page name from path
 * @param {string} path - The URL path
 * @returns {string} - The page name for content loading
 */
function getPageFromPath(path) {
    // Extract the page name from the URL path
    const pageName = path.split('/').pop().split('.')[0];
    
    // Default to home if no page specified
    return pageName === '' || pageName === 'index' ? 'home' : pageName;
}

/**
 * Update the active navigation link
 * @param {string} page - The current active page
 */
function updateActiveNav(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.main-nav a, .footer-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to links that match the current page
    document.querySelectorAll(`.main-nav a[data-page="${page}"], .footer-links a[data-page="${page}"]`).forEach(link => {
        link.classList.add('active');
    });
}

/**
 * Load content from the content HTML file
 * @param {string} page - The page name to load
 * @param {boolean} updateHistory - Whether to update browser history
 */
function loadContent(page, updateHistory = true) {
    if (router_logging) console.log('loadContent() called for page:', page);
    
    const contentContainer = document.getElementById('site-content');
    if (!contentContainer) {
        console.error('Content container not found!');
        return;
    }
    
    const contentUrl = `content/${page}.html`;
    if (router_logging) console.log('Loading content from:', contentUrl);
    
    // Show loading indicator
    contentContainer.innerHTML = `
        <div class="loading-indicator" id="page-loading-indicator">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `;
    if (router_logging) console.log('Loading indicator displayed');
    
    // Fetch and load the content
    fetch(contentUrl)
        .then(response => {
            if (router_logging) console.log('Fetch response received:', response.status);
            if (!response.ok) {
                throw new Error(`Page not found. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            if (router_logging) console.log('Content fetched successfully, length:', html.length);
            // Set the content
            contentContainer.innerHTML = html;
            
            // Execute scripts in the loaded content (important for page-specific code)
            const scripts = contentContainer.querySelectorAll('script');
            if (router_logging) console.log('Found', scripts.length, 'scripts in loaded content');
            
            // Dispatch pageLoaded event for other components to initialize
            document.dispatchEvent(new CustomEvent('pageLoaded', {
                detail: {
                    page: page
                }
            }));
            if (router_logging) console.log('Page loaded event dispatched for:', page);
            
            scripts.forEach((script, index) => {
                if (router_logging) console.log('Processing script', index + 1);
                
                // Check if this is an external script with a valid src
                let src = script.getAttribute('src');
                
                // Skip invalid src values
                if (src === 'undefined' || !src) {
                    if (router_logging) console.log('Script', index + 1, 'has invalid src, skipping');
                    src = null;
                }
                
                // If external script already loaded, skip it
                if (src && loadedScripts.has(src)) {
                    if (router_logging) console.log('Script', index + 1, 'already loaded, skipping:', src);
                    script.remove(); // Remove the duplicate script tag
                    return;
                }
                
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    // Ensure src attribute is not undefined or empty
                    if (attr.name === 'src' && (!attr.value || attr.value === 'undefined')) {
                        console.warn('Skipping invalid script source:', attr.value);
                    } else {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Copy the content
                newScript.textContent = script.textContent;
                
                // Track external scripts
                if (src && src !== 'undefined') {
                    loadedScripts.add(src);
                    if (router_logging) console.log('Tracking external script:', src);
                }
                
                // Replace the old script with the new one
                script.parentNode.replaceChild(newScript, script);
                if (router_logging) console.log('Script', index + 1, 'replaced and executed');
            });    

            // Toggle ads
            toggleAds();

            // Set the current page
            currentPage = page;
            if (router_logging) console.log('Current page updated to:', currentPage);
            
            // Update active nav links
            updateActiveNav(page);
            
            // Scroll to top
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            contentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>We couldn't load the requested page. Please try again later.</p>
                    <p class="error-details">${error.message}</p>
                    <a href="index.html" class="btn btn-primary">Return to Home</a>
                </div>
            `;
        });
}
