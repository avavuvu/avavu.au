<script lang="ts">
	import { yearsSince } from '$lib/utils'

	const { date }: { date: string | Date; scale: 'year' } = $props()
</script>

<span>
	{yearsSince(date)}
</span>
