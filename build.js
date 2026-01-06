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

	const components = Object.fromEntries(await Promise.all(component_files.filter(f => f.endsWith('.html')).map(async file => {
		const name = file.slice(0, -5)
		return [name, await read_file(join_path(components_directory, file), { encoding: 'utf8' })]
	})))

	const content_html_files = content_directory_files.filter(
		file => file.endsWith('.html') && file !== 'template.html'
	)

	const template = await read_file('./content/template.html', { encoding: 'utf8' })

	const contents = await Promise.all(content_html_files.map(async file => ({
		file,
		content: await read_file(join_path(input_directory, file), { encoding: 'utf8' })
	})))

	Object.entries(contents).forEach(([file, content]) => {
		Object.entries(components).forEach(([component_name, component_html]) => {
			content = content.replace(
				new RegExp(`<!-- ${component_name} -->`),
				component_html.trim()
			)
		})
		contents[file] = content
	})

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
}

main()
