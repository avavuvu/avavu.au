import Markdoc, { type Config } from '@markdoc/markdoc'

const tags: Config['tags'] = {
	tiktok: {
		attributes: {
			videoid: { type: String }
		},
		transform(node, config) {
			const attributes = node.transformAttributes(config)
			const videoid: string = attributes['videoid']

			return new Markdoc.Tag(`lite-tiktok`, {
				videoid
			})
		}
	},
	video: {
		attributes: {
			src: { type: String },
			type: { type: String, default: 'video/mp4' }
		},
		transform(node, config) {
			const attributes = node.transformAttributes(config)

			const source = new Markdoc.Tag('source', {
				src: attributes.src,
				type: attributes.type
			})

			return new Markdoc.Tag(
				'video',
				{
					controls: true
				},
				[source]
			)
		}
	},
	'street-view': {
		attributes: {
			lat: { type: String },
			long: { type: String },
			name: { type: String }
		},
		transform(node, config) {
			const attributes = node.transformAttributes(config)
			const lat: string = attributes['lat']
			const long: string = attributes['long']
			const name: string = attributes['name']

			return new Markdoc.Tag('img', {
				src: `/images/writing/tram/${name}.jpg`,
				loading: 'lazy',
				class: 'street-view-image'
			})
		}
	},
	youtube: {
		attributes: {
			watch: { type: String },
			start: { type: Number }
		},
		transform(node, config) {
			const attributes = node.transformAttributes(config)
			const watch: string = attributes['watch']
			const start: number | undefined = attributes['start']

			// LAZY
			const out: any = {
				videoid: watch
			}

			if (start) {
				out['params'] = `start=${start}`
			}

			return new Markdoc.Tag(`lite-youtube`, out)
		}
	},
	note: {
		render: 'Sidenote',
		attributes: {
			i: { type: String }
		},
		selfClosing: true,
		inline: true
	},
	'note-content': {
		attributes: {
			i: { type: String }
		},
		transform(node) {
			return new Markdoc.Tag()
		}
	},
	full: {
		render: 'div',
		attributes: {
			class: { type: String, default: 'full' }
		}
	},
	most: {
		render: 'div',
		attributes: {
			class: { type: String, default: 'most' }
		}
	},
	attribution: {
		render: 'figure',
		transform: (node, config) => {
			const attributes = node.transformAttributes(config)

			const caption = node.children.find((child) => child.tag === 'from')

			const figure = caption
				? new Markdoc.Tag('figcaption', {}, [Markdoc.transform(caption)])
				: undefined

			const otherNodes = node.children.filter((child) => child.tag !== 'from')
			const transformedNodes = otherNodes
				.map((node) => Markdoc.transform(node, config))
				.flat()
				.filter((node) => node !== null)

			return new Markdoc.Tag(
				`figure`,
				{ ...attributes },
				figure ? [...transformedNodes, figure] : [...transformedNodes]
			)
		}
	},
	from: {
		render: 'div',
		attributes: {
			class: { type: String, default: 'from' }
		}
	}
}

export default tags
