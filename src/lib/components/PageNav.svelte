<script>
    // You can add logic here later to dynamically determine previous/next sections
    export let prevSection = null;
    export let nextSection = null;
</script>

<nav class="page-nav">
    <div class="nav-links">
        {#if prevSection}
            <a href={`#{prevSection.id}`} class="nav-link prev">
                <span class="arrow">&larr;</span>
                Previous: {prevSection.title}
            </a>
        {/if}
        {#if nextSection}
            <a href={`#{nextSection.id}`} class="nav-link next">
                Next: {nextSection.title}
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

        .arrow {
            display: inline-block;
            margin-inline: var(--space-xs);
        }
    }
</style>
