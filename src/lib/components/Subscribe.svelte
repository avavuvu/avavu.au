<script lang="ts">
	let emailInput = $state('')
	let nameInput = $state('')

	const submit = (event: Event) => {
		event.preventDefault()

		const redirectUrl = new URL(
			'https://zdmicvoeex2g3ep2j2jngrobs40sltyp.lambda-url.ap-southeast-2.on.aws/subscribe'
		)
		redirectUrl.searchParams.append('email', emailInput)
		redirectUrl.searchParams.append('name', nameInput)

		window.location.href = redirectUrl.toString()
	}
</script>

<form onsubmit={submit}>
	<input bind:value={emailInput} placeholder="ava@example.com" type="email" required />

	<input bind:value={nameInput} placeholder="your name" type="text" required />

	<button type="submit">Subscribe</button>
</form>
