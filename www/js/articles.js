/**
 * AetherView Blog - Articles Module
 * Handles loading, filtering, and displaying article data from JSON
 */

// Global articles cache
let articlesData = [];
let currentArticlePage = 1;
let articlesPerPage = 6;
let currentFilteredArticles = [];
const article_logging = false;
const excerptMaxLength = 400;

/**
 * Initialize the articles module
 */
function initArticles() {
    if (article_logging) console.log('Initializing articles module...');
    
    // Check if configuration is loaded
    if (window.AetherViewConfig && window.AetherViewConfig.get) {
        // Apply config settings if available
        const config = window.AetherViewConfig.get();
        if (article_logging) console.log('Using configuration:', config);
    } else {
        if (article_logging) console.log('Configuration not yet available, using defaults');
        // Configuration will be applied once it loads
        document.addEventListener('configLoaded', (event) => {
            if (article_logging) console.log('Configuration loaded, updating article display');
            initArticleComponents();
        });
    }
    
    // Load articles
    loadArticles();
}

/**
 * Load articles from the JSON file
 */
function loadArticles() {
    if (article_logging) console.log('Loading articles from JSON...');
    
    fetch('/data/articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load articles: ${response.status}`);
            }
            return response.text();
        })
        .then(json => {
            try {
                articlesData = JSON.parse(json);
                if (article_logging) console.log(`Loaded ${articlesData.length} articles successfully`);
                
                // Dispatch a custom event to notify that articles are loaded
                const event = new CustomEvent('articlesLoaded', { detail: { articles: articlesData } });
                document.dispatchEvent(event);
                
                // Initialize article-related components based on current page
                initArticleComponents();
            } catch (error) {
                console.error('Error parsing articles JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error loading articles:', error);
        });
}

/**
 * Initialize article-related components based on the current page
 */
function initArticleComponents() {
    // Check which page we're on and initialize appropriate components
    const path = window.location.pathname;
    const currentHash = window.location.hash;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        // Home page - now shows articles
        if (article_logging) console.log('Initializing home page with articles');
        initArticleListings();
    } else if (path.includes('home.html') || currentHash === '#home') {
        // Articles page or home page via hash
        if (article_logging) console.log('Initializing articles page components');
        initArticleListings();
    }
    
    // Initialize search on all pages
    initArticleSearch();
}

/**
 * Initialize featured articles section on home page
 */
function initFeaturedArticles() {
    const featuredContainer = document.querySelector('#featured .card-grid');
    if (!featuredContainer) return;
    
    // Get featured articles
    const featuredArticles = articlesData
        .filter(article => article.featured)
        .slice(0, 3); // Limit to 3 featured articles
    
    // Always clear existing content
    featuredContainer.innerHTML = '';
    
    if (featuredArticles.length > 0) {
        // Create article elements
        featuredArticles.forEach((article, index) => {
            const articleElement = createArticleCard(article, index === 0 ? 'featured' : '');
            featuredContainer.appendChild(articleElement);
        });
    } else {
        // Add default placeholder content
        const placeholderElement = document.createElement('div');
        placeholderElement.className = 'no-featured';
        placeholderElement.innerHTML = `<p>No featured articles available at this time.</p>`;
        featuredContainer.appendChild(placeholderElement);
    }
}

/**
 * Initialize latest articles section
 */
function initLatestArticles() {
    const latestContainer = document.querySelector('.more-articles');
    if (!latestContainer) return;
    
    // Get latest articles (sorted by date, excluding featured articles)
    const latestArticles = articlesData
        .filter(article => !article.featured)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2); // Limit to 2 latest articles
    
    // Always clear existing content
    latestContainer.innerHTML = '';
    
    if (latestArticles.length > 0) {
        // Create article elements
        latestArticles.forEach(article => {
            const articleElement = createArticleCard(article, 'compact');
            latestContainer.appendChild(articleElement);
        });
    } else {
        // Add default placeholder content
        const placeholderElement = document.createElement('div');
        placeholderElement.className = 'no-latest';
        placeholderElement.innerHTML = `<p>No recent articles available.</p>`;
        latestContainer.appendChild(placeholderElement);
    }
}

/**
 * Initialize popular articles sidebar
 */
function initPopularArticles() {
    const popularContainer = document.querySelector('.popular-posts');
    if (!popularContainer) return;
    
    // Get trending articles
    const trendingArticles = articlesData
        .filter(article => article.trending)
        .slice(0, 3); // Limit to 3 trending articles
    
    // Always clear existing content
    popularContainer.innerHTML = '';
    
    if (trendingArticles.length > 0) {
        // Create article elements
        trendingArticles.forEach(article => {
            const li = document.createElement('li');
            // Default thumbnail image for articles without one
            const thumbnailUrl = article.thumbnailUrl || 'images/placeholders/article-thumb.svg';
            
            li.innerHTML = `
                <a href="narticles/${article.filename.endsWith('.html') ? article.filename : article.filename + '.html'}">
                    <img src="${thumbnailUrl}" alt="${article.title}">
                    <div>
                        <h4>${article.title}</h4>
                    </div>
                </a>
            `;
            popularContainer.appendChild(li);
        });
    } else {
        // Add default content when no trending articles
        const li = document.createElement('li');
        li.className = 'no-trending';
        li.innerHTML = `<p>No trending articles at this time.</p>`;
        popularContainer.appendChild(li);
    }
}

/**
 * Initialize article listings for the articles page
 */
function initArticleListings() {
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;
    
    // Sort articles by date (newest first)
    const sortedArticles = [...articlesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    currentFilteredArticles = sortedArticles;
    
    // Reset to page 1
    currentArticlePage = 1;
    
    // Display articles with pagination
    displayArticlesPage(currentArticlePage);
    
    // Populate category filters from article topics
    populateCategoryFilters();
    
    // Initialize filter functionality
    initArticleFiltering();
}

/**
 * Populate category filter checkboxes from all unique article topics
 */
function populateCategoryFilters() {
    if (article_logging) console.log('populateCategoryFilters() called');
    const categoryFiltersContainer = document.getElementById('category-filters');
    if (!categoryFiltersContainer) {
        if (article_logging) console.log('category-filters element NOT FOUND in DOM');
        return;
    }
    if (article_logging) console.log('category-filters element found, articlesData.length:', articlesData.length);
    
    // Don't proceed if articles haven't loaded yet
    if (!articlesData || articlesData.length === 0) {
        if (article_logging) console.log('Articles not loaded yet, skipping category filter population');
        return;
    }
    
    // Extract all unique topics from all articles
    const allTopics = new Set();
    articlesData.forEach(article => {
        if (article.topics && Array.isArray(article.topics)) {
            article.topics.forEach(topic => allTopics.add(topic));
        }
    });
    
    // Sort topics alphabetically
    const sortedTopics = Array.from(allTopics).sort();
    
    // Clear existing content
    categoryFiltersContainer.innerHTML = '';
    
    // Create checkbox for each topic
    sortedTopics.forEach(topic => {
        const label = document.createElement('label');
        label.className = 'filter-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'category';
        checkbox.value = topic.toLowerCase().replace(/\s+/g, '-');
        checkbox.dataset.topicName = topic; // Store original topic name for filtering
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + topic));
        categoryFiltersContainer.appendChild(label);
    });
    
    if (article_logging) console.log(`Populated ${sortedTopics.length} category filters from article topics`);
}

/**
 * Display a specific page of articles
 * @param {number} page - Page number to display
 */
function displayArticlesPage(page) {
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;
    
    // Calculate current distance from bottom before changing content
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const distanceFromBottom = documentHeight - (scrollY + windowHeight);
    
    // Calculate pagination
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const pageArticles = currentFilteredArticles.slice(startIndex, endIndex);
    
    // Always clear existing content first
    articlesGrid.innerHTML = '';
    
    if (pageArticles.length > 0) {
        // Create article elements
        pageArticles.forEach(article => {
            const articleElement = createArticleListItem(article);
            articlesGrid.appendChild(articleElement);
        });
        
        // Update results count
        const resultsNumber = document.getElementById('results-number');
        if (resultsNumber) {
            resultsNumber.textContent = currentFilteredArticles.length;
        }
    } else {
        // If no articles, show message
        articlesGrid.innerHTML = `
            <div class="no-results">
                <h3>No articles found</h3>
                <p>There are no articles available at this time.</p>
            </div>
        `;
    }
    
    // Update pagination controls
    updatePaginationControls();
    
    // Restore scroll position relative to bottom after content has been rendered
    // Use setTimeout with 0 for faster execution than requestAnimationFrame
    setTimeout(() => {
        const newDocumentHeight = document.documentElement.scrollHeight;
        const newWindowHeight = window.innerHeight;
        const newScrollY = newDocumentHeight - distanceFromBottom - newWindowHeight;
        
        // Only scroll if the calculated position is valid
        if (newScrollY >= 0 && newScrollY <= newDocumentHeight - newWindowHeight) {
            window.scrollTo({
                top: newScrollY,
                left: 0,
                behavior: 'auto' // Instant scroll, no animation
            });
        }
    }, 0);
}

/**
 * Update pagination controls based on current page and total articles
 */
function updatePaginationControls() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(currentFilteredArticles.length / articlesPerPage);
    
    // Hide pagination if only one page or no articles
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    } else {
        pagination.style.display = 'flex';
    }
    
    // Get pagination elements
    const prevButton = pagination.querySelector('.pagination-prev');
    const nextButton = pagination.querySelector('.pagination-next');
    const numbersContainer = pagination.querySelector('.pagination-numbers');
    
    if (!prevButton || !nextButton || !numbersContainer) return;
    
    // Update Previous button
    if (currentArticlePage <= 1) {
        prevButton.classList.add('disabled');
        prevButton.style.pointerEvents = 'none';
    } else {
        prevButton.classList.remove('disabled');
        prevButton.style.pointerEvents = 'auto';
    }
    
    // Update Next button
    if (currentArticlePage >= totalPages) {
        nextButton.classList.add('disabled');
        nextButton.style.pointerEvents = 'none';
    } else {
        nextButton.classList.remove('disabled');
        nextButton.style.pointerEvents = 'auto';
    }
    
    // Update page numbers
    numbersContainer.innerHTML = '';
    
    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = createPageLink(i);
            numbersContainer.appendChild(pageLink);
        }
    } else {
        // Show first page
        numbersContainer.appendChild(createPageLink(1));
        
        if (currentArticlePage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            numbersContainer.appendChild(ellipsis);
        }
        
        // Show pages around current page
        const startPage = Math.max(2, currentArticlePage - 1);
        const endPage = Math.min(totalPages - 1, currentArticlePage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageLink = createPageLink(i);
            numbersContainer.appendChild(pageLink);
        }
        
        if (currentArticlePage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            numbersContainer.appendChild(ellipsis);
        }
        
        // Show last page
        numbersContainer.appendChild(createPageLink(totalPages));
    }
    
    // Add event listeners to pagination buttons
    prevButton.onclick = (e) => {
        e.preventDefault();
        if (currentArticlePage > 1) {
            currentArticlePage--;
            displayArticlesPage(currentArticlePage);
        }
    };
    
    nextButton.onclick = (e) => {
        e.preventDefault();
        if (currentArticlePage < totalPages) {
            currentArticlePage++;
            displayArticlesPage(currentArticlePage);
        }
    };
}

/**
 * Create a page number link
 * @param {number} pageNum - Page number
 * @returns {HTMLElement} Page link element
 */
function createPageLink(pageNum) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = pageNum;
    
    if (pageNum === currentArticlePage) {
        link.classList.add('active');
    }
    
    link.onclick = (e) => {
        e.preventDefault();
        currentArticlePage = pageNum;
        displayArticlesPage(currentArticlePage);
    };
    
    return link;
}

/**
 * Initialize article search functionality
 */
function initArticleSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = form.querySelector('input[type="text"], input[name="search"]');
            const query = searchInput.value.trim();
            
            if (query) {
                // If on articles page or home page, filter directly
                if (window.location.pathname.includes('articles') || 
                    window.location.hash === '#articles' || 
                    window.location.hash === '#home' || 
                    window.location.hash === '') {
                    filterArticlesBySearch(query);
                } else {
                    // On other pages, navigate to home page with search query
                    window.location.href = `#home?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });
}

/**
 * Filter articles by search query
 * @param {string} query - Search term
 */
function filterArticlesBySearch(query) {
    // Normalize query for case-insensitive comparison
    const normalizedQuery = query.toLowerCase();
    
    // Filter articles based on search term
    const filteredArticles = articlesData.filter(article => {
        // Search in title, excerpt, author, category, topics
        return article.title.toLowerCase().includes(normalizedQuery) ||
               article.excerpt.toLowerCase().includes(normalizedQuery) ||
               article.author.toLowerCase().includes(normalizedQuery) ||
               article.category.toLowerCase().includes(normalizedQuery) ||
               article.topics.some(topic => topic.toLowerCase().includes(normalizedQuery));
    });
    
    // Update filtered articles and reset to page 1
    currentFilteredArticles = filteredArticles;
    currentArticlePage = 1;
    
    // Display filtered articles with pagination
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;
    
    if (filteredArticles.length > 0) {
        displayArticlesPage(currentArticlePage);
    } else {
        // Show no results message
        articlesGrid.innerHTML = `
            <div class="no-results">
                <h3>No articles found</h3>
                <p>No articles match your search term: "${query}"</p>
                <button class="btn btn-primary reset-search-btn">Clear Search</button>
            </div>
        `;
        
        // Add event listener for reset button
        const resetBtn = articlesGrid.querySelector('.reset-search-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Clear search input
                const searchInputs = document.querySelectorAll('.search-form input');
                searchInputs.forEach(input => input.value = '');
                
                // Show all articles
                initArticleListings();
            });
        }
        
        // Hide pagination when no results
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
    }
    
    // Show filter message
    showFilterMessage(`Found ${filteredArticles.length} matching articles for "${query}"`, 
                      filteredArticles.length > 0 ? 'success' : 'warning');
}

/**
 * Apply category and time period filters to articles
 * @param {Object} filterState - Object containing filter selections
 */
function applyArticleFilters(filterState) {
    if (article_logging) console.log('Applying filters:', filterState);
    
    // Start with all articles
    let filteredArticles = [...articlesData];
    
    // Apply category/topic filter
    if (filterState.topics && filterState.topics.length > 0) {
        filteredArticles = filteredArticles.filter(article => {
            // Check if article has any of the selected topics
            return article.topics && article.topics.some(topic => 
                filterState.topics.includes(topic)
            );
        });
    }
    
    // Apply time period filter
    if (filterState.timeFrame && filterState.timeFrame !== 'all') {
        const now = new Date().getTime();
        
        filteredArticles = filteredArticles.filter(article => {
            const articleDate = new Date(article.date).getTime();
            
            switch (filterState.timeFrame) {
                case 'day':
                    const oneDayAgo = now - (24 * 60 * 60 * 1000);
                    return articleDate >= oneDayAgo;
                    
                case 'week':
                    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
                    return articleDate >= oneWeekAgo;
                    
                case 'month':
                    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
                    return articleDate >= oneMonthAgo;
                    
                default:
                    return true;
            }
        });
    }
    
    // Apply search term filter if provided
    if (filterState.searchTerm) {
        const normalizedQuery = filterState.searchTerm.toLowerCase();
        filteredArticles = filteredArticles.filter(article => {
            return article.title.toLowerCase().includes(normalizedQuery) ||
                   article.excerpt.toLowerCase().includes(normalizedQuery) ||
                   article.author.toLowerCase().includes(normalizedQuery) ||
                   article.category.toLowerCase().includes(normalizedQuery) ||
                   article.topics.some(topic => topic.toLowerCase().includes(normalizedQuery));
        });
    }
    
    // Update filtered articles and reset to page 1
    currentFilteredArticles = filteredArticles;
    currentArticlePage = 1;
    
    // Display filtered articles with pagination
    if (filteredArticles.length > 0) {
        displayArticlesPage(currentArticlePage);
        showFilterMessage(`Found ${filteredArticles.length} matching article${filteredArticles.length !== 1 ? 's' : ''}`, 'success');
    } else {
        // Show no results message
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) {
            articlesGrid.innerHTML = `
                <div class="no-results">
                    <h3>No articles found</h3>
                    <p>No articles match your current filter selections.</p>
                    <button class="btn btn-primary clear-filters-btn">Clear All Filters</button>
                </div>
            `;
            
            // Add event listener to clear filters button
            const clearBtn = articlesGrid.querySelector('.clear-filters-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', clearAllFilters);
            }
        }
        
        // Hide pagination
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
        
        showFilterMessage('No articles match your filters', 'warning');
    }
}

/**
 * Clear all filters and show all articles
 */
function clearAllFilters() {
    // Clear category checkboxes
    document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset time period to "all"
    const allTimeRadio = document.querySelector('input[name="time"][value="all"]');
    if (allTimeRadio) {
        allTimeRadio.checked = true;
    }
    
    // Clear search
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => input.value = '');
    
    // Reset to all articles
    currentFilteredArticles = [...articlesData];
    currentArticlePage = 1;
    
    // Display all articles
    displayArticlesPage(currentArticlePage);
    showFilterMessage('Filters cleared', 'success');
}

/**
 * Create an article card element
 * @param {Object} article - Article data
 * @param {string} className - Additional class for the article card
 * @returns {HTMLElement} Article card element
 */
function createArticleCard(article, className = '') {
    const articleElement = document.createElement('article');
    articleElement.className = `card ${className}`.trim();
    
    // Format date for display
    const displayDate = formatDate(article.date);
    
    // Default image for articles without one
    const imageUrl = article.imageUrl || 'images/placeholders/article.svg';
    
    articleElement.innerHTML = `
        <div class="card-image">
            <a href="narticles/${article.filename.endsWith('.html') ? article.filename : article.filename + '.html'}">
                <img src="${imageUrl}" alt="${article.title}">
            </a>
        </div>
        <div class="card-content">
            <div class="card-meta">
                <span class="category">${article.category}</span>
                <span class="date">${displayDate}</span>
                ${(className !== 'compact' && article.readTime) ? `<span class="read-time">${article.readTime} min read</span>` : ''}
            </div>
            <h3 class="card-title"><a href="narticles/${article.filename.endsWith('.html') ? article.filename : article.filename + '.html'}">${article.title}</a></h3>
            ${className !== 'compact' ? `<p class="card-excerpt">${article.excerpt}</p>` : ''}
            ${className !== 'compact' ? `<a href="narticles/${article.filename.endsWith('.html') ? article.filename : article.filename + '.html'}" class="read-more">Continue Reading</a>` : ''}
        </div>
    `;
    
    return articleElement;
}

/**
 * Create an article list item for the articles page
 * @param {Object} article - Article data
 * @returns {HTMLElement} Article list item element
 */
function createArticleListItem(article) {
    const articleElement = document.createElement('article');
    articleElement.className = 'article-card';
    
    // Format date for display
    const displayDate = formatDate(article.date);
    
    // Default image for articles without one
    const imageUrl = article.imageUrl || 'images/placeholders/article.svg';
    
    articleElement.innerHTML = `
        <div class="article-image">
            <img src="${imageUrl}" alt="${article.title}">
        </div>
        <div class="article-content">
            <h3><a href="narticles/${article.filename.endsWith('.html') ? article.filename : article.filename + '.html'}">${article.title}</a></h3>
            <div class="article-meta">
                <span class="article-date">${displayDate}</span>
                ${article.readTime ? `<span class="article-read-time">${article.readTime} min read</span>` : ''}
            </div>
            <p class="article-excerpt">${article.excerpt.length > excerptMaxLength ? article.excerpt.substring(0, excerptMaxLength) + '...' : article.excerpt}</p>
            <div class="article-tags">
                ${article.topics.map(topic => `<a href="#" class="article-tag">${topic}</a>`).join('')}
            </div>
        </div>
    `;
    
    return articleElement;
}

/**
 * Format a date string for display (YYYY-MM-DD to Month DD, YYYY)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

// Initialize articles module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initArticles();
    
    // Safety timeout to hide article loading indicators if they're still visible after 3 seconds
    setTimeout(() => {
        const articleLoadingIndicators = document.querySelectorAll('.articles-grid .loading-indicator');
        if (articleLoadingIndicators.length > 0) {
            if (article_logging) console.log('Found article loading indicators still visible, hiding them');
            articleLoadingIndicators.forEach(indicator => {
                indicator.style.display = 'none';
            });
        }
    }, 3000);
});

// Listen for page navigation events (for SPA-like behavior)
document.addEventListener('pageLoaded', (e) => {
    if (article_logging) console.log('Page loaded event detected, reinitializing article components');
    if (articlesData.length > 0) {
        initArticleComponents();
    } else {
        // If articles haven't loaded yet, load them
        loadArticles();
    }
});

// Check if content is already loaded (for initial page load race condition)
// This handles the case where router loads content before articles.js sets up its event listener
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded (already handled above)
} else {
    // DOM is already loaded, check if we need to initialize components
    // Wait a brief moment to ensure articlesData is loaded
    setTimeout(() => {
        if (articlesData.length > 0) {
            const contentContainer = document.getElementById('site-content');
            // Only reinitialize if content is loaded and not just a loading indicator
            if (contentContainer && !contentContainer.querySelector('#page-loading-indicator')) {
                initArticleComponents();
            }
        }
    }, 100);
}
