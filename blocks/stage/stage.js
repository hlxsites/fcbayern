import {
  lookupPages,
  getLanguage,
  createOptimizedPicture,
} from '../../scripts/scripts.js';

function createStageCard(newsItem, classPrefix, large = false) {
  const card = document.createElement('a');
  card.href = newsItem.path;

  const cardContent = document.createElement('div');
  cardContent.classList.add(`${classPrefix}-card`);
  if (large) {
    cardContent.classList.add(`large`);
  }

  const pictureString = createOptimizedPicture(
    newsItem.image,
    newsItem.imageAlt,
    false,
    [
      { media: '(max-width: 679px)', width: '849' },
      { media: '(min-width: 680px) and (max-width: 763px)', width: '945' },
      { media: '(min-width: 764px) and (max-width: 1015px)', width: '1269' },
      { media: '(min-width: 1016px)', width: '1600' },
    ],
  ).outerHTML;

  cardContent.innerHTML = `
    <div class="${classPrefix}-card-picture"><div>${pictureString}</div></div>
    <div class="${classPrefix}-card-info">
      <div class="${classPrefix}-card-subtitle"><span>${newsItem.subtitle}</span></div>
      <h3 class="${classPrefix}-card-title">${newsItem.title}</h3>
    </div>`;
  card.append(cardContent);
  return card;
}

export default async function decorate(block) {
  const newsBucket = 'news-' + getLanguage();
  const rows = [...block.children];
  const contents = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const [content] = [...row.children].map((e, j) => (j ? e.textContent : e));
    if (content.textContent.includes('://')) {
      // handle straight link
      const { pathname } = new URL(content.querySelector('a').href);
      // eslint-disable-next-line no-await-in-loop
      const news = await lookupPages([pathname], newsBucket);
      if (news.length) {
        const [newsItem] = news;
        const card = createStageCard(newsItem, 'stage-news', true);
        card.classList.add('card-' + (i + 1));
        contents.push(card.outerHTML);
      }
    } else {
      contents.push(`<div class="stage-news-card">${content.outerHTML}</div>`);
    }
  }

  // pad array with empty strings
  for (let i = contents.length; i < 3; i += 1) {
    contents[i] = '';
  }

  const html = `
    <div aria-label="Neueste Nachrichten" role="region" aria-roledescription="carousel" class="stage-news">
    ${contents[0]}
    ${contents[1]}
    ${contents[2]}
    </div>
    `;
  block.innerHTML = html;

  /* special mouse over behaviour */
  const cards = block.querySelectorAll('a');
  cards.forEach((card) => {
    card.addEventListener('mouseover', (event) => {
      block.querySelectorAll('a').forEach((c) => c.classList.remove('active'));
      let currentTarget = event.currentTarget;
      currentTarget.classList.add('active');
      while (currentTarget.previousElementSibling) {
        currentTarget = currentTarget.previousElementSibling;
        currentTarget.classList.add('active');
      }
    });
  });
}
