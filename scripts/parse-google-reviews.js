import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const inputPath = join(__dirname, 'google-reviews-page.html')
const componentsDir = join(__dirname, '..', 'content', 'components')

const main = async () => {
	const html = await readFile(inputPath, 'utf8')

	// Look for rating in aria-label like: aria-label="Rated 4.9 out of 5"
	const ratingMatch = html.match(/aria-label="Rated (\d\.\d) out of 5/)
		|| html.match(/>(\d\.\d)<\/span>/)

	// Look for review count like: >73 Google reviews</span>
	const reviewMatch = html.match(/>(\d+) Google reviews</)

	const rating = ratingMatch ? ratingMatch[1] : null
	const reviewCount = reviewMatch ? reviewMatch[1] : null

	if (rating && reviewCount) {
		console.log('Rating:', rating)
		console.log('Review Count:', reviewCount)

		await writeFile(join(componentsDir, 'google_review_score.html'), rating)
		await writeFile(join(componentsDir, 'google_review_count.html'), reviewCount)
		console.log('Wrote to content/components/')
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
