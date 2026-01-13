import { execSync } from 'child_process'
import { readdirSync } from 'fs'

const pictures_dir = './docs/pictures'
const service_jpgs = readdirSync(pictures_dir).filter(f => f.startsWith('service_') && f.endsWith('.jpg'))

for (const jpg of service_jpgs) {
	const base_name = jpg.replace('.jpg', '')
	const input = `${pictures_dir}/${jpg}`
	const output = `${pictures_dir}/${base_name}_hero.webp`
	execSync(`npx sharp -i "${input}" -o "${output}" -f webp --quality 50 resize 1600`)
	console.log(output)
}
