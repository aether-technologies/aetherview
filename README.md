# AetherView - Metaverse Blog

AetherView is a modern, futuristic blog focused on metaverse topics including Virtual Reality, Web3, and Blockchain. The name represents "a perspective from the Aether," conceptualized as the space between worlds.

## File Structure

```
aetherview/
├── www/                   # Web root directory
│   ├── css/               # Stylesheets
│   │   └── styles.css     # Main stylesheet
│   ├── js/                # JavaScript files
│   │   └── scripts.js     # Main script file
│   ├── images/            # Image assets
│   │   └── placeholders/  # Placeholder images
│   ├── articles/          # Articles pages
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   └── contact.html       # Contact page
├── build/                 # Production build output
│   └── www/               # Optimized web files
├── scripts/               # Build scripts
│   └── build.js           # Main build script
└── docs/                  # Documentation files
```

## Design Features

### Color Palette

- Primary: Deep purple (#4a148c)
- Secondary: Vibrant green (#00c853)
- Background: Dark gray with purple tint (#1a1a2e)
- Text: Light gray (#e0e0e0)
- Accent: Cyan highlights (#00b8d4)

### UI Elements

- Semi-transparent panels (70-80% opacity)
- Subtle neon borders
- Frosted glass effect
- Geometric shapes and patterns
- Futuristic typography (Orbitron for headings, Roboto for body)

## Pages

1. **Homepage** (index.html)
   - Featured posts section
   - Recent posts grid
   - Sidebar with widgets (search, newsletter signup - TBD)

2. **Articles** (articles.html)
   - List of articles
   - Sidebar with widgets (search, categories)

3. **About** (about.html)
   - Mission statement

4. **Contact** (contact.html)
   - Contact form

## Functionality

- Mobile-responsive design
- Interactive navigation menu
- Form validation for contact and newsletter forms
- Category filtering
- Search functionality
   
## Running the Project

To run the project locally:

```bash
cd www
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.

## Building the Project

To build the project for production:

1. Install dependencies:

```bash
npm install
```

2. Run the build script:

```bash
npm run build
```

This process:
- Copies all files from `www/` to `build/www/`
- Minifies JavaScript files using Terser
- Minifies HTML files while preserving IDs and classes
- Minifies CSS files

The optimized files will be available in the `build/www/` directory, ready for production deployment.

For more details about the build process, see `docs/build-process.md`.

