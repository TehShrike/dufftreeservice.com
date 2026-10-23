This site is built with [bongo](https://bongo.build).

If you want to test locally pretty easily:

1. Install [Bun](https://bun.sh/) (image resizing needs it; Node 24+ also runs the build, but then copies images as they are)
2. Install [pnpm](https://pnpm.io/)
3. clone this repository locally somehow (the [Github desktop app](https://desktop.github.com/) works if you don't have any other preferences)
4. open the directory for this project locally with your command-line
5. run `pnpm install`

then, whenever you want to mess around with anything, run this:
```sh
bun --bun run dev
```

That starts a dev server at http://localhost:3000/ that rebuilds and reloads when you save a file.

To build the site into `public/` the way the deploy does:

```sh
bun --bun run build
```

## Where things live

- `content/*.hbs` – one file per page. The frontmatter at the top sets the page title (and the `.html` URL).
- `layouts/html.hbs` – the shared page shell (head, top bar, nav, footer).
- `partials/*.hbs` – reusable chunks (the quote form, the Google review cards).
- `assets/style.css` – global CSS. `assets/pictures/` holds the full-size source images; bongo resizes them at build time.
- `data/` – data used by templates: the Google rating/review count, and the reviews parsed from `reviews.tsv`.

## Deploying

Pushing to `master` runs the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and publishes `public/` to GitHub Pages.
