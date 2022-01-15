import { decoratePictures } from '../../scripts/scripts.js';

function centerSelected(carousel) {
  const products = [...carousel.children];
  const index = products.findIndex((e) => e.classList.contains('selected'));
  const targetIndex = Math.floor((products.length - 1) / 2);
  let delta = targetIndex - index;
  while (delta) {
    if (delta > 0) {
      carousel.prepend(carousel.lastChild);
      delta -= 1;
    } else {
      carousel.append(carousel.firstChild);
      delta += 1;
    }
  }
  products.forEach((product) => {
    product.classList.remove('hidden');
  });
  if (products.length % 2 === 0) {
    carousel.lastChild.classList.add('hidden');
  }
}

function showHidePanels(block, spans) {
  spans.forEach((span) => {
    const panel = block.querySelector(`.${span.dataset.target}`);
    if (span.classList.contains('selected')) panel.classList.remove('hidden');
    else panel.classList.add('hidden');
  });
}

function selectProduct(block, id, products) {
  const carousel = block.querySelector('.products-carousel');
  block.querySelectorAll('.products-carousel-product').forEach((a) => a.classList.remove('selected'));
  document.getElementById(id).classList.add('selected');
  centerSelected(carousel);
  const productInfo = block.querySelector('.products-info');
  const selectedPath = carousel.querySelector('.selected').dataset.path;
  const selectedProduct = products.querySelector(`[data-path="${selectedPath}"]`);
  const title = selectedProduct.querySelector('h1').textContent;
  const ps = selectedProduct.querySelectorAll(':scope > div > p');
  let description = '';
  ps.forEach((p) => {
    if (p.textContent) description = p.textContent;
  });
  productInfo.innerHTML = `<div class="products-description"><h2>${title}</h2><p>${description}</p></div>
  <div class="products-details"><div class="products-details-switcher"><span data-target="nutrition-facts" class="selected">Nutrition</span><span data-target="ingredients">Ingredients</span></div></div>`;
  const productDetails = productInfo.querySelector('.products-details');
  productDetails.append(selectedProduct.querySelector('.nutrition-facts').cloneNode(true));
  productDetails.append(selectedProduct.querySelector('.ingredients').cloneNode(true));
  const spans = productInfo.querySelectorAll('.products-details-switcher span');
  spans.forEach((span) => {
    span.addEventListener('click', () => {
      spans.forEach((sp) => sp.classList.remove('selected'));
      span.classList.add('selected');
      showHidePanels(block, spans);
    });
  });
  showHidePanels(block, spans);
}

export default async function decorate(block) {
  const as = [...block.querySelectorAll('a')];
  const products = document.createElement('main');
  block.textContent = '';
  for (let i = 0; i < as.length; i += 1) {
    const a = as[i];
    const productLink = a.href;
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${productLink}.plain.html`);
    // eslint-disable-next-line no-await-in-loop
    const html = await resp.text();
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = html;
    div.dataset.path = productLink;
    decoratePictures(div);
    products.append(div);
  }

  const carousel = document.createElement('div');
  carousel.className = 'products-carousel';
  products.querySelectorAll('picture').forEach((picture) => {
    const { path } = picture.closest('.product').dataset;
    const newPicture = picture.cloneNode(true);
    const a = document.createElement('a');
    a.id = path.split('/').pop();
    a.href = `#${a.id}`;
    a.className = 'products-carousel-product';
    a.dataset.path = path;
    a.append(newPicture);
    carousel.append(a);
  });

  block.append(carousel);

  window.addEventListener('hashchange', () => {
    selectProduct(block, window.location.hash.substring(1), products);
  });

  const productInfo = document.createElement('div');
  productInfo.className = 'products-info';
  block.append(productInfo);
  selectProduct(block, block.querySelector('.products-carousel-product').id, products);
}
