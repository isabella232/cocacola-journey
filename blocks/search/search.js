import { createOptimizedPicture, lookupPages } from '../../scripts/scripts.js';

function createCard(row, style) {
  const card = document.createElement('a');
  card.href = row.path;
  card.classList.add('search-card');
  if (style) card.classList.add(style);

  card.innerHTML = `<h2>${row.title}</h2>`;
  card.prepend(createOptimizedPicture(row.image, row.title));
  return (card);
}

async function displaySearchResults(terms, results) {
  await lookupPages([]);
  const allPages = window.pageIndex.data;
  results.textContent = '';
  const filtered = allPages.filter((e) => e.title.toLowerCase().includes(terms.toLowerCase()));
  filtered.forEach((row) => {
    results.append(createCard(row));
  });
}

export default async function decorate(block) {
  block.innerHTML = `<div class="search-box"><input id="search-box" type="text" placeholder="${block.textContent}"></div>
    <div class="search-results"></div>`;
  const searchBox = document.getElementById('search-box');
  const results = block.querySelector('.search-results');
  searchBox.addEventListener('input', () => {
    displaySearchResults(searchBox.value, results);
  });
}
