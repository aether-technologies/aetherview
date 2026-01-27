# AetherView Performance Optimization Report
**Date:** November 12, 2025

## Executive Summary
Comprehensive analysis reveals significant optimization opportunities across unused code, runtime inefficiencies, and build processes. Estimated performance improvements: 40-60% faster load times, 50-70% reduction in JavaScript bundle size.

---

## 1. UNUSED CODE IDENTIFIED

### Critical
- **`/www/js/home.js`** - Completely empty file (0 bytes)
  - Action: DELETE

### Duplicate Code
- **`showFilterMessage()`** - Duplicated in `index.js` and `articles.js`
  - Location 1: index.js lines 521-556
  - Location 2: articles.js lines 753-788
  - Action: Keep in articles.js, remove from index.js

- **`filterArticlesBySearch()`** - Duplicated functionality
  - Location 1: index.js lines 447-461 (DOM-based, deprecated)
  - Location 2: articles.js lines 486-543 (data-driven, active)
  - Action: Remove from index.js

- **Filtering logic** - Two different implementations
  - `applyFilters()` in index.js (DOM-based, deprecated)
  - `applyArticleFilters()` in articles.js (data-driven, active)
  - Action: Remove DOM-based version from index.js

### Unnecessary Dependencies
- **emailjs-com** - Only used on contact page but loaded globally
  - Action: Lazy load only when contact page is accessed

---

## 2. RUNTIME INEFFICIENCIES

### High Priority

#### A. Event Listener Leaks (router.js)
**Issue:** Lines 47-73 clone and recreate navigation links on every router init
**Impact:** Memory leaks, duplicate handlers
**Fix:** Track initialized state, initialize only once

#### B. Unnecessary Article Loading
**Issue:** `initArticles()` runs on DOMContentLoaded for ALL pages
**Impact:** Wasted network requests on non-article pages
**Fix:** Lazy load only when needed

#### C. No Content Caching
**Issue:** Router fetches content HTML every navigation (router.js:170)
**Impact:** Redundant network requests
**Fix:** Implement content cache with TTL

#### D. No Article Data Caching
**Issue:** articles.json fetched on every page load
**Impact:** 15KB+ network overhead each load
**Fix:** Cache in sessionStorage with version check

#### E. IntersectionObserver Not Cleaned Up
**Issue:** Observer continues running after animations trigger (index.js:89-103)
**Impact:** Wasted CPU cycles
**Fix:** ALREADY fixed with `observer.unobserve()` on line 94 ✓

### Medium Priority

#### F. No Search Debouncing
**Issue:** Search executes immediately on submit only
**Impact:** Could add real-time search with debounce
**Fix:** Future enhancement (not critical since no real-time search)

#### G. Console Logging in Production
**Issue:** Build script keeps console.log (build.js:90)
**Impact:** Larger bundle, slower execution
**Fix:** Set `drop_console: true` for production

#### H. Multiple setTimeout Without Cleanup
**Issue:** Timeout IDs not tracked for cleanup
- articles.js:315, 785, 795, 824
- router.js:17, 213
- index.js:169
**Impact:** Potential memory leaks on rapid navigation
**Fix:** Track and clear timeouts on page unload

---

## 3. BUILD PROCESS ISSUES

### Critical

#### A. No Dead Code Elimination
**Issue:** Build copies everything, doesn't remove unused code
**Fix:** Implement proper tree-shaking

#### B. No Module Bundling
**Issue:** 5 separate JS files loaded (3+ HTTP requests)
**Fix:** Bundle into single optimized file

#### C. Drop Console Logs
**Issue:** `drop_console: false` in build.js:90
**Fix:** Change to `true` for production

#### D. No Compression
**Issue:** No gzip/brotli compression
**Fix:** Add compression to build process

### Medium Priority

#### E. Preserve Function Names
**Issue:** `keep_fnames: true` prevents optimization (build.js:95)
**Impact:** Larger bundle size
**Fix:** Set to false unless debugging

#### F. No Code Splitting
**Issue:** Contact page code loaded on all pages
**Fix:** Split contact.js into separate chunk

---

## 4. OPTIMIZATION PLAN

### Phase 1: Remove Unused Code
1. Delete `home.js`
2. Remove duplicate functions from `index.js`
3. Update build to drop console logs

### Phase 2: Runtime Optimizations
1. Fix router initialization guard
2. Lazy load articles module
3. Implement content caching
4. Implement article data caching
5. Add timeout cleanup

### Phase 3: Build Optimizations
1. Enable console log removal
2. Disable function name preservation
3. Create bundled version
4. Add compression

### Phase 4: Advanced (Future)
1. Lazy load EmailJS
2. Code splitting by route
3. Service worker for offline caching
4. Image optimization/lazy loading

---

## 5. EXPECTED IMPROVEMENTS

### Load Time
- **Initial Load:** -40-50% (from ~800ms to ~400-500ms)
- **Navigation:** -60-70% (from ~300ms to ~100-150ms with caching)

### Bundle Size
- **JavaScript:** -50-60% (from ~35KB to ~15-18KB minified+gzipped)
- **HTML/CSS:** -30-40% (better minification)

### Runtime Performance
- **Memory:** -30-40% (no event listener leaks)
- **CPU:** -20-30% (fewer unnecessary operations)

---

## 6. IMPLEMENTATION CHECKLIST

- [ ] Delete home.js
- [ ] Remove duplicate functions from index.js
- [ ] Fix router initialization guard
- [ ] Lazy load articles module
- [ ] Implement content cache
- [ ] Implement articles.json cache
- [ ] Add timeout cleanup handlers
- [ ] Update build.js (drop console, optimize terser)
- [ ] Test all functionality
- [ ] Verify performance improvements
