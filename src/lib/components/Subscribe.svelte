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

<form onsubmit={submit} class="flex flex-col justify-center gap-2">
	<input
		class="mx-auto max-w-56 border py-2 text-center"
		bind:value={emailInput}
		placeholder="ava@example.com"
		type="email"
		required
	/>

	<input
		class="mx-auto max-w-56 border py-2 text-center"
		bind:value={nameInput}
		placeholder="your name"
		type="text"
		required
	/>

	<button
		class="hover:bg-blue mx-auto max-w-36 cursor-pointer border px-4
		py-2 transition-colors hover:bg-black hover:text-white"
		type="submit">Subscribe</button
	>
</form>

<style>
</style>
