<script lang="ts">
    import movies from "$lib/movies.json"
</script>

<ul>
    {#each movies as {id, title, year, rating, comment, image, url}}
       	<li>
            <img src={image} alt="Poster for {title}"/>
            <hgroup>
                <h3>
                    <a href={url}>{title} – {year}</a>
                </h3>
                <p>{rating && "★".repeat(rating)}</p>

                {@html comment}

            </hgroup>
        </li>
    {/each}

</ul>

<style>
    li {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 1em;
    }
</style>
