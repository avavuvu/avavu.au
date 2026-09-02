<script lang="ts">
	const { date, scale }: { date: string | Date; scale: 'year' } = $props()

	const now = new Date().getFullYear()
	// svelte-ignore state_referenced_locally
	const timeSince = now - (new Date(date)).getFullYear()
</script>

<span>
    {timeSince}
</span>
