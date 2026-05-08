<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import "../layout.css"
	import Block from '$lib/components/lander/Block.svelte'
	import { globalState } from '$lib/lander.svelte.js'
	import { fade, type TransitionConfig } from 'svelte/transition'
	import { onMount } from 'svelte'

	let { children, data } = $props()

	function noopTransition(node: Element): TransitionConfig {
		return fade(node, { duration: 0 });
	}

	let transition = $state(noopTransition)
	onMount(() => { transition = fade })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Ava Dinh-Vu</title>
</svelte:head>



<main class="md:grid h-screen grid-cols-8 gap-1 py-10 pr-10 pl-4 text-sm">
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

<div 
	aria-hidden="true" 
	class="top-0 left-0 h-screen w-screen -z-10 fixed  text-[#fff718] font-sans pointer-events-none">
	{#key globalState.header}
	<span class="top-20 lg:-top-20 absolute tracking-tighter break-all
		text-[15rem] lg:text-[30rem] 
		leading-48 lg:leading-96 font-light"
		transition:transition>
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

			code {
				word-break: break-all;
				font-size: smaller;
			}

			p, ul {
				margin-bottom: 1em;
			}

			hr {
				margin: 1em 0;
			}
		}
	}
</style>
