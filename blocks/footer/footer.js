import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  await decorateIcons(footer);
  block.append(footer);

  const partnerContainer = block.children[0].children[1];
  partnerContainer.classList.add('partner-container');
  const logoContainer = block.children[0].children[3];
  logoContainer.classList.add('logo-container');
  const socialMediaContainer = block.children[0].children[5];
  socialMediaContainer.classList.add('socialmedia-container');  
}
