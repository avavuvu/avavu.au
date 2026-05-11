import Markdoc, { type Config, type Node, type RenderableTreeNode } from '@markdoc/markdoc'
import tags from '../markdoc/tags'
import yaml from 'js-yaml'

const content = import.meta.glob<string>(`/src/content/writing/*.mdoc`, {
	eager: true,
	query: '?raw',
	import: 'default'
})

export const getMarkdocContent = () => {
	const entries = Object.entries(content)

	const tokenizer = new Markdoc.Tokenizer({
		typographer: true
	})

	return entries.map(([path, body]) => {
		const id = path.split('/').at(-1)!.replace('.mdoc', '')
		const category = path.split('/').at(-2)!
		const ast = Markdoc.parse(tokenizer.tokenize(body))

		const notes = collectNotes(ast)

		const note: Config['tags'] = {
			note: {
				render: '',
				attributes: {
					i: { type: String }
				},
				selfClosing: false,
				inline: true,
				transform(node) {
					const i = node.attributes.i
					const html = notes[i]

					return [
						new Markdoc.Tag('label', { for: i, class: 'sidenote-number' }, []),
						new Markdoc.Tag(
							'input',
							{ type: 'checkbox', id: i, class: 'margin-toggle' },
							[]
						),
						new Markdoc.Tag('span', { class: 'sidenote' }, [html])
					]
				}
			}
		}

		const renderable = Markdoc.transform(ast, {
			tags: {
				...tags,
				note: note.note
			}
		})

		const html = Markdoc.renderers.html(renderable)
		const metadata: {
			title: string
			date: string
			description: string
			tags: string[]
			heroImageSrc: string
			heroImageAlt: string
			links: Array<{ title: string; pub: string; url: string }>
		} = ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : ({} as any)

		return {
			id,
			path,
			category,
			data: {
				html,
				metadata
			}
		}
	})
}

const collectNotes = (node: Node, sections: Record<string, RenderableTreeNode> = {}) => {
	if (node.tag) {
		if (node.tag === 'note-content') {
			//@ts-expect-error
			const renderableNode = Markdoc.transform(node, {
				tags: {
					...tags,
					'note-content': undefined
				},
				nodes: {
					paragraph: {
						render: 'span'
					}
				}
			})

			sections[node.attributes['i']] = renderableNode
		}
	}

	if (node.children) {
		for (const child of node.children) {
			collectNotes(child, sections)
		}
	}

	return sections
}
