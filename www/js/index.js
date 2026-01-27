/**
 * AetherView Blog - Main JavaScript
 */

var CONFIG = null;

document.addEventListener('DOMContentLoaded', async function() {
    const savedTheme = localStorage.getItem('theme');    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    //Load config
    load_config_promise = loadConfig();

    // Mobile menu toggle
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Calculate and display read times for articles
    calculateReadTimes();

    CONFIG = await load_config_promise;
    
    // Initialize ad windows
    toggleAds();

    // Initialize article filtering on articles page
    if (window.location.pathname.includes('home.html')) {
        initArticleFiltering();
    }

    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            // In a real implementation, this would filter the posts
            console.log('Filtering by category:', category);
            
            // Mock category filter alert
            alert(`Category filter would show posts in: "${category}" category`);
        });
    });
});

/**
 * Load configuration from config.json
 */
async function loadConfig() {
    const response = await fetch('/data/config.json');
    const config = await response.json();
    return config;
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }
}

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Add fade-in animation to cards as they scroll into view
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add floating animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('floating');
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = form.querySelector('input[type="text"]');
            const query = searchInput.value.trim();
            
            if (query) {
                // In a real implementation, this would search the blog posts
                console.log('Searching for:', query);
                
                // If this is on the articles page, filter articles by search term
                if (window.location.pathname.includes('home.html')) {
                    filterArticlesBySearch(query);
                } else {
                    // For other pages, just show a mock alert
                    alert(`Search functionality would search for: "${query}"`);
                    searchInput.value = '';
                }
            }
        });
    });
}

/**
 * Initialize newsletter form submission handling
 */
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // In a real implementation, this would send the email to a server
                console.log('Newsletter signup:', email);
                
                // Show success message
                const formParent = form.parentElement;
                const successMessage = document.createElement('p');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Thanks for subscribing!';
                successMessage.style.color = 'var(--color-secondary)';
                formParent.appendChild(successMessage);
                
                // Clear the form
                emailInput.value = '';
                
                // Remove the success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } else {
                // Show error message
                const formParent = form.parentElement;
                const errorMessage = document.createElement('p');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'Please enter a valid email address.';
                errorMessage.style.color = '#ff5252';
                formParent.appendChild(errorMessage);
                
                // Remove the error message after 3 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            }
        });
    });
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @return {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Calculate and display read time for articles
 */
function calculateReadTimes() {
    // Average reading speed (words per minute)
    const wordsPerMinute = 200;
    
    // Get all article excerpts
    const excerpts = document.querySelectorAll('.card-excerpt');
    
    excerpts.forEach(excerpt => {
        const text = excerpt.textContent;
        const wordCount = text.split(/\s+/).length;
        const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
        
        // Create read time element
        const readTime = document.createElement('span');
        readTime.classList.add('read-time');
        readTime.textContent = `${readTimeMinutes} min read`;
        readTime.style.marginLeft = 'auto';
        readTime.style.fontSize = '0.85rem';
        readTime.style.color = 'var(--color-text-muted)';
        
        // Add to card meta
        const cardMeta = excerpt.previousElementSibling.previousElementSibling;
        if (cardMeta && cardMeta.classList.contains('card-meta')) {
            cardMeta.appendChild(readTime);
        }
    });
}

/**
 * Initialize ad windows
 */
function toggleAds() {
    if(!CONFIG?.features?.displayAds) {
        const addSlots = document.getElementsByClassName('ad-slot');
        for(const addSlot of addSlots) {
            addSlot.style.display = 'none';
        }
    }   
}

/**
 * Share functionality for social media
 * For real implementation, this would use the Web Share API or custom share dialogs
 */
function sharePost(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support the Web Share API
        alert(`Share: ${title} - ${url}`);
    }
}

/**
 * Dark/Light mode toggle
 * This would be connected to a theme toggle button in a real implementation
 */
function toggleTheme() {
    const body = document.body;
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Article filtering system for the Articles page
 */
function initArticleFiltering() {
    // Get all articles
    const allArticles = document.querySelectorAll('.article-card');
    const articleCount = allArticles.length;
    
    // Set initial results count
    updateResultsCount(articleCount);
    
    // Initialize filter state
    const filterState = {
        categories: [],
        topics: [],
        timeFrame: 'all',
        searchTerm: '',
        sortBy: 'newest'
    };
    
    // Helper function to collect and apply filters
    const applyCurrentFilters = () => {
        // Get selected topics (from category checkboxes)
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        filterState.topics = Array.from(categoryCheckboxes).map(checkbox => checkbox.dataset.topicName);
        
        // Get selected time period
        const timeRadio = document.querySelector('input[name="time"]:checked');
        filterState.timeFrame = timeRadio ? timeRadio.value : 'all';
        
        // Get search term
        const searchInput = document.querySelector('.search-input');
        filterState.searchTerm = searchInput ? searchInput.value.trim() : '';
        
        // Apply all filters using the articles.js function
        if (typeof applyArticleFilters === 'function') {
            applyArticleFilters(filterState);
        } else {
            applyFilters(filterState);
        }
    };
    
    // Apply filters immediately when category checkboxes change
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyCurrentFilters);
    });
    
    // Apply filters immediately when time period radio buttons change
    const timeRadios = document.querySelectorAll('input[name="time"]');
    timeRadios.forEach(radio => {
        radio.addEventListener('change', applyCurrentFilters);
    });
    
    // Apply filters immediately as user types in search box
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        // Use 'input' event to capture changes as they happen
        searchInput.addEventListener('input', applyCurrentFilters);
    }
    
    // Clear filters button
    const clearFilterBtn = document.querySelector('.filter-clear-btn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            // Use the new clearAllFilters function if available
            if (typeof clearAllFilters === 'function') {
                clearAllFilters();
            } else {
                // Fallback to old method
                // Clear checkboxes
                document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Reset time period to 'all'
                const allTimeRadio = document.querySelector('input[value="all"]');
                if (allTimeRadio) allTimeRadio.checked = true;
                
                // Clear search
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.value = '';
                
                // Reset filter state
                filterState.categories = [];
                filterState.topics = [];
                filterState.timeFrame = 'all';
                filterState.searchTerm = '';
                
                // Show all articles
                allArticles.forEach(article => {
                    article.style.display = 'block';
                });
                
                // Update results count
                updateResultsCount(articleCount);
            }
            
            // Show success message
            showFilterMessage('All filters cleared', 'success');
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            filterState.sortBy = sortSelect.value;
            sortArticles(filterState.sortBy);
        });
    }
}

/**
 * Apply all active filters to articles
 * @param {Object} filterState - Current state of filters
 */
function applyFilters(filterState) {
    const articles = document.querySelectorAll('.article-card');
    let visibleCount = 0;
    
    articles.forEach(article => {
        // Default to visible
        let isVisible = true;
        
        // Apply topic filter (checking against article topics)
        if (filterState.topics.length > 0) {
            const articleTags = Array.from(article.querySelectorAll('.article-tag')).map(tag => tag.textContent);
            const topicMatch = filterState.topics.some(selectedTopic => 
                articleTags.includes(selectedTopic)
            );
            
            if (!topicMatch) isVisible = false;
        }
        
        // Apply time period filter
        if (isVisible && filterState.timeFrame !== 'all') {
            const articleDate = article.querySelector('.article-date').textContent;
            const articleTimestamp = new Date(articleDate).getTime();
            const now = new Date().getTime();
            
            switch (filterState.timeFrame) {
                case 'day':
                    const oneDayAgo = now - (24 * 60 * 60 * 1000);
                    if (articleTimestamp < oneDayAgo) isVisible = false;
                    break;
                    
                case 'week':
                    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
                    if (articleTimestamp < oneWeekAgo) isVisible = false;
                    break;
                    
                case 'month':
                    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
                    if (articleTimestamp < oneMonthAgo) isVisible = false;
                    break;
            }
        }
        
        // Apply search term filter
        if (isVisible && filterState.searchTerm) {
            const articleTitle = article.querySelector('h3').textContent.toLowerCase();
            const articleExcerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const searchTerm = filterState.searchTerm.toLowerCase();
            
            if (!articleTitle.includes(searchTerm) && !articleExcerpt.includes(searchTerm)) {
                isVisible = false;
            }
        }
        
        // Apply visibility
        article.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    // Update results count
    updateResultsCount(visibleCount);
    
    // Show message about filters
    if (visibleCount === 0) {
        showFilterMessage('No articles match your filters', 'warning');
    } else {
        showFilterMessage(`Found ${visibleCount} matching articles`, 'success');
    }
}

/**
 * Filter articles by search term
 * @param {string} query - Search query
 */
function filterArticlesBySearch(query) {
    const filterState = {
        topics: [],
        timeFrame: 'all',
        searchTerm: query,
        sortBy: 'newest'
    };
    
    // Update search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = query;
    
    // Apply filters
    applyFilters(filterState);
}

/**
 * Sort articles by the selected criteria
 * @param {string} sortBy - Sort criteria
 */
function sortArticles(sortBy) {
    const articlesContainer = document.querySelector('.articles-grid');
    if (!articlesContainer) return;
    
    const articles = Array.from(articlesContainer.querySelectorAll('.article-card'));
    
    // Sort the articles
    articles.sort((a, b) => {
        const aDate = new Date(a.querySelector('.article-date').textContent).getTime();
        const bDate = new Date(b.querySelector('.article-date').textContent).getTime();
        
        switch (sortBy) {
            case 'newest':
                return bDate - aDate;
            case 'oldest':
                return aDate - bDate;
            case 'popular':
                // This would normally use view counts or similar metrics
                // For now, just randomize order
                return Math.random() - 0.5;
            case 'trending':
                // This would normally use a trending algorithm
                // For now, just randomize order
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
    
    // Clear the container
    articlesContainer.innerHTML = '';
    
    // Add sorted articles back
    articles.forEach(article => {
        articlesContainer.appendChild(article);
    });
}

/**
 * Update the results count display
 * @param {number} count - Number of visible articles
 */
function updateResultsCount(count) {
    const resultsNumber = document.getElementById('results-number');
    if (resultsNumber) {
        resultsNumber.textContent = count;
    }
}

/**
 * Show a message about filter actions
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, warning, error)
 */
function showFilterMessage(message, type = 'info') {
    const resultsHeader = document.querySelector('.results-header');
    if (!resultsHeader) return;
    
    // Remove any existing message
    const existingMessage = document.querySelector('.filter-message');
    if (existingMessage) existingMessage.remove();
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.classList.add('filter-message', `filter-message-${type}`);
    messageEl.textContent = message;
    
    // Style based on type
    switch (type) {
        case 'success':
            messageEl.style.color = 'var(--color-secondary)';
            break;
        case 'warning':
            messageEl.style.color = '#ffc107';
            break;
        case 'error':
            messageEl.style.color = '#ff5252';
            break;
        default:
            messageEl.style.color = 'var(--color-text-muted)';
    }
    
    // Add message to the DOM
    resultsHeader.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}
