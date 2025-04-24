<script lang="ts">
    import { ArrowLeft, ArrowRight, Menu } from 'lucide-svelte';
    import { page } from '$app/stores'; // Import page store to get chapter title if needed

    // Define types for the expected navigation structures
    type ChapterLink = { slug: string; title: string } | null;
    type SectionLink = {
        slug: string;
        title: string;
        id?: string;
        number?: string; // Added optional section number
    } | null;

    // Props for chapter navigation
    export let prevChapter: ChapterLink = null;
    export let nextChapter: ChapterLink = null;

    // Props for section navigation
    export let prevSection: SectionLink = null;
    export let nextSection: SectionLink = null;
    export let currentChapterSlug: string = '';
    // Optionally pass chapter title if available, otherwise try to infer
    export let currentChapterTitle: string | null = null;
    // ADDED: Accept chapter number
    export let currentChapterNumber: number | string | null = null;

    // Determine navigation mode
    $: hasChapterNav = prevChapter !== null || nextChapter !== null;
    $: hasSectionNav = prevSection !== null || nextSection !== null;

    // Helper to format slug to title if title prop not passed
    function formatSlugToTitle(slug: string): string {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

     // Determine the title for the current chapter link
     $: chapterIntroTitle = currentChapterTitle ?? (currentChapterSlug ? formatSlugToTitle(currentChapterSlug) : 'Chapter Intro');
</script>

<nav class="page-nav">
    <div class="nav-links">
        <!-- Previous link logic adjusted -->
        {#if prevSection && currentChapterSlug}
            <!-- Link to Previous Section -->
            <a
                href={`/chapter/${currentChapterSlug}/${prevSection.slug}`}
                class="nav-link prev"
                data-section-number={prevSection.number ?? ''}
            >
                <ArrowLeft size={18} />
                <div class="nav-content">
                    <div class="nav-label">Previous Section</div>
                    <div class="nav-title">{prevSection.title}</div>
                </div>
            </a>
        {:else if !prevSection && currentChapterSlug}
             <!-- Link to Current Chapter Intro -->
             <a
                href={`/chapter/${currentChapterSlug}`}
                class="nav-link prev chapter-intro-link"
                data-chapter-number={currentChapterNumber ?? ''}
            >
                 <ArrowLeft size={18} />
                 <div class="nav-content">
                     <div class="nav-label">Chapter Intro</div>
                     <div class="nav-title">{chapterIntroTitle}</div>
                 </div>
             </a>
        {:else if prevChapter}
             <!-- Link to Previous Chapter Intro -->
            <a href={`/chapter/${prevChapter.slug}`} class="nav-link prev">
                <ArrowLeft size={18} />
                <div class="nav-content">
                    <div class="nav-label">Previous Chapter</div>
                    <div class="nav-title">{prevChapter.title}</div>
                </div>
            </a>
        {:else}
             <!-- Fallback Link to Home -->
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
            <a
                href={`/chapter/${currentChapterSlug}/${nextSection.slug}`}
                class="nav-link next"
                data-section-number={nextSection.number ?? ''}
            >
                <div class="nav-content">
                    <div class="nav-label">Next Section</div>
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
            flex-direction: row;
            gap: var(--space-xs);
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
        min-width: 0;

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
            padding: var(--space-2xs) var(--space-3xs);
            gap: var(--space-3xs);
            flex: 1;
            min-width: 0;

            .nav-label {
                display: none;
            }

            .nav-title {
                font-size: var(--step--2);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .nav-content {
                flex: 0;
            }

            /* Ensure TOC remains centered - adjust as needed for row layout */
            &.toc {
                justify-content: center;
                 flex-grow: 0; /* Don't allow TOC to grow */
                 flex-basis: auto; /* Base size on icon */
                 padding-left: var(--space-xs); /* Add some padding */
                 padding-right: var(--space-xs);

                 .nav-content {
                     display: none; /* Hide text content for TOC */
                 }
            }
             &.prev, &.next {
                 /* flex-grow: 1; Allow prev/next to take remaining space */
                  .nav-title {
                       display: none; /* Hide original title on mobile */
                  }

                  /* Use pseudo-element to show number */
                  &::after {
                      /* Default to section number, specific rule below will override for chapter */
                      content: attr(data-section-number);
                      font-size: var(--step--2);
                      font-weight: 500; /* Optional: adjust weight */
                      margin-left: var(--space-3xs); /* Adjust spacing */
                      white-space: nowrap;
                  }
             }
              /* Adjust alignment for number */
             &.prev::after {
                 order: 1; /* Place number after icon */
                 margin-left: 0; /* REMOVED space next to arrow */
                 margin-right: 0;
             }
             /* Specific content for chapter intro link */
             &.prev.chapter-intro-link::after {
                 content: attr(data-chapter-number); /* Show chapter number */
             }
             &.next {
                /* Ensure icon is last */
                .nav-content { order: -1; display: none; } /* Hide placeholder */
                &::after {
                     order: -1; /* Place number before icon */
                     margin-left: 0;
                     margin-right: var(--space-3xs);
                 }
             }
        }
    }

    .nav-link.disabled {
        color: var(--color-text-secondary);
        pointer-events: none;
        opacity: 0.6;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: var(--space-xs);
        }
    }
</style>
