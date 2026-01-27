# AetherView Article Listing Implementation

**Date:** September 26, 2025
**Author:** Ember AI

## Overview

This document describes the implementation of a JSON-based article listing system for the AetherView blog. The system uses a centralized JSON file to store article data, which is then loaded and filtered via JavaScript to populate various sections of the website including:

- Featured Articles (on the home page)
- Latest Articles (on the home page)
- Popular Articles (sidebar)
- Complete article listings (on the articles page)
- Search functionality across all articles

## File Structure

1. `/www/data/articles.json` - Central JSON data store for all articles
2. `/www/js/articles.js` - JavaScript module for loading and manipulating article data

## Article JSON Schema

Each article in the JSON file follows this structure:

```json
{
  "title": "Article Title",
  "filename": "article-slug.html",
  "date": "YYYY-MM-DD",
  "author": "Author Name",
  "authorTitle": "Author Title",
  "category": "Category",
  "excerpt": "Brief excerpt of the article content",
  "topics": ["Topic1", "Topic2", "Topic3"],
  "readTime": 10,
  "featured": true|false,
  "trending": true|false,
  "imageUrl": "images/article-image.jpg",
  "thumbnailUrl": "images/article-thumb.jpg"
}
```

## Key Features

### Dynamic Content Loading

The system loads article data from the JSON file when the page loads and automatically populates the various article sections based on the current page:

1. On the home page:
   - Featured articles (where `featured: true`)
   - Latest articles (sorted by date)
   - Popular articles (where `trending: true`)

2. On the articles page:
   - Complete article listing with filtering capabilities
   - Search functionality that filters articles in real-time

### Search Functionality

The search feature filters articles based on:
- Title
- Excerpt
- Author
- Category
- Topics

### Integration with SPA Router

The article system integrates with the existing SPA router by:
1. Listening for the `pageLoaded` custom event
2. Reinitializing article components when the page changes
3. Preserving article data in memory for faster page transitions

## Testing

A test script is provided at `/scripts/test_articles_json.sh` to verify:
- The presence and validity of the JSON file
- The number of articles in the database
- The distribution of featured and trending articles
- The category distribution

## Future Improvements

1. Add pagination for article listings with more than 10 articles
2. Implement category and tag filtering that persists across page navigation
3. Add a content management interface for adding/editing articles via the JSON file
