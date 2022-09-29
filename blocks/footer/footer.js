import { decorateIcons, readBlockConfig } from '../../scripts/scripts.js';

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

  const partnerHeader = block.children[0].children[0];
  partnerHeader.classList.add('partner-header');
  const partnerContainer = block.children[0].children[1];
  partnerContainer.classList.add('partner-container');
  const navigation = block.children[0].children[2];
  // decorate footer navigation
  navigation.classList.add('footer-navigation');
  const elementCount = navigation.children.length;
  for (let i = 0; i < elementCount; i += 2) {
    const navigationItem = document.createElement('div');
    navigationItem.classList.add('footer-navigation-item');
    navigationItem.append(navigation.firstElementChild);
    navigationItem.append(navigation.firstElementChild);
    navigation.append(navigationItem);
  }
  const logoContainer = block.children[0].children[3];
  logoContainer.classList.add('logo-container');
  const mainNavigation = block.children[0].children[4];
  mainNavigation.classList.add('footer-main-navigation');
  const socialMediaContainer = block.children[0].children[5];
  socialMediaContainer.classList.add('socialmedia-container');
  const footerBottom = block.children[0].children[6];
  footerBottom.classList.add('footer-bottom');
  const footerLegal = document.createElement('div');
  footerLegal.classList.add('footer-legal');
  footerLegal.append(footerBottom.firstElementChild);
  footerLegal.append(footerBottom.firstElementChild);
  footerBottom.firstElementChild.classList.add('bottom-partners');
  footerBottom.insertBefore(footerLegal, footerBottom.firstElementChild);
}
