/**
 * AetherView - Update Trending Articles Script
 * 
 * This script reads the articles.json file, sorts by date,
 * and marks the most recent articles as trending.
 * 
 * Usage: node update_trending.js [count]
 * - count: Optional number of trending articles (defaults to config setting)
 */

const fs = require('fs');
const path = require('path');

// Path constants - adjust if necessary
const DATA_DIR = path.join(__dirname, '..', 'www', 'data');
const ARTICLES_PATH = path.join(DATA_DIR, 'articles.json');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');

// Main function
async function updateTrendingArticles() {
  console.log('Updating trending articles...');
  
  try {
    // Read configuration
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    
    // Check if auto-update is disabled
    if (config.trending && config.trending.autoUpdate === false) {
      console.log('Auto-update trending is disabled in config. Exiting.');
      return;
    }
    
    // Get trending count from command line args or config
    const args = process.argv.slice(2);
    let trendingCount = args[0] ? parseInt(args[0]) : null;
    
    // If no valid count provided, use config
    if (!trendingCount || isNaN(trendingCount)) {
      trendingCount = (config.trending && config.trending.count) ? config.trending.count : 3;
    }
    
    console.log(`Setting ${trendingCount} most recent articles as trending`);
    
    // Read articles data
    const articlesData = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
    
    // Make a copy and sort by date (newest first)
    const sortedArticles = [...articlesData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Option to exclude featured articles from trending
    const excludeFeatured = config.trending && config.trending.excludeFeatured === true;
    
    // Reset all articles to not trending
    articlesData.forEach(article => {
      article.trending = false;
    });
    
    // Mark the most recent articles as trending
    let trendingMarked = 0;
    for (const article of sortedArticles) {
      // Skip if we should exclude featured articles and this one is featured
      if (excludeFeatured && article.featured) {
        continue;
      }
      
      // Find the original article and mark as trending
      const originalArticle = articlesData.find(a => a.filename === article.filename);
      if (originalArticle) {
        originalArticle.trending = true;
        trendingMarked++;
      }
      
      // Stop once we've marked enough articles
      if (trendingMarked >= trendingCount) {
        break;
      }
    }
    
    // Save the updated data
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articlesData, null, 2));
    
    console.log(`Successfully marked ${trendingMarked} articles as trending`);
    
  } catch (error) {
    console.error('Error updating trending articles:', error);
    process.exit(1);
  }
}

// Run the script
updateTrendingArticles();
