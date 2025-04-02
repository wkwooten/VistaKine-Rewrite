function extractKeywords(svelteContent) {
  // 1. Create a dummy DOM element to parse the Svelte content as HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = svelteContent;

  // 2. Query select all elements with the class 'keyword'
  const keywordElements = tempElement.querySelectorAll('.keyword');

  // 3. Extract the text content from each keyword element
  const keywords = Array.from(keywordElements).map(element => element.textContent.trim());

  // 4. Return the array of keywords
  return keywords;
}

export default extractKeywords;
