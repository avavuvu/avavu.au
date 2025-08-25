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
    type Comment = NonNullable<AppBskyFeedDefs.ThreadViewPost["replies"]>[0];

    const fetchComments = async (): Promise<Comment[]> => {
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
          return []
        }

        return data.thread.replies
    }

</script>


<section class="max-w-[620px] mx-auto font-system">
  <h2 id="comments">Comments</h2>
  {#await fetchComments()}
      
  {:then comments} 
      {#each comments as comment}
        {#if comment.$type === "app.bsky.feed.defs#threadViewPost" && comment.replies}
          {#each comment.replies as reply}
            {#if reply.$type === "app.bsky.feed.defs#threadViewPost"}
              <Reply 
                reply={reply}
                depth={0}></Reply>
            {/if}
            
          {/each}
          
        {/if}
      {/each}
  {/await}
</section>

