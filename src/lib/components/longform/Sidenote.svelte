<script lang="ts">
	import type { Snippet } from 'svelte'

	const { children }: { children: Snippet } = $props()

	const id = $props.id()
</script>

<label for={id} class="sidenote-number"></label><input
	type="checkbox"
	{id}
	class="margin-toggle"
/><span class="sidenote">{@render children()}</span>
