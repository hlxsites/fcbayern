import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

function toggleHidden(el) {
  el.toggleAttribute('hidden', !el.hasAttribute('hidden'));
}

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

function createThemeSel() {
  const themeSel = document.createElement('div');
  themeSel.className = 'theme-sel';
  themeSel.innerHTML = `<select>
      <option value="auto">Auto Dark Mode</option>
      <option value="fcb-light-theme" selected>Light Mode</option>
      <option value="fcb-dark-theme">Dark Mode</option
    ></select>
    <svg height="21" width="21" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M12 15L8 8H16L12 15Z"></path></svg>`;
  return themeSel;
}

function createLangSel() {
  const langSel = document.createElement('div');
  langSel.className = 'lang-sel';
  langSel.innerHTML = `
    <svg height="21" width="21" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M11.2929 14.7071L7.29289 10.7071L8.70711 9.29289L12 12.5858L15.2929 9.29289L16.7071 10.7071L12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071Z"></path></svg>
    <select>
      <option value="fcbayern.com-en-gb">English</option>
      <option value="fcbayern.com-es-es">Español</option>
      <option value="fcbayern.com-zh-cn">中文</option>
      <option selected="" value="fcbayern.com-de-de">Deutsch</option>
    </select>`;
  return langSel;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const header = document.querySelector('header');
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
    
    const types = ['brand', 'overview', 'sections'];
    const navMain = document.createElement('div');
    navMain.className = 'nav-main';
    
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
          
          navMain.appendChild(form);
        }
        else if (type === 'overview') {
          const userItem = section.querySelector('li:has(.icon-user)');
          const dialog = document.createElement('div');
          dialog.setAttribute('aria-modal', 'true');
          dialog.setAttribute('role', 'dialog');
          dialog.className = 'nav-user-dialog';
          dialog.appendChild(userItem.querySelector('.icon-user').cloneNode(true));
          dialog.appendChild(userItem.querySelector('.icon-user + ul').cloneNode(true));
          
          const themeSelItem = document.createElement('li');
          themeSelItem.appendChild(createThemeSel());
          dialog.querySelector('ul').appendChild(themeSelItem);
          
          section.appendChild(dialog);
  
          userItem.onclick = () => {
            const isOpen = !dialog.classList.contains('is-open');
            if (isOpen) {
              const pos = userItem.getBoundingClientRect();
              dialog.style.right = `${window.innerWidth - pos.left  - pos.width}px`;
            }
            dialog.classList.toggle('is-open', isOpen);
          };
          
          document.body.addEventListener('click', (e) => {
            if (!e.target.closest('li:has(.icon-user)') &&
              !e.target.closest('.nav-user-dialog') &&
              dialog.classList.contains('is-open')) {
              dialog.classList.remove('is-open');
            }
          });
        }
        else if (type === 'sections') {
          const sections = section.cloneNode(true);
  
          const secondaryList = document.createElement('ul');
          [...sections.querySelectorAll('li:has(.icon-fans), li:has(.icon-store), li:has(.icon-tickets)')]
            .slice(-3)
            .forEach(el => secondaryList.appendChild(el.cloneNode(true)));
          
          const form = navMain.querySelector('form').cloneNode(true);
          form.querySelector('button').onclick = (e) => {
            if (!form.querySelector('input').value.length) {
              e.preventDefault();
              form.classList.add('is-expanded');
              form.querySelector('input').focus();
            }
            form.querySelector('button[type="reset"]').hidden = false;
          };
          form.querySelector('button[type="reset"]').onclick = () => {
            form.classList.remove('is-expanded');
            form.querySelector('button[type="reset"]').hidden = true;
          };
          addToggleClear(form.querySelector('input'));
          
          sections.prepend(nav.querySelector('a:has(.icon-fcbayern)').cloneNode(true));
          sections.appendChild(form);
          sections.appendChild(secondaryList);
          
          navMain.appendChild(sections);
        }
      }
    });
    
    const navActions = document.createElement('div');
    navActions.className = 'nav-actions';
    
    // telekom
    const telekom = nav.querySelector('a:has(.icon-telekom)');
    navActions.append(telekom.cloneNode(true));

    // hamburger for mobile
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    const hamburgerIcon = document.createElement('span');
    hamburgerIcon.setAttribute('aria-label', 'toggle menu');
    hamburgerIcon.className = 'icon hamburger-icon';
    hamburgerIcon.innerHTML = '<svg height="24" width="24" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M20 8H4V6H20V8ZM20 13H4V11H20V13ZM4 18H20V16H4V18Z"></path></svg>';
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
    navMenuClose.innerHTML = '<svg height="26" width="26" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 13.0607L17.4697 18.5303L18.5303 17.4697L13.0607 12L18.5303 6.53033L17.4697 5.46967L12 10.9393L6.53033 5.46967L5.46967 6.53033L10.9393 12L5.46968 17.4697L6.53033 18.5303L12 13.0607Z"></path></svg>';
    
    const navMenuHeader = document.createElement('div');
    navMenuHeader.className = 'nav-menu-header';
    navMenuHeader.appendChild(nav.querySelector('a:has(.icon-fcbayern)').cloneNode(true));
    
    // Settings
    const navSettings = document.createElement('div');
    navSettings.className = 'nav-settings';
    navSettings.setAttribute('hidden', '');
    const navUser = nav.querySelector('li:has(.icon-user)').cloneNode(true);
    navSettings.appendChild(navUser.querySelector('ul'));
    const user = document.createElement('button');
    const form = navMain.querySelector('form').cloneNode(true);
    user.onclick = () => {
      toggleHidden(navSettings);
      toggleHidden(form);
    };
    user.appendChild(navUser.querySelector('.icon-user'));
    navMenuHeader.appendChild(user);
    
    const themeSel = createThemeSel();
    navSettings.appendChild(themeSel);
    
    navMenu.appendChild(decorateIcons(navMenuHeader));
    navMenu.appendChild(navSettings);
    navMenu.appendChild(decorateIcons(form));
    addToggleClear(navMenu.querySelector('input'));

    const navMenuList = nav.querySelector('.nav-sections ul');
    navMenuList.className = 'nav-menu-list';
    const navMenuListItems = nav.querySelectorAll('.nav-sections > ul > li');
    for (const navMenuItem of navMenuListItems) {
      const subItems = navMenuItem.querySelector('ul');
      if (subItems) {
        const link = navMenuItem.querySelector('a');
        const button = document.createElement('button');
        button.innerHTML = `<span>${link.textContent}</span><svg height="24" width="24" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M11.2929 14.7071L7.29289 10.7071L8.70711 9.29289L12 12.5858L15.2929 9.29289L16.7071 10.7071L12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071Z"></path></svg>`;
        button.onclick = () => {
          button.classList.toggle('is-open', !button.classList.contains('is-open'));
        };
        link.replaceWith(button);
        
        decorateIcons(subItems);
      }
    }
    nav.querySelector('.nav-sections').remove();
    
    // overview & online store & lang sel
    const overview = nav.querySelector('.nav-overview');
    const overviewClone = overview.cloneNode(true);
    const store = nav.querySelector('.nav-brand a:has(.icon-shop)');
    const storeClone = store.cloneNode(true);
  
    const langSel = createLangSel();
    const subOverview = document.createElement('div');
    subOverview.appendChild(telekom);
    subOverview.appendChild(store);
    overview.appendChild(subOverview);
    overview.querySelector('li:has(.icon-handicap)').prepend(langSel);
    
    navMenu.appendChild(navMenuList);
    navMenu.appendChild(storeClone);
    navMenu.appendChild(overviewClone);
    navMenu.appendChild(langSel.cloneNode(true));
    
    navMenuBackdrop.appendChild(navMenuClose);
    
    nav.appendChild(navActions);
    
    block.append(nav);
    block.append(navMenu);
    block.append(navMenuBackdrop);
    
    header.append(navMain);
  
    decorateIcons(overviewClone);
    decorateIcons(storeClone);
    decorateIcons(nav);
    decorateIcons(navMain);
  
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-sticky', window.scrollY > 96)
    });
  }
}
