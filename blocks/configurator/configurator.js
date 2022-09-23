export default async function decorate(block) {
  block.firstElementChild.id = 'configurator';
  block.firstElementChild.setAttribute('data-component', 'comp_00007B4A');
  block.firstElementChild.setAttribute(
    'data-base-url',
    'https://fcbayern.com/shop',
  );
  block.firstElementChild.setAttribute('data-locale', 'de');
  block.firstElementChild.classList.add('configurator-container');

  block.firstElementChild.firstElementChild.remove();

  const configuratorScript = document.createElement('script');
  configuratorScript.type = 'module';
  configuratorScript.crossorigin = 'use-credentials';
  configuratorScript.src = '/blocks/configurator/shirt-configurator.js';

  block.append(configuratorScript);
}
