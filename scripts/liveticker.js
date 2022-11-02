import { getMetadata, createOptimizedPicture, decorateIcons } from './scripts.js';

const icons = {};

const getIcon = async (name) => {
  if (!icons[name]) {
    const resp = await fetch(`${window.hlx.codeBasePath}/icons/${name}.svg`);
    if (resp.ok) {
      const iconHTML = await resp.text();
      if (iconHTML.match(/<style/i)) {
        const img = document.createElement('img');
        img.src = `data:image/svg+xml,${encodeURIComponent(iconHTML)}`;
        icons[name] = img;
      } else {
        const span = document.createElement('span');
        span.innerHTML = iconHTML;
        icons[name] = span;
      }
    }
  }
  return icons[name];
};

const decorateLiveTickerEntries = async () => {
  document.querySelectorAll('.liveticker main .section p, .liveticker main .section h2, .liveticker main .section h3').forEach(async (el) => {
    const container = document.createElement('div');
    const left = document.createElement('div');
    left.classList.add('left');
    const right = document.createElement('div');
    right.classList.add('right');
    container.append(left);
    container.append(right);

    let text = el.innerHTML;
    const test = /^\d?\d\+?\d?'/.exec(text);
    if (test && test.length > 0) {
      const time = test[0];
      const div = document.createElement('div');
      div.classList.add('time');
      div.textContent = time;
      left.append(div);
      text = text.replace(time, '').trim();
    }

    const hasYellow = text.startsWith('yellow');
    const hasRed = text.startsWith('red');
    if (hasYellow || hasRed) {
      const color = hasRed ? 'red' : 'yellow';
      const icon = await getIcon(`${color}-card`);
      icon.classList.add(color);
      left.prepend(icon);
      text = text.replace(color, '').trim();
    }

    el.innerHTML = text;
    el.before(container);
    right.append(el);
  });
};

async function addLiveTickerHeader(main) {
  // get metadata
  const image = getMetadata('og:image');
  const desc = getMetadata('og:description');
  const date = getMetadata('datum');
  const time = getMetadata('zeit');
  const matchday = getMetadata('matchtag');
  const location = getMetadata('stadion');
  const visitors = getMetadata('zuschauer');
  const home = getMetadata('heimmannschaft');
  const homeLogo = getMetadata('heimmannschaft-logo');
  const guest = getMetadata('gast');
  const guestLogo = getMetadata('gast-logo');

  // create DOM skeleton
  const dom = document.createRange().createContextualFragment(`
    <div class='liveticker-header'>
      
      <div class='image'>
      </div>

      <input name='tabs' type='radio' id='goals' checked='checked'>
      <input name='tabs' type='radio' id='cards' >
      <input name='tabs' type='radio' id='changes' >
      <input name='tabs' type='radio' id='gameinfo' >

      <div class='matchinfo'>
        <div class='date-and-matchday'>
          <div class='left'>${date}, ${time}</div>
          <div>·</div>
          <div class='right'>${matchday}</div>
        </div>
        
        <div class='details'>
          <div class='goals-info home'>
            <ol>
              <li><span class='icon icon-ball'></span><b>51'</b> Hernández</li>
              <li><span class='icon icon-ball'></span><b>54'</b> Sané</li>
            </ol>
          </div>
          <div class='cards-info home'>
            <ol>
              <li><b>19'</b> Marcel Sabitzer</li>
              <li><b>74'</b> Joshua Kimmich</li>
            </ol>
          </div>
          <div class='changes-info home'>
            <ol>
              <li><span class='icon icon-changes'></span><b>21'</b><span class='desc'>Noussair Mazraoui für Benjamin Pavard</span></li>
              <li><span class='icon icon-changes'></span><b>46'</b><span class='desc'>Leon Goretzka für Marcel Sabitzer</span></li>
              <li><span class='icon icon-changes'></span><b>69'</b><span class='desc'>Serge Gnabry für Sadio Mané</span></li>
              <li><span class='icon icon-changes'></span><b>80'</b><span class='desc'>Ryan Gravenberch für Sané</span></li>
              <li><span class='icon icon-changes'></span><b>80'</b><span class='desc'>Mathys Tel für Jamal Musiala</span></li>
            </ol>         
          </div>

          <div class='score-info'>
            <div class='home-name'>${home}</div>
            <div class='score'>
              <div class='home-logo'></div>
              <div class='goals'>2 : 0</div>
              <div class='guest-logo'></div>
            </div>
            <div class='guest-name'>${guest}</div>
            <div class='halftime'>(0:0)</div>
          </div>

          <div class='goals-info guest'></div>
          <div class='cards-info guest'>
            <ol>
              <li>Sergio Busquets <b>48'</b></li>
            </ol>
          </div>
          <div class='changes-info guest'>
            <ol>
              <li><span class='desc'>Ferran Torres für Raphinha</span><b>61'</b><span class='icon icon-changes'></span></li>
              <li><span class='desc'>Frenkie de Jong für Gavi</span><b>70'</b><span class='icon icon-changes'></span></li>
              <li><span class='desc'>Eric García für Andreas Christensen</span><b>80'</b><span class='icon icon-changes'></span></li>
              <li><span class='desc'>Ansu Fati für Ousmane Dembélé</span><b>80'</b><span class='icon icon-changes'></span></li>
              <li><span class='desc'>Franck Kessie für Sergio Busquets</span><b>80'</b><span class='icon icon-changes'></span></li>
            </ol>
          </div>
        </div>
      </div>

      <div class='location-visitors'>
        <div class='title'>Stadion/Zuschauerzahl</div>
        <div>${location}</div>
        <div>${visitors} Zuschauer</div>
      </div>

      <div class='tabs'>
        <nav role='tablist'>
          <label class='goals' for='goals'>2 Tore</label>
          <label class='cards' for='cards'>3 Karten</label>
          <label class='changes' for='changes'>10 Auswechslungen</label>
          <label class='gameinfo' for='gameinfo'>Spieleinfos</label>
        </nav>
      </div>
    </div>

    <div class='nav-bar'>
      <button><span>Spielbericht</span></button>
      <button><span>Galerie</span></button>
      <button><span>Tabelle</span></button>
      <button><span>FC Bayern.TV</span></button>
      <button><span>Spieltag</span></button>
      <button><span>Aufstellung</span></button>
      <button class='active'><span>Liveticker</span></button>
      <button><span>Vorbericht</span></button>
      <button><span>Statistiken</span></button>
      <button><span>News</span></button>
    </div>
  `);

  const headerimage = createOptimizedPicture(image, desc, true, [
    { media: '(max-width: 763px)', width: '320' },
    { media: '(min-width: 764px) and (max-width: 1015px)', width: '640' },
    { media: '(min-width: 1016px)', width: '1600' },
  ]);
  const homelogo = createOptimizedPicture(homeLogo, home, false);
  const guestlogo = createOptimizedPicture(guestLogo, guest, false);

  // add the image to the liveticker header from metadata
  dom.querySelector('.image').append(headerimage);
  // add the 2 logos
  dom.querySelector('.home-logo').append(homelogo);
  dom.querySelector('.guest-logo').append(guestlogo);

  await decorateIcons(dom);
  main.prepend(dom);
}

async function addTitleAndFilter(main) {
  const desc = getMetadata('og:description');

  // get the first section
  const section = main.children[0];
  const header = document.createRange().createContextualFragment(`
    <div class='liveticker-filter' >
      <h2>${desc}</h2>
      <div>
        <button class='active'><span>Alle Ergebnisse</span></button>
        <button><span>2 Tore</span></button>
        <button><span>3 Karten</span></button>
        <button><span>10 Wechsel</span></button>
      </div>
    </div>
  `);
  section.prepend(header);
}

export default function decorate(main) {
  addLiveTickerHeader(main);
  decorateLiveTickerEntries();
  addTitleAndFilter(main);
}
