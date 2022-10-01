import { decorateIcons, getMetadata } from "../../scripts/scripts.js";

export default function decorate(block) {
  block.textContent = '';
  
  // create the dom
  const dom  = document.createRange().createContextualFragment(`
    <hr class='newspage-pagebreak'>
    <div class='newspage-footer'>
      <div class='tagsinfo'> 
        <p>Themen dieses Artikels</p>    
      </div>
      <div class='social-bar'>
      <p>Diesen Artikel teilen</p>  
        <div class='social-bar-grid'>        
          <ul>
            <li>
              <a href="https://www.facebook.com/FCBayern/">
                <span class="icon icon-facebook"></span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/fcbayern/?hl=de">
                <span class="icon icon-instagram"></span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/fcbayern">
                <span class="icon icon-youtube"></span>
              </a>
            </li>
            <li>
              <a href="https://www.snapchat.com/add/fcbayernsnaps">
              <span class="icon icon-snapchat"></span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/fcbayern">
                <span class="icon icon-twitter"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class='newspage-morenews'>
    </div>
    <div class='newspage-also'>
    </div>
  `)

  // append the list of tags
  const tags = getMetadata('article:tag');
  const taglist = document.createElement('div');
  taglist.classList = 'tags';

  tags.split(',').forEach((element) => {
    let a = document.createElement('a');
    a.setAttribute('href','');
    let tag = document.createElement('span');
    tag.innerHTML = element;
    a.append(tag);
    taglist.append(a);
  });
  dom.querySelector('.tagsinfo').append(taglist);

  // add the final dom to the page
  block.append(dom);

  // decorate the icons
  decorateIcons(block);
}