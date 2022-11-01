import { getMetadata,createOptimizedPicture,decorateIcons } from "./scripts.js";

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
  const image = getMetadata("og:image");
  const imageAlt = getMetadata("og:description");
  const date = getMetadata("datum");
  const time = getMetadata("zeit");
  const matchday = getMetadata("matchtag");
  const location = getMetadata("stadion");
  const visitors = getMetadata("zuschauer");
  const home = getMetadata("heimmannschaft");
  const home_logo = getMetadata("heimmannschaft-logo");
  const guest = getMetadata("gast");
  const guest_logo = getMetadata("gast-logo");

  // create DOM skeleton
  const dom = document.createRange().createContextualFragment(`
    <div class='liveticker-header'>
      
      <div class='image'>
      </div>

      <div class='matchinfo'>
        <div class='date-and-matchday'>
          <div class='left'>${date}, ${time}</div>
          <div>·</div>
          <div class='right'>${matchday}</div>
        </div>
        
        <div class='details'>
          <div class='goals home'>
          <span class='icon icon-ball'></span>Hernández
          </div>
          <div class='cards home'>
          cards home
          </div>
          <div class='changes home'>
          <span class='icon icon-changes'></span>Noussair Mazraoui für Benjamin Pava
          </div>
          <div class='score-info'>
            <div class='home-name'>${home}</div>
            <div class='score'>
              <div class='home-logo'></div>
              <div class='goals'>2:0</div>
              <div class='guest-logo'></div>
            </div>
            <div class='guest-name'>${guest}</div>
          </div>
          <div class='goals guest'>
          keine goals
          </div>
          <div class='cards guest'>
          keine cards
          </div>
          <div class='changes guest'>
          keine changes
          </div>
        </div>

      </div>

      <div class='location-visitors'>
        <div>Stadion/Zuschauerzahl</div>
        <div>${location}</div>
        <div>${visitors}</div>
      </div>

      <div class='tabs'>
        <nav role='tablist'>
          <div role='tab'>Tore</div>
          <div role='tab'>Karten</div>
          <div role='tab'>Auswechslungen</div>
          <div role='tab'>Spieleinfos</div>
        </nav>
      </div>
    </div>
  `)

  const headerimage = createOptimizedPicture(image, imageAlt, false, [
    { media: '(max-width: 763px)', width: '320' },
    { media: '(min-width: 764px) and (max-width: 1015px)', width: '640' },
    { media: '(min-width: 1016px)', width: '1600' },
  ]);
  const homelogo = createOptimizedPicture(home_logo, home, false);
  const guestlogo = createOptimizedPicture(guest_logo, guest, false);

  // add the image to the liveticker header from metadata
  dom.querySelector('.image').append(headerimage);
  // add the 2 logos
  dom.querySelector('.home-logo').append(homelogo);
  dom.querySelector('.guest-logo').append(guestlogo);

  await decorateIcons(dom);
  main.prepend(dom);
}

export default function decorate(main) {
  addLiveTickerHeader(main);
  decorateLiveTickerEntries();
}

