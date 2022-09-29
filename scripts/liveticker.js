const decorate = () => {
  document.querySelectorAll('.liveticker main .section p, .liveticker main .section h2').forEach((el) => {
    const container = document.createElement('div');
    let text = el.innerHTML;
    const test = /^\d?\d\+?\d?'/.exec(text);
    if (test && test.length > 0) {
      const time = test[0];
      const span = document.createElement('span');
      span.classList.add('time');
      span.textContent = time;
      container.append(span);
      text = text.replace(time, '').trim();
    }

    if (text.startsWith('yellow')) {
      const span = document.createElement('span');
      span.classList.add('yellow');
      container.append(span);
      text = text.replace('yellow', '').trim();
    }

    if (text.startsWith('red')) {
      const span = document.createElement('span');
      span.classList.add('red');
      container.append(span);
      text = text.replace('red', '').trim();
    }

    el.innerHTML = text;
    el.before(container);
    container.append(el);
  });
};

decorate();
