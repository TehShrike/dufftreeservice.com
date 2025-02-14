import { readdir, readFile as read_file, writeFile as write_file } from 'node:fs/promises'
import { join as join_path } from 'node:path'

const input_directory = './content'
const output_directory = './docs'

const indent = (str, tab_count) =>
	str
		.trim()
		.split('\n')
		.map(line => line === '' ? line : '\t'.repeat(tab_count) + line)
		.join('\n');

const main = async () => {
	const content_files = await readdir(input_directory)

	const non_template_files = content_files.filter(file => file !== 'template.html')

	const template = await read_file('./content/template.html', { encoding: 'utf8' })

	const contents = await Promise.all(non_template_files.map(async file => ({
		file,
		content: await read_file(join_path(input_directory, file), { encoding: 'utf8' })
	})))

	await Promise.all(contents.map(async ({file,content}) => {
		const output_html = template.replace(/\t{3}<!-- content -->/, indent(content, 3))
		await write_file(join_path(output_directory, file), output_html)
	}))
}

main()
