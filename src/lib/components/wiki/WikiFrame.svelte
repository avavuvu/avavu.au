<script lang="ts">
	import type { Snippet } from 'svelte'

	const { children, align = 'right' }: {
		children: Snippet
		align?: 'left' | 'right' | 'center'
	} = $props()
</script>

<aside
	class="float-none my-2"
	class:left={align === 'left'}
	class:right={align === 'right'}
	class:center={align === 'center'}
>
	{@render children()}
</aside>

<style>
	aside {
		text-align: center;
		border: 1px solid black;
		max-width: 15em;

		@media (width >= 40rem) {
			&.right {
				float: right;
			}
			&.left {
				float: left;
			}
			&.center {
				float: none;
				margin: 1em auto;
				max-width: none;
			}
		}
	}
</style>
