export function parallaxBackground(): void {
  const background = document.querySelector('.parallax-background') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;

  if (!background || !content) return;

  // This creates a reverse/negative parallax effect
  // Background moves in opposite direction to scrolling
  const parallaxFactor = -0.15;

  const updateParallax = () => {
    const scrollTop = content.scrollTop;
    // Move background in opposite direction to scrolling for clearer effect
    background.style.transform = `translate3d(0, ${scrollTop * parallaxFactor}px, 0)`;
    // Update background height on each scroll event
    background.style.height = `${content.scrollHeight}px`;
  };

  // Initial update
  updateParallax();

  // Add scroll event listener to the content div
  content.addEventListener('scroll', updateParallax, { passive: true });

  // Set initial background height to content height
  background.style.height = `${content.scrollHeight}px`;
}