<script lang="ts">

    let emailInput = $state("")
    let nameInput = $state("")

    const submit = (event: Event) => {
        event.preventDefault()

        const redirectUrl = new URL("https://zdmicvoeex2g3ep2j2jngrobs40sltyp.lambda-url.ap-southeast-2.on.aws/subscribe")
        redirectUrl.searchParams.append("email", emailInput)
        redirectUrl.searchParams.append("name", nameInput)

        console.log(redirectUrl)

        window.location.href = redirectUrl.toString()
    }
</script>


<form onsubmit={submit} class="flex gap-2 flex-col justify-center ">
    <input 
        class="max-w-48 border mx-auto"
        bind:value={emailInput}
        placeholder="Email"
        type="email" required>

    <input 
        class="max-w-48 border mx-auto"
        bind:value={nameInput}
        placeholder="Name"
        type="text" 
        required>
    <button 
        class="cursor-pointer hover:bg-[blue] hover:text-white max-w-36 mx-auto"
        type="submit">Subscribe</button>
</form>

<style>

</style>