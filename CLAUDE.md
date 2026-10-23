# CLAUDE.md - Duff Tree Service Website

Use pnpm instead of npm.

Do not write comments explaining what the code is going to do.

Use snake_case for function and variable names, PascalCase for type names.

I prefer arrow function syntax rather than function declarations or function expressions.

Don't define a variable right before using it only once – inline the value instead.

## Project Overview

This is the website for **Duff Tree Service**, a tree service business based in Nebraska. It's a static site built with [bongo](https://bongo.build) (tempura templates, LightningCSS, Bun.Image), deployed to GitHub Pages at www.dufftreeservice.com by a GitHub Actions workflow.

## Directory Structure

```
.
├── assets/               # Files that templates reference; only referenced files are published
│   ├── style.css         # Global CSS (built with LightningCSS, content-hashed)
│   ├── pictures/         # Full-size source images (jpg/png); bongo resizes them
│   └── *.svg             # Logos used by the layout
├── content/              # One .hbs file per page, plus static files copied as-is
│   ├── *.hbs             # Page content with frontmatter (title, url, …)
│   ├── sitemap.xml.hbs   # Output file: renders sitemap.xml from $pages
│   └── CNAME, favicons…  # Copied to the output root unchanged
├── data/                 # Available in every template as $data
│   ├── google_reviews.json  # Rating + review count ($data.google_reviews)
│   └── reviews.ts        # Parses ../reviews.tsv into $data.reviews
├── layouts/html.hbs      # The page shell (head, top bar, nav, footer)
├── partials/*.hbs        # Reusable chunks: {{#partial src="name"}}
├── reviews.tsv           # Google reviews shown in the review cards
├── scripts/              # Puppeteer scripts that refresh data/google_reviews.json
├── bongo.config.ts       # $site metadata and $images defaults
├── public/               # Build output (gitignored, never edit)
└── .github/workflows/deploy.yml  # Builds and deploys public/ to GitHub Pages
```

## Build System

bongo reads `content/`, renders each page through `layouts/html.hbs`, bundles the CSS and images that the templates reference, and writes everything to `public/`. See https://bongo.build for the full docs.

- `{{{ $page.content }}}` in the layout is where the page body goes.
- `<title>` is `Duff Tree Service | <title frontmatter>`, or just `Duff Tree Service` when a page has no `title` (the index).
- `<bongo:style src="style.css" />` builds `assets/style.css` and links it under a content-hashed name. No manual cache-busting is needed.
- `<bongo:asset src='file.svg' />` publishes a file from `assets/` and prints its URL.
- `<bongo:image src="pictures/file.jpg" sizes="…" />` resizes a source image into a `srcset` of WebP files (widths and format defaults are in `bongo.config.ts`). Pass `quality`, `widths`, `fetchpriority="high"` (above-the-fold images), etc. per image.

### Commands

```sh
pnpm install          # Install dependencies (first time setup)
bun --bun run dev     # Dev server with live reload at http://localhost:3000/
bun --bun run build   # Build the site into public/
pnpm run update_google_reviews  # Refresh data/google_reviews.json (opens Chrome, needs manual step)
```

Image resizing uses `Bun.Image`, so run the scripts through Bun (`bun --bun run …`). Under plain Node (24+) the build still works but copies images unresized.

## Development Guidelines

### Editing Content

- Edit the `.hbs` files in `content/`. Never edit `public/`.
- Content files are tempura templates: `{{ }}` prints a value, `{{#partial src="name"}}` includes a partial from `partials/`. Plain HTML passes through unchanged.
- Content pages should NOT include `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags - these come from `layouts/html.hbs`.

### Adding a New Page

1. Create `content/new_page.hbs` starting with frontmatter:
   ```
   ---
   title: Page Title
   url: /new_page.html
   ---
   ```
   The `url` keeps the site's existing `name.html` URL scheme; without it bongo would publish `/new_page/`.
2. Add navigation links in `layouts/html.hbs` if needed.
3. The sitemap picks the page up automatically.

### Images

- Put full-size source images (jpg/png) in `assets/pictures/`. Do not commit resized or WebP copies; bongo generates them.
- Reference them with `<bongo:image src="pictures/filename.jpg" alt="…" sizes="…" />`. Use `sizes="300px"` for the `.image_container` thumbnails, and `quality="50" fetchpriority="high"` for full-width hero images.
- bongo applies EXIF orientation and never enlarges an image.

### CSS

- Edit `assets/style.css` for global styles. LightningCSS handles nesting and prefixing for the default browserslist target.
- **Page-specific CSS**: Put styles only used on one page in a `<style>` tag within that page's content file, not in style.css. Only add to style.css if used in the layout or across multiple pages.
- Uses CSS custom properties (variables) for theming
- Responsive breakpoint at 750px
- Brand colors defined in `:root`:
  - `--brand_gray: #626262`
  - `--brand_mild_gray: #888`
  - `--brand_light: #eeeae7`
  - `--brand_white: #f9f9f9`
  - `--brand_dark_green: #2A7221`
  - `--brand_orange: #F4992C`
- Prefer inlining single-use styles directly in the HTML using multi-line style attributes (see the telephone link and logo img in `layouts/html.hbs` for the formatting style)

### Partials and data

- Partials live in `partials/*.hbs` and are called with `{{#partial src="name" arg=value}}`. Declare arguments at the top with `{{#expect arg}}`.
- `google_reviews` renders review cards for the reviewer names listed in a page's `reviews:` frontmatter, pulling the text from `reviews.tsv` via `data/reviews.ts`.
- `google_review_rating` shows the score and count from `data/google_reviews.json`.
- `arbostar_form` embeds the quote form iframe.

## Key Conventions

### HTML Structure

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

- Pushing to `master` runs `.github/workflows/deploy.yml`: `pnpm install`, `bun --bun run build`, then `actions/deploy-pages` publishes `public/`.
- Custom domain: www.dufftreeservice.com (`content/CNAME` is copied into the output)
