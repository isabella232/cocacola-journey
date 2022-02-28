import { getMetadataJson, createOptimizedPicture, lookupPages } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const pages = await lookupPages(pathnames);
  block.textContent = '';
  pages.forEach((meta, i) => {
    const brandLink = meta.path;
    const picture = createOptimizedPicture(meta.image);
    const card = document.createElement('a');
    card.className = 'brands-card';
    card.href = brandLink;
    card.innerHTML = `${picture.outerHTML}
    <div class="brands-card-body">
      <h3>${meta.title}</h3>
      <p>${meta.description}</p>
    </div>`;
    block.append(card);
  });
}
