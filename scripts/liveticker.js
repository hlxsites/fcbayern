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

const decorate = async () => {
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

decorate();
