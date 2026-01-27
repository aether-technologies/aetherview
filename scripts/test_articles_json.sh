#!/bin/bash

# Test script for checking the AetherView articles.json implementation
# This script verifies that the articles.json file exists and contains valid JSON

echo "Testing AetherView Articles JSON Implementation"
echo "----------------------------------------------"

# Check if the articles.json file exists
JSON_FILE="../www/data/articles.json"
if [ ! -f "$JSON_FILE" ]; then
    echo "❌ Error: articles.json file not found at $JSON_FILE"
    exit 1
else
    echo "✅ Found articles.json file"
fi

# Check if it's valid JSON
if jq . "$JSON_FILE" >/dev/null 2>&1; then
    echo "✅ JSON syntax is valid"
    
    # Count the number of articles
    ARTICLE_COUNT=$(jq '. | length' "$JSON_FILE")
    echo "✅ Found $ARTICLE_COUNT articles in the JSON file"
    
    # Check if we have featured articles
    FEATURED_COUNT=$(jq '[.[] | select(.featured == true)] | length' "$JSON_FILE")
    echo "✅ Found $FEATURED_COUNT featured articles"
    
    # Check if we have trending articles
    TRENDING_COUNT=$(jq '[.[] | select(.trending == true)] | length' "$JSON_FILE")
    echo "✅ Found $TRENDING_COUNT trending articles"
    
    # Show categories distribution
    echo "Categories distribution:"
    jq -r '.[].category' "$JSON_FILE" | sort | uniq -c | sort -nr
else
    echo "❌ Error: articles.json contains invalid JSON"
    exit 2
fi

echo ""
echo "Test completed successfully!"
echo "Now open the website in a browser to see if articles are displayed correctly"
echo "----------------------------------------------"
