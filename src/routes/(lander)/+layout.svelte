<script lang="ts">
	import '../layout.css'
	import Block from '$lib/components/lander/Block.svelte'
	import { globalState } from '$lib/lander.svelte.js'
	import { fade, type TransitionConfig } from 'svelte/transition'
	import { onMount } from 'svelte'

	let { children, data } = $props()

	function noopTransition(node: Element): TransitionConfig {
		return fade(node, { duration: 0 })
	}

	let transition = $state(noopTransition)
	onMount(() => {
		transition = fade
	})
</script>

<svelte:head>
	<title>Ava Dinh-Vu</title>
</svelte:head>

<main class="h-screen grid-cols-8 gap-1 py-10 pr-10 pl-4 text-right text-sm md:grid md:text-left">
	<Block depth={1} colStart={7}>
		{#snippet heading()}
			<a href="/">Ava Dinh-Vu</a>
		{/snippet}
		<p>I like art and other people</p>

		<ul>
			<li>
				<a href="/web">web design</a>
			</li>
			<li>
				<a href="/games">games</a>
			</li>
			<li>
				<a href="/newsletter">newsletter</a>
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

<div
	aria-hidden="true"
	class="pointer-events-none fixed top-0 left-0 -z-10 h-screen w-screen font-sans text-[#fff718]"
>
	{#key globalState.header}
		<span
			class="absolute top-20 text-[15rem] leading-48 font-light
		tracking-tighter break-all
		lg:-top-20 lg:text-[30rem] lg:leading-96"
			transition:transition
		>
			{globalState.header}
		</span>
	{/key}
</div>

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

			pre code {
			    display: block;
				overflow: scroll;
				text-wrap: stable;

			}

			code {
				word-break: break-all;
				font-size: smaller;
			}

			p,
			ul {
				margin-bottom: 1em;
			}

			hr {
				margin: 1em 0;
			}

			&.needs-background {
				margin-bottom: 6rem;
				background-color: white;
				border: 1px solid black;
				margin: 0px 0rem;
				padding: 0.5rem 1rem;

				margin-top: 2em;

				@media (width >= 64rem) {
					margin-inline: calc(var(--spacing) * 10);
					margin-top: 0em;
				}
			}
		}
	}
</style>
