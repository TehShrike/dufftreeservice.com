import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

puppeteer.use(StealthPlugin())

const __dirname = dirname(fileURLToPath(import.meta.url))
const url = 'https://share.google/6Hz5VUrseQddYcrOu'
const outputPath = join(__dirname, 'google-reviews-page.html')

const waitForEnter = () => new Promise(resolve => {
	const rl = createInterface({ input: process.stdin, output: process.stdout })
	rl.question('Press Enter when the page has loaded...', () => {
		rl.close()
		resolve()
	})
})

const main = async () => {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	})
	const page = await browser.newPage()

	await page.setViewport({ width: 1280, height: 800 })

	console.log('Navigating to:', url)
	await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

	await waitForEnter()

	const html = await page.content()

	await browser.close()

	await writeFile(outputPath, html)
	console.log('Wrote HTML to:', outputPath)
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
