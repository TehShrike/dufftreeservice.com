import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const inputPath = join(__dirname, 'google-reviews-page.html')
const outputPath = join(__dirname, '..', 'data', 'google_reviews.json')

const main = async () => {
	const html = await readFile(inputPath, 'utf8')

	const ratingMatch = html.match(/data-attrid="subtitle"[^>]*>.*?(\d\.\d)<\/span>/)

	// Look for review count like: >73 Google reviews</span>
	const reviewMatch = html.match(/>(\d+) Google reviews</)

	const rating = ratingMatch ? ratingMatch[1] : null
	const reviewCount = reviewMatch ? reviewMatch[1] : null

	if (rating && reviewCount) {
		console.log('Rating:', rating)
		console.log('Review Count:', reviewCount)

		await writeFile(outputPath, JSON.stringify({ score: rating, count: reviewCount }, null, '\t') + '\n')
		console.log('Wrote to data/google_reviews.json')
	} else {
		console.error('Could not extract rating/review data')
		console.log('Rating match:', ratingMatch)
		console.log('Review match:', reviewMatch)
		process.exit(1)
	}
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
