export interface Redirect {
	from: string
	to: string
	status: 301 | 302 | 307 | 308
}

export const redirects: Redirect[] = [
	{ from: '/about', to: '/other/about', status: 301 },
	{ from: '/subscribe', to: '/newsletter', status: 301 },
	{ from: '/projects', to: '/archive', status: 301 },
	{ from: '/writing', to: '/other/writing', status: 301 }
]
