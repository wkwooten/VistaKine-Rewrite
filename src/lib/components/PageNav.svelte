<script lang="ts">
    import { ArrowLeft, ArrowRight, Menu } from 'lucide-svelte';

    // Define types for the expected navigation structures
    type ChapterLink = { slug: string; title: string } | null;
    type SectionLink = { slug: string; title: string; id?: string } | null;

    // Props for chapter navigation
    export let prevChapter: ChapterLink = null;
    export let nextChapter: ChapterLink = null;

    // Props for section navigation
    export let prevSection: SectionLink = null;
    export let nextSection: SectionLink = null;
    export let currentChapterSlug: string = '';

    // Determine navigation mode
    $: hasChapterNav = prevChapter !== null || nextChapter !== null;
    $: hasSectionNav = prevSection !== null || nextSection !== null;
</script>

<nav class="page-nav">
    <div class="nav-links">
        <!-- Previous link (section takes priority over chapter) -->
        {#if prevSection && currentChapterSlug}
            <a href={`/chapter/${currentChapterSlug}/${prevSection.slug}`} class="nav-link prev">
                <ArrowLeft size={18} />
                <span>Previous: {prevSection.title}</span>
            </a>
        {:else if prevChapter}
            <a href={`/chapter/${prevChapter.slug}`} class="nav-link prev">
                <ArrowLeft size={18} />
                <span>Previous Chapter: {prevChapter.title}</span>
            </a>
        {:else}
            <span class="nav-link prev disabled">
                <ArrowLeft size={18} />
                <span>Beginning</span>
            </span>
        {/if}

        <!-- Table of Contents link in the middle -->
        <a href="/chapter/toc" class="nav-link toc">
            <Menu size={18} />
            <span>Table of Contents</span>
        </a>

        <!-- Next link (section takes priority over chapter) -->
        {#if nextSection && currentChapterSlug}
            <a href={`/chapter/${currentChapterSlug}/${nextSection.slug}`} class="nav-link next">
                <span>Next: {nextSection.title}</span>
                <ArrowRight size={18} />
            </a>
        {:else if nextChapter}
            <a href={`/chapter/${nextChapter.slug}`} class="nav-link next">
                <span>Next Chapter: {nextChapter.title}</span>
                <ArrowRight size={18} />
            </a>
        {:else}
            <span class="nav-link next disabled">
                <span>End</span>
                <ArrowRight size={18} />
            </span>
        {/if}
    </div>
</nav>

<style lang="scss">
    .page-nav {
        margin-top: var(--space-l);
        padding: var(--space-m) var(--space-l);
        border-top: 1px solid var(--color-border);
        text-align: center;
        width: 100%;
    }

    .nav-links {
        display: flex;
        justify-content: space-between;
        max-width: var(--max-content-width, 1200px);
        margin: 0 auto;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: var(--space-s);
        }
    }

    .nav-link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2xs);
        color: var(--color-text-primary);
        text-decoration: none;
        padding: var(--space-xs) var(--space-s);
        border-radius: var(--radius-md);
        transition: all 0.2s ease;
        font-size: var(--step--1);

        &:hover {
            background-color: var(--color-accent-hover-bg);
            transform: translateY(-2px);
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
    }

    .nav-link.disabled {
        color: var(--color-text-secondary);
        pointer-events: none;
        opacity: 0.6;
    }
</style>
