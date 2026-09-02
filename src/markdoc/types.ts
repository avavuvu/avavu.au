export type Collaborator = {
	name: string
	url?: string
}

export type MusicLinks = {
	bandcamp: string
	apple: string
	spotify: string
}

export type Frontmatter = {
	title: string
	aliases?: string[]
    tags?: string[]
}

export type WikiFrontmatter = {
	kind: 'wiki'
}

export type ArchiveFrontmatter = {
	kind: 'archive'
	date: string
	type: 'misc' | 'interactive' | 'ephemera' | 'music' | 'video'
	rating?: 5
	link?: string
	youtubeId?: string
	collaborators?: Collaborator[]
	music?: MusicLinks
}

export type MarkdownFrontmatter = Frontmatter & (WikiFrontmatter | ArchiveFrontmatter)
