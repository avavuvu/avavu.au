<script lang="ts">
    import WikiFrame from './WikiFrame.svelte'

    const { title, id, align = 'right' }: {
        title: string,
        id?: string,
        align?: 'left' | 'right' | 'center'
    } = $props()
</script>

<WikiFrame {align}>
    <div class="row">
        <svg class="icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">W</text>
        </svg>
        <a href="https://en.wikipedia.org/wiki/{id ?? title}" target="_blank" rel="noopener noreferrer">
            Wikipedia has an article for {title}
        </a>
    </div>
</WikiFrame>

<style>
    .icon {
        width: 2em;
        height: 2em;
        font-size: x-large;
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
