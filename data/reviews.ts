import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const [, ...rows] = readFileSync(join(import.meta.dirname, '..', 'reviews.tsv'), 'utf8').trim().split('\n')

export default rows.map(row => {
	const [name, url, text] = row.split('\t')
	return { name, url, text }
})
