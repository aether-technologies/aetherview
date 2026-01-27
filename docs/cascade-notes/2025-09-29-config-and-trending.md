# AetherView Configuration System and Trending Articles

**Date:** 2025-09-29  
**Author:** Ember  
**Topic:** Configuration system and trending article management

## Overview

Two new features have been implemented for the AetherView website:

1. A configuration system to toggle features on/off
2. A script to automatically manage trending articles

## 1. Configuration System

### Location
The configuration file is located at: `/www/data/config.json`

### Features
The configuration system allows toggling of various website features:

```json
{
  "features": {
    "displayImages": false,  // Toggle article images on/off
    "displayAds": false      // Toggle advertisements on/off
  },
  "trending": {
    "autoUpdate": true,      // Should trending be auto-updated by the script
    "count": 3,              // Number of articles to mark as trending
    "excludeFeatured": false // Whether to exclude featured articles from trending
  },
  "caching": {
    "enabled": true,         // Enable/disable browser caching
    "duration": 3600         // Cache duration in seconds
  }
}
```

### How It Works
- `config-loader.js` loads the configuration on page load
- Toggles CSS classes on the HTML element based on configuration
- `config-features.css` contains styles that respond to these classes
- The configuration is available globally via `window.AetherViewConfig.get()`

### Usage in Code
To access configuration in JavaScript:

```javascript
// Check if config is available
if (window.AetherViewConfig && window.AetherViewConfig.get) {
  const config = window.AetherViewConfig.get();
  
  // Check if images should be displayed
  if (config.features.displayImages) {
    // Show images
  } else {
    // Hide images
  }
}
```

## 2. Trending Articles Script

### Location
The script files are located at:
- `/scripts/update_trending.js` - Node.js script
- `/scripts/update_trending.sh` - Shell wrapper

### Features
- Automatically marks the most recent articles as "trending"
- Configurable number of trending articles
- Option to exclude featured articles from trending

### Usage

```bash
# Mark the default number of articles (from config) as trending
./scripts/update_trending.sh

# Mark a specific number of articles as trending
./scripts/update_trending.sh 5
```

### How It Works
1. Reads the current articles from `www/data/articles.json`
2. Sorts articles by date (newest first)
3. Marks the specified number of articles as trending
4. Saves the updated data back to the JSON file

### Automation
The script can be scheduled to run periodically using cron:

```bash
# Example: Update trending articles every day at midnight
0 0 * * * /path/to/aetherview/scripts/update_trending.sh
```

## Next Steps

1. **Images:** When ready to add images, set `displayImages: true` in the config
2. **Ads:** When ready for monetization, set `displayAds: true` in the config
3. **Featured Articles:** Continue manually setting featured articles in the JSON
4. **Trending Articles:** Run the update script regularly or set up a cron job
