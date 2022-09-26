import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

function addToggleClear(input) {
  input.oninput = () => {
    input.nextElementSibling.toggleAttribute('hidden', input.value.length === 0)
  };
}

function toggleNav(nav) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = expanded ? '' : 'hidden';
  nav.setAttribute('aria-expanded', !expanded);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.setAttribute('aria-expanded', 'false');
    nav.innerHTML = html;
    
    const types = ['brand', 'settings', 'sections'];
    const header = document.querySelector('header');
    const quickLinks = document.createElement('div');
    quickLinks.className = 'quickLinks';
    
    types.forEach((type, i) => {
      const section = nav.children[i];
      if (section) {
        section.classList.add(`nav-${type}`);
        
        if (type === 'brand') {
          const brandLink = section.querySelector('a:has(.icon-fcbayern)');
          
          const brandTextNode = [...brandLink.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
          const brandText = document.createElement('div');
          if (brandTextNode) {
            brandTextNode.textContent.split(' ').forEach((w) => {
              const span = document.createElement('span');
              span.textContent = w;
              brandText.appendChild(span);
            });
            brandTextNode.textContent = '';
            brandLink.appendChild(brandText);
          }
          
          const searchLink = section.querySelector('a:has(.icon-search)');
          searchLink.remove();
          
          const form = document.createElement('form');
          form.action = searchLink.href;
          
          const searchButton = document.createElement('button');
          const clearButton = searchButton.cloneNode();
          clearButton.type = 'reset';
          clearButton.hidden = true;
          
          const searchIcon = searchLink.querySelector('.icon')
          const clearIcon = document.createElement('span');
          clearIcon.className = 'icon icon-close';
          
          const input = document.createElement('input');
          input.name = 'query';
          input.type = 'search';
          input.autocomplete = 'off';
          addToggleClear(input);
          
          searchButton.appendChild(searchIcon);
          clearButton.appendChild(clearIcon);
          
          form.appendChild(searchButton);
          form.appendChild(input);
          form.appendChild(clearButton);
          
          quickLinks.appendChild(form);
        }
        else if (type === 'sections') {
          const sections = section.cloneNode(true);
  
          const list = document.createElement('ul');
          [...sections.querySelectorAll('li:has(.icon-fans), li:has(.icon-store), li:has(.icon-tickets)')]
            .slice(-3)
            .forEach(el => list.appendChild(el));
          
          sections.appendChild(list);
          
          quickLinks.appendChild(sections);
        }
      }
    });
    
    const navActions = document.createElement('div');
    navActions.className = 'nav-actions';
    
    // telekom
    const telekom = nav.querySelector('a:has(.icon-telekom)');
    const telekomTextNode = [...telekom.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (telekomTextNode) {
      const span = document.createElement('span');
      span.appendChild(telekomTextNode);
      telekom.appendChild(span);
    }
    navActions.append(telekom);

    // hamburger for mobile
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    const hamburgerIcon = document.createElement('span');
    hamburgerIcon.setAttribute('aria-label', 'toggle menu');
    hamburgerIcon.className = 'icon hamburger-icon';
    hamburgerIcon.innerHTML = '<svg height="24" width="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" class="base-icon__StyledIconSvg-sc-fzrbhv-0 iZmRxR"><title>icon</title><path d="M20 8H4V6H20V8ZM20 13H4V11H20V13ZM4 18H20V16H4V18Z"></path></svg>';
    hamburger.appendChild(hamburgerIcon);
    hamburger.addEventListener('click', () => {
      toggleNav(nav);
    });
    navActions.append(hamburger);
    
    // menu for mobile
    const navMenu = document.createElement('div');
    navMenu.className = 'nav-menu';
    
    const navMenuBackdrop = document.createElement('div');
    navMenuBackdrop.className = 'nav-menu-backdrop';
    navMenuBackdrop.onclick = () => {
      toggleNav(nav);
    };
    
    const navMenuClose = document.createElement('button');
    navMenuClose.className = 'nav-menu-close';
    navMenuClose.setAttribute('aria-label', 'close menu');
    navMenuClose.innerHTML = '<svg height="26" width="26" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" class="base-icon__StyledIconSvg-sc-fzrbhv-0 iZmRxR"><title>icon</title><path fill-rule="evenodd" clip-rule="evenodd" d="M12 13.0607L17.4697 18.5303L18.5303 17.4697L13.0607 12L18.5303 6.53033L17.4697 5.46967L12 10.9393L6.53033 5.46967L5.46967 6.53033L10.9393 12L5.46968 17.4697L6.53033 18.5303L12 13.0607Z"></path></svg>';
    
    const navMenuHeader = document.createElement('div');
    navMenuHeader.className = 'nav-menu-header';
    navMenuHeader.appendChild(nav.querySelector('a:has(.icon-fcbayern)').cloneNode(true));
    navMenuHeader.appendChild(nav.querySelector('.icon-user'));
    
    navMenu.appendChild(decorateIcons(navMenuHeader));
    navMenu.appendChild(decorateIcons(quickLinks.querySelector('form').cloneNode(true)));
    addToggleClear(navMenu.querySelector('input[type="search"]'));
  
    const navMenuList = nav.querySelector('.nav-sections ul');
    navMenuList.className = 'nav-menu-list';
    const navMenuListItems = nav.querySelectorAll('.nav-sections > ul > li');
    for (const navMenuItem of navMenuListItems) {
      const subItems = navMenuItem.querySelector('ul');
      if (subItems) {
        const link = navMenuItem.querySelector('a');
        const button = document.createElement('button');
        button.innerHTML = `<span>${link.textContent}</span><svg height="24" width="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" class="base-icon__StyledIconSvg-sc-fzrbhv-0 iZmRxR"><title>icon</title><path d="M11.2929 14.7071L7.29289 10.7071L8.70711 9.29289L12 12.5858L15.2929 9.29289L16.7071 10.7071L12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071Z"></path></svg>`;
        button.onclick = () => {
          button.classList.toggle('is-open', !button.classList.contains('is-open'));
        };
        link.replaceWith(button);
        
        decorateIcons(subItems);
      }
    }
    
    // setting & online store & lang sel
    const store = nav.querySelector('.nav-brand a:has(.icon-shop)');
    const settings = nav.querySelector('.nav-settings');
    const langSel = document.createElement('div');
    langSel.className = 'lang-sel';
    langSel.innerHTML = `
    <svg height="21" width="21" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" class="base-icon__StyledIconSvg-sc-fzrbhv-0 iZmRxR"><title>icon</title><path d="M11.2929 14.7071L7.29289 10.7071L8.70711 9.29289L12 12.5858L15.2929 9.29289L16.7071 10.7071L12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071Z"></path></svg>
    <select>
      <option value="fcbayern.com-en-gb">English</option>
      <option value="fcbayern.com-es-es">Español</option>
      <option value="fcbayern.com-zh-cn">中文</option>
      <option selected="" value="fcbayern.com-de-de">Deutsch</option>
    </select>`;
    
    navMenu.appendChild(navMenuList);
    navMenu.appendChild(store);
    navMenu.appendChild(settings);
    navMenu.appendChild(langSel);
    
    navMenuBackdrop.appendChild(navMenuClose);
    
    nav.appendChild(navActions);
    
    block.append(nav);
    block.append(navMenu);
    block.append(navMenuBackdrop);
    
    header.append(quickLinks);
  
    decorateIcons(settings);
    decorateIcons(store);
    decorateIcons(nav);
    decorateIcons(quickLinks);
  }
}
