import { lookupPages, getLanguage } from '../../scripts/scripts.js';

import { createNewsCard } from '../news/news.js';

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
        const card = createNewsCard(newsItem, 'stage-news', true);
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
      block
        .querySelectorAll('a')
        .forEach((c) => c.classList.remove('active'));
      let currentTarget = event.currentTarget;
      currentTarget.classList.add('active');
      while (currentTarget.previousElementSibling) {
        currentTarget = currentTarget.previousElementSibling;
        currentTarget.classList.add('active');
      }
    });
  });
}
