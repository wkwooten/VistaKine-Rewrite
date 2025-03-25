<script>
    // Changed to accept chapter data instead of section data
    export let prevChapter = null;
    export let nextChapter = null;
</script>

<nav class="page-nav">
    <div class="nav-links">
        {#if prevChapter}
            {#if typeof prevChapter === 'string'}
                <!-- If prevChapter is a string (URL), link directly -->
                <a href={prevChapter} class="nav-link prev">
                    <span class="arrow">&larr;</span>
                    Table of Contents
                </a>
            {:else}
                <!-- Default: prevChapter is a chapter object -->
                <a href={`/chapter/${prevChapter.slug}`} class="nav-link prev">
                    <span class="arrow">&larr;</span>
                    Previous Chapter: {prevChapter.title}
                </a>
            {/if}
        {/if}

        <!-- Table of Contents link in the middle -->
        <a href="/chapter/toc" class="nav-link toc">
            Table of Contents
        </a>

        {#if nextChapter}
            <a href={`/chapter/${nextChapter.slug}`} class="nav-link next">
                Next Chapter: {nextChapter.title}
                <span class="arrow">&rarr;</span>
            </a>
        {/if}
    </div>
</nav>

<style lang="scss">
    .page-nav {
        margin-top: var(--space-xl); // Space above the nav
        padding: var(--space-m) var(--space-l);
        border-top: 1px solid var(--border-color);
        text-align: center; // Center align links for now
        width: 100%;
    }

    .nav-links {
        display: flex;
        justify-content: space-between; // Distribute links
        max-width: var(--max-content-width); // Limit width of links
        margin: 0 auto; // Center the links container
    }

    .nav-link {
        display: inline-flex;
        align-items: center;
        color: var(--text-color);
        text-decoration: none;
        padding: var(--space-s) var(--space-m);
        border-radius: var(--radius-md);
        transition: background-color var(--transition-fast);

        &:hover {
            background-color: var(--brand-hover-bg);
        }

        &.prev {
            justify-content: flex-start;
        }

        &.next {
            justify-content: flex-end;
        }

        &.toc {
            justify-content: center;
        }

        .arrow {
            display: inline-block;
            margin-inline: var(--space-xs);
        }
    }
</style>
