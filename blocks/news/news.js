import {
  lookupPages,
  createOptimizedPicture,
  getLanguage,
} from '../../scripts/scripts.js';

export function createNewsCard(newsItem, classPrefix, large = false) {
  const card = document.createElement('a');
  card.classList.add(`${classPrefix}-card`);
  if (large) {
    card.classList.add(`large`);
  }
  card.href = newsItem.path;

  const pictureString = createOptimizedPicture(
    newsItem.image,
    newsItem.imageAlt,
    false,
    [{ width: 750 }],
  ).outerHTML;

  card.innerHTML = `
    <div class="${classPrefix}-card-picture">${pictureString}</div>
    <div class="${classPrefix}-card-info">
      <div class="${classPrefix}-card-subtitle"><span>${newsItem.subtitle}</span></div>
      <h3 class="${classPrefix}-card-title">${newsItem.title}</h3>
    </div>`;
  return card;
}

function isCardOnPage(article) {
  const path = article.path.split('.')[0];
  if (path === window.location.pathname) return true;
  /* using recommended and featured articles */
  return !!document.querySelector(`a[href="${path}"]`);
}

export async function filterNewsItems(config, feed, limit) {
  const result = [];

  /* filter posts by category, tag and author */
  const filters = {};
  Object.keys(config).forEach((key) => {
    const filterNames = ['tags', 'author', 'category'];
    if (filterNames.includes(key)) {
      const vals = config[key];
      if (vals) {
        let v = vals;
        if (!Array.isArray(vals)) {
          v = [vals];
        }
        filters[key] = v.map((e) => e.toLowerCase().trim());
      }
    }
  });

  const newsBucket = 'news-' + getLanguage();
  await lookupPages([], newsBucket);
  const index = window.pageIndex[newsBucket];

  while (feed.data.length < limit && !feed.complete) {
    // eslint-disable-next-line no-await-in-loop
    const indexChunk = index.data.slice(feed.cursor);

    /* filter and ignore if already in result */
    const feedChunk = indexChunk.filter((article) => {
      const matchedAll = Object.keys(filters).every((key) => {
        const matchedFilter = filters[key].some(
          (val) => article[key] && article[key].toLowerCase().includes(val),
        );
        return matchedFilter;
      });
      return matchedAll && !result.includes(article) && !isCardOnPage(article);
    });
    feed.cursor = index.data.length;
    feed.complete = true;
    feed.data = [...feed.data, ...feedChunk];
  }
}

async function decorateNewsFeed(
  articleFeedEl,
  config,
  feed = { data: [], complete: false, cursor: 0 },
) {
  let articleCards = articleFeedEl.querySelector('.news-feed-cards');
  if (!articleCards) {
    articleCards = document.createElement('div');
    articleCards.className = 'news-feed-cards';
    articleFeedEl.appendChild(articleCards);
  }

  const limit = 8;
  const largeCards = 2;

  await filterNewsItems(config, feed, limit);
  const articles = feed.data;
  const cards = [];
  for (let i = 0; i < limit; i += 1) {
    const article = articles[i];
    cards.push(
      createNewsCard(article, 'news-teaser', i < largeCards).outerHTML,
    );
  }

  const cardGrid = document.createElement('div');
  cardGrid.className = 'news-feed-card-grid';
  cards.forEach((card) => {
    cardGrid.innerHTML += card;
  });
  articleFeedEl.append(cardGrid);
}

export default async function decorate(block) {
  //const config = readBlockConfig(block);
  const config = {};
  block.innerHTML = '';
  await decorateNewsFeed(block, config);
}

// export default async function decorate(block) {
//     const newsBucket = 'news-' + getLanguage();
//     await lookupPages([], newsBucket);
//     const news = window.pageIndex[newsBucket];
//     block.textContent = '';

//     if (news && Array.isArray(news.data)) {
//         const newsList = document.createElement('ul');
//         news.data.slice(0,8).forEach((e) => {
//           const newsItem = document.createElement('li');
//           const newsCard = createNewsCard(e, 'news');
//           newsItem.innerHTML = newsCard.outerHTML;
//           newsList.append(newsItem);
//         });
//         block.append(newsList);
//     }
// }
