import { readdir, readFile as read_file, writeFile as write_file } from 'node:fs/promises'
import { join as join_path } from 'node:path'

const input_directory = './content'
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

		const output_html = template
			.replace(/\t{3}<!-- content -->/, indent(content, 3))
			.replace('<!-- title -->', title)

		await write_file(join_path(output_directory, file), output_html)
	}))
}

main()
