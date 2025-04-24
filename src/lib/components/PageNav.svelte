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
                <div class="nav-content">
                    <div class="nav-label">Previous</div>
                    <div class="nav-title">{prevSection.title}</div>
                </div>
            </a>
        {:else if prevChapter}
            <a href={`/chapter/${prevChapter.slug}`} class="nav-link prev">
                <ArrowLeft size={18} />
                <div class="nav-content">
                    <div class="nav-label">Previous Chapter</div>
                    <div class="nav-title">{prevChapter.title}</div>
                </div>
            </a>
        {:else}
            <a href="/" class="nav-link prev">
                <ArrowLeft size={18} />
                <div class="nav-content">
                    <div class="nav-label">Home</div>
                    <div class="nav-title">Beginning</div>
                </div>
            </a>
        {/if}

        <!-- Table of Contents link in the middle -->
        <a href="/chapter/toc" class="nav-link toc">
            <Menu size={18} />
            <div class="nav-content">
                <div class="nav-title">Table of Contents</div>
            </div>
        </a>

        <!-- Next link (section takes priority over chapter) -->
        {#if nextSection && currentChapterSlug}
            <a href={`/chapter/${currentChapterSlug}/${nextSection.slug}`} class="nav-link next">
                <div class="nav-content">
                    <div class="nav-label">Next</div>
                    <div class="nav-title">{nextSection.title}</div>
                </div>
                <ArrowRight size={18} />
            </a>
        {:else if nextChapter}
            <a href={`/chapter/${nextChapter.slug}`} class="nav-link next">
                <div class="nav-content">
                    <div class="nav-label">Next Chapter</div>
                    <div class="nav-title">{nextChapter.title}</div>
                </div>
                <ArrowRight size={18} />
            </a>
        {:else}
            <span class="nav-link next disabled">
                <div class="nav-content">
                    <div class="nav-title">End</div>
                </div>
                <ArrowRight size={18} />
            </span>
        {/if}
    </div>
</nav>

<style lang="scss">
    .page-nav {
        margin-block: var(--space-l);
        padding: var(--space-m) var(--space-l);
        border-top: 1px solid var(--color-border);
        text-align: center;
        width: 100%;
        background-color: var(--color-surface);
        border-radius: var(--radius-md);
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
        display: flex;
        align-items: center;
        gap: var(--space-2xs);
        color: var(--color-text-primary);
        text-decoration: none;
        padding: var(--space-xs) var(--space-s);
        border-radius: var(--radius-md);
        transition: all 0.2s ease;
        font-size: var(--step--1);
        flex: 1;
        max-width: 33%;

        .nav-content {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1;
        }

        .nav-label {
            font-size: var(--step--2);
            color: var(--color-text-secondary);
            margin-bottom: var(--space-3xs);
        }

        .nav-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &:hover {
            background-color: var(--color-accent-hover-bg);
            transform: translateY(-2px);
        }

        &.prev {
            justify-content: flex-start;
            text-align: left;
        }

        &.next {
            justify-content: flex-end;
            text-align: right;

            .nav-content {
                align-items: flex-end;
            }
        }

        &.toc {
            justify-content: center;
            text-align: center;

            .nav-content {
                align-items: center;
            }
        }

        @media (max-width: 768px) {
            max-width: 100%;
        }
    }

    .nav-link.disabled {
        color: var(--color-text-secondary);
        pointer-events: none;
        opacity: 0.6;
    }
</style>
