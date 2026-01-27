# AetherView Build Process

This document explains how to use the build system for the AetherView project.

## Overview

The build system:
1. Copies files from the `www` directory to `build/www`
2. Minifies JavaScript files using Terser
3. Minifies HTML files while preserving IDs and classes
4. Minifies CSS files

## Requirements

- Node.js (version 14 or higher recommended)
- NPM (comes with Node.js)

## Installation

Before first use, install dependencies:

```bash
npm install
```

## Usage

To build the project:

```bash
npm run build
```

This will create a `build` directory containing optimized files ready for production.

## Build Options

The build script (`scripts/build.js`) has the following features:

- **JavaScript minification**: Removes whitespace, comments, and shortens variable names while preserving class names and function names to maintain functionality.
- **HTML minification**: Collapses whitespace and removes comments while preserving element IDs and classes to ensure JavaScript interactivity works correctly.
- **CSS minification**: Reduces CSS size by removing whitespace, comments, and optimizing values.

## Adding to CI/CD

If you use CI/CD, you can add the build step to your pipeline:

```yaml
# Example for GitHub Actions
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
    with:
      node-version: 16
  - run: npm ci
  - run: npm run build
```

## Customization

The build settings can be customized by modifying `scripts/build.js`. Key areas to consider:

- JavaScript minification options in the `minifyJs()` call
- HTML minification options in the `minifyHtml()` call
- CSS minification options in the `CleanCSS` configuration
