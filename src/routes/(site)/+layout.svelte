<script lang="ts">
	import '../layout.css'
	import { navigating, page } from '$app/state'
	import { afterNavigate, goto } from '$app/navigation'
	import WikiGraph from '$lib/components/wiki/WikiGraph.svelte'
	import { getIdForPath } from '$lib/wikiCategory'

	const { children } = $props()

	let content: HTMLElement
	let previousPath: string | null = null

	const closed = $derived(page.route.id === '/(site)/graph')
	const home = $derived(page.route.id === '/(site)')

	const loading = $derived(navigating.to !== null)
	const pendingId = $derived(navigating.to ? getIdForPath(navigating.to.url.pathname) : null)

	afterNavigate(({ type, from }) => {
		if (from && from.route.id !== '/(site)/graph') previousPath = from.url.pathname
		if (type !== 'popstate' && content) content.scrollTop = 0
	})

	const reopen = () => goto(previousPath ?? '/')

	let pressedOutside = false

	const pressBackground = (event: PointerEvent) => {
		pressedOutside = event.target === event.currentTarget
	}

	const clickBackground = (event: MouseEvent) => {
		if (pressedOutside && event.target === event.currentTarget) goto('/graph')
		pressedOutside = false
	}

	let lastFocus: { current: string | null; highlighted: string[] | null } = {
		current: null,
		highlighted: null
	}

	const focus = $derived.by(() => {
		if (pendingId) {
			lastFocus = { current: pendingId, highlighted: null }
		} else if (!closed && !loading) {
			lastFocus = {
				current: page.data.current ?? null,
				highlighted: page.data.highlighted ?? null
			}
		}
		return lastFocus
	})
</script>

<div aria-hidden={!closed} class="background">
	<WikiGraph current={focus.current} highlighted={focus.highlighted} interactive={closed} />
</div>

{#if closed}
	<button class="open" onclick={reopen}>open</button>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<main
	class:wide={page.data.wide}
	class:closed
	onpointerdown={pressBackground}
	onclick={clickBackground}
>
	<section class:wide={page.data.wide}>
		<header>
			<a href="/graph">close</a>
			{#if !home}
				<a href="/">home</a>
			{/if}
		</header>

		<div class="content" class:loading aria-busy={loading} bind:this={content}>
			{@render children()}
		</div>
	</section>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100svh;
		padding: 1rem;

		&.wide {
			@media (width >= 1100px) {
				height: auto;
				min-height: 100svh;
				align-items: flex-start;
				padding: 3rem 1rem;
			}
		}
	}

	section {
		display: flex;
		flex-direction: column;
		border: 1px solid black;
		background-color: white;
		width: 100%;
		max-width: 40rem;
		max-height: calc(100svh - 2rem);

		&.wide {
			max-width: 52rem;

			@media (width >= 1100px) {
				max-width: 40rem;
				max-height: none;
				margin-right: 17rem;

				.content {
					overflow: visible;
				}
			}
		}

		:global {
			a {
				text-decoration: underline;
			}

			h1 {
				font-size: 1rem;
				font-weight: bold;
				margin-bottom: 0.5em;
			}

			h2 {
				font-size: 1.2rem;
				font-weight: bold;
				margin: 1em 0 0.5em;
			}

			h3 {
				font-weight: bold;
			}

			p,
			ul,
			ol,
			blockquote,
			img {
				margin-bottom: 1em;
			}

			li {
				margin-bottom: 0.2em;
			}

			ul {
				list-style: none;
				padding-left: 1.5em;
			}

			blockquote {
				margin-left: 1rem;
			}

			hr {
				margin: 1em 0;
			}

			img,
			video {
				max-width: 100%;
				height: auto;
			}
		}
	}

	.content {
		padding: 1em 2em 2em;
		overflow-y: auto;
		transition: opacity 200ms ease-in;

		&.loading {
			opacity: 0;
			transition: opacity 150ms ease-out;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;

			&.loading {
				opacity: 0.5;
				transition: none;
			}
		}
	}

	header {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		justify-content: start;
		gap: 1em;
		padding: 0 2em;
		border-bottom: 1px solid black;
		background-color: white;

		a {
			color: black;
			text-decoration: underline;
		}
	}

	main.closed {
		display: none;
	}

	.open {
		position: fixed;
		top: 1rem;
		right: 1rem;
		border: 1px solid black;
		background-color: white;
		padding: 0.25rem 0.75rem;
		cursor: pointer;
	}

	.background {
		z-index: -10;
		position: fixed;
		inset: 0;
	}
</style>
