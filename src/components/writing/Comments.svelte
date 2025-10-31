<script lang="ts">
    import { AppBskyEmbedExternal, AppBskyFeedDefs, AppBskyFeedGetPostThread, AppBskyFeedPost } from "@atcute/bluesky";
    import Reply from "./Reply.svelte";

    const { bsky }: {
        bsky: {
            did: string,
            postCid: string
        }
    } = $props()

    const { did, postCid } = bsky

    type BlueskyPost = AppBskyFeedPost.Main;
    type BlueskyExternalEmbed = AppBskyEmbedExternal.View;
    type ThreadView = AppBskyFeedDefs.ThreadViewPost;
    type Comment = NonNullable<AppBskyFeedDefs.ThreadViewPost["replies"]>[0] | {
        $type: "none"
    };

    const fetchComments = async (): Promise<void> => {
        const params: AppBskyFeedGetPostThread.$params = {
            uri: `at://${did}/app.bsky.feed.post/${postCid}`,
            depth: 5,
            
        }
        
        const searchParams = new URLSearchParams();
        searchParams.append("uri", params.uri);
        if (params.depth !== undefined) {
          searchParams.append("depth", params.depth.toString());
        }
        if (params.parentHeight !== undefined) {
          searchParams.append("parentHeight", params.parentHeight.toString());
        }

        const response = await fetch(
          "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?" +
            searchParams,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data: AppBskyFeedGetPostThread.$output = await response.json();

        if(data.thread.$type !== "app.bsky.feed.defs#threadViewPost") {
          throw new Error(`Failed to fetch comments: ${data.thread.$type}`)
        }

        if(!data.thread.replies) { 
          return 
        }

        if(data.thread.replies.length == 0) {
            shownComments = [
                {
                    $type: "none",
                }
            ]
            return
        }

        allComments = data.thread.replies
        shownComments = allComments.slice(0, commentsToShow)
    }

    const showMoreComments =  () => { 
        pages += 1 
        shownComments = allComments.slice(0,commentsToShow * pages); 
    }

    let allComments: Comment[] = $state([])
    let commentsToShow = 4
    let pages = 1
    let shownComments: Comment[] = $state([])

</script>


<section class="article-grid">
    <div>
        <h2 id="comments">Leave a comment on <a class="text-blue underline" href="https://bsky.app/profile/{did}/post/{postCid}">Bluesky</a></h2>
    
        {#await fetchComments() }
            <!--  -->
        {/await}
    
        {#each shownComments as comment}
            {#if comment.$type === "app.bsky.feed.defs#threadViewPost" && comment.replies}
                <Reply 
                reply={comment}
                depth={0}>
                </Reply>
            {:else if comment.$type === "none"}
                <div>
                    <a class="text-blue underline" href="https://bsky.app/profile/{did}/post/{postCid}">
                        Be the first to leave a comment.
                    </a>
                </div>
            {/if}
        {:else}
            Loading
        {/each}
    
        {#if shownComments.length < allComments.length}
            <div class="w-full flex justify-center">
                <button 
                    class="border cursor-pointer underline px-4 py-2"
                    onclick={showMoreComments}>
                    Show More Comments
                </button>
            </div>
        {/if}  
    </div>
</section>

