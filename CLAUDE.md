# CLAUDE.md - Duff Tree Service Website

## Project Overview

This is the website for **Duff Tree Service**, a tree service business based in Nebraska. It's a static site built with vanilla HTML/CSS and a custom Node.js build system, hosted on GitHub Pages at www.dufftreeservice.com.

## Directory Structure

```
.
├── content/              # Source HTML content files (edit these)
│   ├── template.html     # Main page template with placeholders
│   ├── titles.js         # Page title definitions
│   ├── index.html        # Homepage content
│   ├── about.html        # About page content
│   ├── why_us.html       # Why Us page content
│   ├── service_area.html # Service area page content
│   ├── tree_removal.html # Tree removal service page
│   ├── tree_trimming.html# Tree trimming service page
│   ├── tree_planting.html# Tree planting service page
│   └── more_services.html# Additional services page
├── docs/                 # Built output files (DO NOT edit directly)
│   ├── *.html            # Generated HTML pages
│   ├── style.css         # CSS styles (edit this directly)
│   ├── pictures/         # Images (.jpg and .webp versions)
│   ├── CNAME             # GitHub Pages custom domain config
│   └── (favicon files)   # Various favicon formats
├── build.js              # Build script
├── package.json          # NPM configuration
└── readme.md             # User-facing documentation
```

## Build System

### How It Works

The build script (`build.js`) reads HTML content files from `content/` and injects them into `content/template.html`:

1. **Template placeholders**:
   - `<!-- content -->` - Replaced with page content (indented 3 tabs)
   - `<!-- title -->` - Replaced with page title from `content/titles.js`

2. **Title format**: `Duff Tree Service | Page Title` (or just `Duff Tree Service` for index)

3. **Output**: Generated HTML files go to `docs/`

### Commands

```sh
npm install          # Install dependencies (first time setup)
npm start            # Start dev server with live reload + file watching
npm run build        # Build all content files once
npm run jpg_to_webp  # Convert all JPG images in docs/pictures/ to WebP
```

## Development Guidelines

### Editing Content

- **ALWAYS** edit files in `content/` directory, not `docs/`
- The build process generates files in `docs/` - manual edits there will be overwritten
- Exception: `docs/style.css` is edited directly (not generated)

### Adding a New Page

1. Create `content/new_page.html` with the page content
2. Add title to `content/titles.js`: `new_page: 'Page Title'`
3. Run `npm run build`
4. Add navigation link in `content/template.html` if needed

### Page Titles

Edit `content/titles.js` to change page titles. The key is the filename without extension:

```js
export default {
    about: 'About',
    tree_removal: 'Tree Removal',
    // ...
}
```

### Images

- Store images in `docs/pictures/`
- Prefer WebP format for web display
- Run `npm run jpg_to_webp` to generate WebP versions from JPG files
- In HTML, reference as `pictures/filename.webp`

### CSS

- Edit `docs/style.css` directly
- Uses CSS custom properties (variables) for theming
- Responsive breakpoint at 750px
- Brand colors defined in `:root` on `body`:
  - `--brand_gray: #626262`
  - `--brand_light: #eeeae7`
  - `--brand_white: #f9f9f9`
  - `--brand_dark_green: #2E7D32`
- Prefer inlining single-use CSS classes directly in the HTML using multi-line style attributes (see the telephone link and logo img in `template.html` for the formatting style)

## Key Conventions

### HTML Structure

Content pages should NOT include `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags - these come from the template. Content is wrapped automatically.

Common layout patterns used:
- `.padded_content` - Adds horizontal padding
- `.column-gap-16` - Flex column with 16px gap
- `.image-and-text` - Side-by-side image and text (stacks on mobile)
- `.centered-column` - Centered flex column

### Contact Information

- Phone: 402-936-8050
- Email: andrew@dufftreeservice.com
- Business is a Nebraska Certified Arborist

## Deployment

The site is hosted on GitHub Pages:
- The `docs/` folder is the publish source
- Custom domain: www.dufftreeservice.com (configured in `docs/CNAME`)
- Push to main branch to deploy

## Dependencies

Dev dependencies only (no runtime dependencies):
- `live-server` - Local development server with live reload
- `npm-run-all` - Run multiple npm scripts in parallel
- `sharp-cli` - Image conversion (JPG to WebP)
- `watchlist` - File watcher for auto-rebuild

### Other

Whenever the style.css changes, the version in `style.css?version=` needs to be incremented for cachebusting purposes.

