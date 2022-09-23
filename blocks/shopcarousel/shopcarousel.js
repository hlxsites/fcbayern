import { getLanguage } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.firstElementChild.id = 'shop-carousel';
  block.firstElementChild.setAttribute('data-component', 'comp_00007B4A');
  block.firstElementChild.setAttribute(
    'data-url',
    'https://fcbayern.com/shop/api/component/carousel/DE/Teamline',
  );
  block.firstElementChild.setAttribute('data-locale', getLanguage());
  block.firstElementChild.setAttribute('data-product-number', '4');
  block.firstElementChild.setAttribute('data-new-window', 'true');
  block.firstElementChild.setAttribute('data-zoom-effect', 'true');
  block.firstElementChild.setAttribute('data-show-headline', 'false');

  block.firstElementChild.classList.add('shop-carousel-container');
  block.firstElementChild.classList.add('fcbShopProductCarousel');

  block.firstElementChild.firstElementChild.remove();

  const configuratorScript = document.createElement('script');
  configuratorScript.type = 'module';
  configuratorScript.crossorigin = 'use-credentials';
  configuratorScript.src = '/blocks/shopcarousel/fcbProductCarousel.js';

  block.append(configuratorScript);
}
