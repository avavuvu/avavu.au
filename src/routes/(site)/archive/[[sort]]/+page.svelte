<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()

	const icons: Record<string, string> = {
		interactive: '☺',
		misc: '⌾',
		ephemera: '★',
		music: '♫',
		video: '▸',
		writing: '✎'
	}

	const sortLinks = [
		{ sort: 'year', href: '/archive', label: 'year' },
		{ sort: 'type', href: '/archive/type', label: 'category' },
		{ sort: 'rating', href: '/archive/rating', label: 'how much i like it' }
	]

	let query = $state('')

	const matches = (title: string) => title.toLowerCase().includes(query.trim().toLowerCase())

	const anyMatch = $derived(
		data.groups.some(({ works }) => works.some(({ title }) => matches(title)))
	)
</script>

<Meta title="Archive" description="Everything Ava Dinh-Vu has ever made" />

<h1>everything i've ever made</h1>

<nav aria-label="Sort the archive">
	sort by:
	{#each sortLinks as { sort, href, label }}
		<a {href} aria-current={data.sort === sort ? 'page' : undefined}>{label}</a>
	{/each}
</nav>

<search>
	<label>
		search
		<input type="search" bind:value={query} />
	</label>
</search>

{#each data.groups as { label, works }}
	<section hidden={!works.some(({ title }) => matches(title))}>
		<h2>{data.sort === 'type' ? `${icons[label] ?? ''} ${label}` : label}</h2>
		<ul class="archive">
			{#each works as work}
				<li hidden={!matches(work.title)}>
					<span>{icons[work.type] ?? ''}</span>
					<a href={work.href}>{work.title}</a>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<p hidden={anyMatch}>Nothing matches “{query}”.</p>

<style>
	nav {
		display: flex;
		gap: 0.5em;
	}

	ul.archive {
		list-style: none;
		padding-left: 0;
	}

	input {
		border-radius: 0;
		outline: none;
		border: 1px solid black;
	}

	span {
		display: inline-block;
		width: 1.2em;
	}

	[aria-current='page'] {
		font-weight: bold;
	}
</style>
