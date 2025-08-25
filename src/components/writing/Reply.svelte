<script lang="ts">
  import { AppBskyFeedDefs, AppBskyFeedPost } from "@atcute/bluesky";
    import Reply from "./Reply.svelte"

    const { depth, reply }: {
        depth: number,
        reply: AppBskyFeedDefs.ThreadViewPost
    } = $props()

    type Post = AppBskyFeedPost.Main

    let post: Post | null = reply.post.record.$type === "app.bsky.feed.post"
        ? reply.post.record as Post
        : null

    const { author, replyCount } = reply.post

    const pluralize = (word: string, count: number) => {
        if(count === 1) {
           return word 
        }

        return `${word}s`
    }

</script>

<div class="grid grid-cols-[1rem_auto] py-2">
    <div class="relative">
        <div>

        </div>
    </div>
    <div class="">
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
        <div>
            This post has {reply.post.likeCount} {pluralize("like", reply.post.likeCount || 0)} and {reply.post.repostCount} {pluralize("repost", reply.post.likeCount || 0)}
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

</div>