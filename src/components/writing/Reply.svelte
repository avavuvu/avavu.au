<script lang="ts">
  import { AppBskyFeedDefs, AppBskyFeedPost } from "@atcute/bluesky";
    import Reply from "./Reply.svelte"
  import { slide } from "svelte/transition";

    const { depth, reply }: {
        depth: number,
        reply: AppBskyFeedDefs.ThreadViewPost
    } = $props()

    type Post = AppBskyFeedPost.Main

    let post: Post | null = reply.post.record.$type === "app.bsky.feed.post"
        ? reply.post.record as Post
        : null

    const { author } = reply.post

    const pluralize = (word: string, count: number) => {
        if(count === 1) {
           return word 
        }

        return `${word}s`
    }

    const regex = /post(.)*/

    const postRKey = reply.post.uri.match(regex)

    const replyUrl = postRKey 
        ? `https://bsky.app/profile/${reply.post.author.did}/${postRKey[0]}`
        : null

</script>

<div 
    style:margin-left="{depth * 2}rem"
    class="my-2">
    <div class="grid grid-cols-[4rem_auto] min-h-18 gap-2 align-middle border-b">
        <a href="https://bsky.app/profile/{author.did}">
            <!-- svelte-ignore a11y_missing_attribute -->
            <img src={author.avatar}>
        </a>
        <div>
            <div>
                <a 
                    class="text-blue underline"
                    href="https://bsky.app/profile/{author.did}">
                    @{author.handle}
        
                </a>
            </div>
            <div>
                {post?.text}
            </div>
        </div>
    </div>
    <div class="text-right flex-wrap flex justify-end">
        {#each {length: reply.post.likeCount || 0 } }
            <span>♥</span>
        {/each}
        <span class="px-2">
            {reply.post.likeCount} {pluralize("like", reply.post.likeCount || 0)}
        </span>

        {#if replyUrl}
            <a class="text-blue underline" href={replyUrl}>
                bsky
            </a>
        {/if}
    </div>
    

    {#if depth < 6}
        {#if reply.replies}
            {#each reply.replies as nestedReply}
                {#if nestedReply.$type === "app.bsky.feed.defs#threadViewPost"}
                    <Reply reply={nestedReply} depth={depth + 1}></Reply>
                {/if}       
            {/each}
        {/if}
    {/if}
</div>