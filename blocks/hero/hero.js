import { decorateIcons, getMetadata } from '../../scripts/scripts.js';

export default function decorate(block){
  /* special treatment for block on news pages */
  if(document.body.classList.contains('newstemplate')){
    // extract h1 and picture
    const h1 = block.querySelector('h1');
    const picture = block.querySelector('picture');
    block.textContent = '';

    const dom = document.createRange().createContextualFragment(`
    <div class='news-image'>
    </div>
    <div class='news-header'>
      <div class='metadata'>
        <div class='subtitle'>${getMetadata('subtitle')}</div>
        <div class='date'>${getMetadata('date') }</div>
      </div>
      <h2 class='title'>${h1.innerText}</h2>
      <div class='a11y'>
        <div class='read'>
          <span class='read-descr'>Text vorlesen</span>
          <span class='icon icon-speaker'></span>
        </div>
        <div class='resize'>
          <span class='resize-descr'>Schrift vergössern</span>
          <span class='icon icon-text-resize'></span>
        </div>
      </div>
    </div>
    `)
    dom.children[0].append(picture);
    block.append(dom);
    decorateIcons(block);
  }
}

