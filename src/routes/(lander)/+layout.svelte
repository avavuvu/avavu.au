<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import "../layout.css"
	import Block from '$lib/components/lander/Block.svelte'

	let { children, data } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Ava Dinh-Vu</title>
</svelte:head>

<main class="block md:grid h-screen grid-cols-8 gap-1 py-10 pr-10 pl-4 text-sm">
	<Block depth={1} colStart={7}>
		{#snippet heading()}
			<a href="/">Ava Dinh-Vu</a>
		{/snippet}
		<p>I like art and other people</p>
	
		<ul>
			<li>
				<a  href="/web">web design</a>
			</li>
			<li>
				<a  href="/games">games</a>
			</li>
			<li>
				<a  href="/newsletter">newsletter</a>
			</li>
		</ul>
	
		<ul>
			<li>
				<a href="/other">other</a>
			</li>
			<li>
				<a href="/archive">everything i've ever made</a>
			</li>
		</ul>
	</Block>
	{@render children()}

</main>

<style>
	:global {
		.content {
			h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				font-weight: bold;
			}

			blockquote {
				margin-left: 1rem;
			}

			a {
				text-decoration: underline;
			}

			p, ul {
				margin-bottom: 1em;
			}
		}
	}
</style>
