If you want to test locally pretty easily:

1. Install [node.js](https://nodejs.org/)
2. clone this repository locally somehow (the [Github desktop app](https://desktop.github.com/) works if you don't have any other preferences)
3. open the directory for this project locally with your command-line
4. run `npm i`

then, whenever you want to mess around with anything, run this:
```sh
npm start
```

To make changes to the html, edit the files in the `content` directory (not the html files in the `docs` directory).

## To generate webp versions of all jpg images in docs/pictures

```sh
npm run jpg_to_webp
```
## To change the titles of a particular page

Edit the `content/title.js` file.
