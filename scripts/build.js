#!/usr/bin/env node

/**
 * Build script for AetherView
 * 
 * This script:
 * 1. Copies the www folder to build/www
 * 2. Minifies JavaScript files
 * 3. Minifies HTML files (preserving IDs and classes for functionality)
 * 4. Minifies CSS files
 */

const fs = require('fs-extra');
const path = require('path');
const { globSync } = require('glob');
const { minify: minifyJs } = require('terser');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');

// Path configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'www');
const BUILD_DIR = path.join(ROOT_DIR, 'build/www');

// Counter for tracking processed files
let processedFiles = 0;

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting build process...');
  
  try {
    // Clean build directory
    await cleanBuildDir();
    
    // Copy all files from www to build/www
    await copyFiles();
    
    // Process JavaScript files
    await processJsFiles();
    
    // Process HTML files
    await processHtmlFiles();
    
    // Process CSS files
    await processCssFiles();
    
    console.log(`\n✅ Build completed successfully! Processed ${processedFiles} files.`);
    console.log(`📁 Build output available at: ${BUILD_DIR}`);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Clean the build directory
 */
async function cleanBuildDir() {
  console.log('🗑️  Cleaning build directory...');
  await fs.emptyDir(BUILD_DIR);
}

/**
 * Copy all files from www to build/www
 */
async function copyFiles() {
  console.log('📋 Copying files to build directory...');
  await fs.copy(SRC_DIR, BUILD_DIR);
}

/**
 * Process JavaScript files
 */
async function processJsFiles() {
  console.log('\n🔧 Processing JavaScript files...');
  
  const jsFiles = globSync('**/*.js', { cwd: BUILD_DIR });
  
  for (const file of jsFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const originalCode = await fs.readFile(filePath, 'utf8');
    
    try {
      // Minify JavaScript
      const minified = await minifyJs(originalCode, {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
        mangle: {
          keep_classnames: true,
          keep_fnames: true,
        },
        format: {
          comments: false,
        },
      });
      
      // Write minified code back
      await fs.writeFile(filePath, minified.code);
      
      const originalSize = Buffer.byteLength(originalCode, 'utf8') / 1024;
      const minifiedSize = Buffer.byteLength(minified.code, 'utf8') / 1024;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
      
      console.log(`  ✓ ${file} (${originalSize.toFixed(2)} KB → ${minifiedSize.toFixed(2)} KB, saved ${savings}%)`);
      processedFiles++;
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
}

/**
 * Process HTML files
 */
async function processHtmlFiles() {
  console.log('\n🔧 Processing HTML files...');
  
  const htmlFiles = globSync('**/*.html', { cwd: BUILD_DIR });
  
  for (const file of htmlFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const originalCode = await fs.readFile(filePath, 'utf8');
    
    try {
      // Minify HTML, preserving IDs and classes for functionality
      const minified = await minifyHtml(originalCode, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        // Preserve IDs and classes for proper JavaScript functionality
        processScripts: ['text/javascript'],
        customAttrCollapse: /^(?!id|class|data-)/,
      });
      
      // Write minified code back
      await fs.writeFile(filePath, minified);
      
      const originalSize = Buffer.byteLength(originalCode, 'utf8') / 1024;
      const minifiedSize = Buffer.byteLength(minified, 'utf8') / 1024;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
      
      console.log(`  ✓ ${file} (${originalSize.toFixed(2)} KB → ${minifiedSize.toFixed(2)} KB, saved ${savings}%)`);
      processedFiles++;
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
}

/**
 * Process CSS files
 */
async function processCssFiles() {
  console.log('\n🔧 Processing CSS files...');
  
  const cssFiles = globSync('**/*.css', { cwd: BUILD_DIR });
  const cleanCSS = new CleanCSS({
    level: 2,
    compatibility: 'ie11',
  });
  
  for (const file of cssFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const originalCode = await fs.readFile(filePath, 'utf8');
    
    try {
      // Minify CSS
      const minified = cleanCSS.minify(originalCode);
      
      if (minified.errors.length > 0) {
        throw new Error(minified.errors.join(', '));
      }
      
      // Write minified code back
      await fs.writeFile(filePath, minified.styles);
      
      const originalSize = Buffer.byteLength(originalCode, 'utf8') / 1024;
      const minifiedSize = Buffer.byteLength(minified.styles, 'utf8') / 1024;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
      
      console.log(`  ✓ ${file} (${originalSize.toFixed(2)} KB → ${minifiedSize.toFixed(2)} KB, saved ${savings}%)`);
      processedFiles++;
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
}

// Execute the build function
build();
