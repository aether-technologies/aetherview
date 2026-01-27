#!/bin/bash

# AetherView - Update Trending Articles
# This shell script is a wrapper for the update_trending.js script
# It ensures the script runs from the correct directory

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to project root directory
cd "$SCRIPT_DIR/.."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Execute the JavaScript script with any passed arguments
node "$SCRIPT_DIR/update_trending.js" "$@"

# Display success message
if [ $? -eq 0 ]; then
    echo "✅ Trending articles updated successfully!"
else
    echo "❌ Failed to update trending articles. See errors above."
fi
