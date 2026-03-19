import { readdir, readFile as read_file, writeFile as write_file } from 'node:fs/promises'
import { join as join_path } from 'node:path'
import sh from 'shell-tag'

const input_directory = './content'
const components_directory = './content/components'
const output_directory = './docs'
const site_title = 'Duff Tree Service'

const indent = (str, tab_count) =>
	str
		.trim()
		.split('\n')
		.map(line => /^\s*$/.test(line)
			? ''
			: ('\t'.repeat(tab_count) + line)
		)
		.join('\n');

const main = async () => {
	const content_directory_files = await readdir(input_directory)

	const { default: titles } = await import('./' + join_path(input_directory, 'titles.js'))

	let component_files = await readdir(components_directory)

	let components = Object.fromEntries(await Promise.all(component_files.filter(f => f.endsWith('.html')).map(async file => {
		const name = file.slice(0, -5)
		return [name, await read_file(join_path(components_directory, file), { encoding: 'utf8' })]
	})))

	Object.keys(components).forEach(name => {
		Object.entries(components).forEach(([component_name, component_html]) => {
			components[name] = components[name].replace(
				new RegExp(`<!-- ${component_name} -->`, 'g'),
				component_html.trim()
			)
		})
	})

	const content_html_files = content_directory_files.filter(
		file => file.endsWith('.html') && file !== 'template.html'
	)

	const template = await read_file('./content/template.html', { encoding: 'utf8' })

	const contents = await Promise.all(content_html_files.map(async file => ({
		file,
		content: await read_file(join_path(input_directory, file), { encoding: 'utf8' })
	})))

	await Promise.all(contents.map(async ({file, content}) => {
		const name = file.slice(0, -5)
		const title = name in titles
			? `${site_title} | ${titles[name]}`
			: site_title

		// Replace component placeholders
		let processed_content = content
		for (const [component_name, component_html] of Object.entries(components)) {
			processed_content = processed_content.replace(
				new RegExp(`<!-- ${component_name} -->`),
				component_html.trim()
			)
		}

		const output_html = template
			.replace(/\t{3}<!-- content -->/, indent(processed_content, 3))
			.replace('<!-- title -->', title)

		await write_file(join_path(output_directory, file), output_html)
	}))

	const output_files = content_html_files.map(file => join_path(output_directory, file))
	await sh`git add ${output_files}`

	await generate_sitemap(output_files)
}

const generate_sitemap = async (output_files) => {
	const sitemap_path = join_path(output_directory, 'sitemap.xml')
	const base_url = 'https://www.dufftreeservice.com'
	const today = new Date().toISOString().slice(0, 10)

	const previous_lastmods = await read_file(sitemap_path, { encoding: 'utf8' })
		.then(xml => Object.fromEntries(
			[...xml.matchAll(/<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)]
				.filter(m => m[2])
				.map(m => [m[1], m[2]])
		))
		.catch(() => ({}))

	const staged_files = new Set(
		sh`git diff --cached --name-only`.trim().split('\n').filter(Boolean)
	)

	const urls = output_files.map(file => {
		const name = file.replace(/^\.\//, '').replace(/^docs\//, '')
		const loc = name === 'index.html'
			? `${base_url}/`
			: `${base_url}/${name}`

		const lastmod = staged_files.has(file.replace(/^\.\//, ''))
			? today
			: previous_lastmods[loc] || null

		return lastmod
			? `\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t</url>`
			: `\t<url>\n\t\t<loc>${loc}</loc>\n\t</url>`
	})

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

	await write_file(sitemap_path, sitemap)
}

main()
