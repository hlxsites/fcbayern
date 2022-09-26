import {
  lookupPages,
  readBlockConfig,
  createOptimizedPicture,
  getLanguage,
} from '../../scripts/scripts.js';

export function createNewsCard(newsItem, classPrefix, large = false) {
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
    [{ width: 750 }],
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

function isCardOnPage(article) {
  const path = article.path.split('.')[0];
  if (path === window.location.pathname) return true;
  /* using recommended and featured articles */
  return !!document.querySelector(`a[href="${path}"]`);
}

export async function filterNewsItems(config, feed, limit) {
  const result = [];

  const filters = {};
  Object.keys(config).forEach((key) => {
    const filterNames = ['tags'];
    if (filterNames.includes(key)) {
      const vals = config[key];
      if (vals) {
        if (Array.isArray(vals)) {
          filters[key] = vals;
        } else {
          filters[key] = vals.split(',').map((e) => e.toLowerCase().trim());
        }
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
    const feedChunk = indexChunk.filter((newsItem) => {
      const matchedAll = Object.keys(filters).every((key) => {
        const matchedFilter = filters[key].some(
          (val) => newsItem[key] && newsItem[key].toLowerCase().includes(val),
        );
        return matchedFilter;
      });
      return (
        matchedAll && !result.includes(newsItem) && !isCardOnPage(newsItem)
      );
    });
    feed.cursor = index.data.length;
    feed.complete = true;
    feed.data = [...feed.data, ...feedChunk];
  }
}

async function decorateNewsFeed(
  block,
  config,
  feed = { data: [], complete: false, cursor: 0 },
) {
  let limit = 8;
  let largeCards = 0;

  if (config.layout) {
    largeCards = config.layout === 'news' ? 3 : 2;
  }

  await filterNewsItems(config, feed, limit);
  const newsItems = feed.data;
  if (feed.data.length < limit) {
    limit = feed.data.length;
  }
  const cards = [];
  for (let i = 0; i < limit; i += 1) {
    const newsItem = newsItems[i];
    cards.push(
      createNewsCard(newsItem, 'news-teaser', i < largeCards).outerHTML,
    );
  }

  let cardGrid = block.querySelector('div.news-feed-card-grid');
  if (cardGrid) {
    cardGrid.innerHTML = '';
  } else {
    cardGrid = document.createElement('div');
    cardGrid.classList.add('news-feed-card-grid');
    if (config.layout) {
      cardGrid.classList.add(config.layout);
    }
    block.append(cardGrid);
  }
  cards.forEach((card) => {
    cardGrid.innerHTML += card;
  });
}

function createNewsFilters(items) {
  const filter = document.createElement('div');
  filter.classList.add(`news-feed-filters`);

  if (Array.isArray(items)) {
    const filterList = document.createElement('ul');

    items.forEach((e) => {
      const filterItem = document.createElement('li');
      const filterItemButton = document.createElement('button');
      filterItemButton.setAttribute('data-value', e.label.toLowerCase().trim());
      filterItemButton.classList.add('secondary');
      if (e.selected) {
        filterItemButton.classList.add('selected');
        filterItemButton.setAttribute('aria-pressed', 'true');
      }
      filterItemButton.innerText = e.label;
      filterItem.append(filterItemButton);
      filterList.append(filterItem);
    });

    filter.append(filterList);
  }
  return filter;
}

function updateNewsFilters(buttons, newSelection) {
  buttons.forEach((b) => {
    if (b.getAttribute('data-value') === newSelection) {
      b.classList.add('selected');
      b.setAttribute('aria-pressed', 'true');
    } else {
      b.classList.remove('selected');
      delete b.dataset['aria-pressed'];
    }
  });
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.innerHTML = ``;

  /* create buttons for filter options */
  let filterItems = [
    { label: 'all', selected: true },
    ...config.tags.split(',').map((f) => ({ label: f })),
  ];
  const newsFilters = createNewsFilters(filterItems);
  newsFilters.querySelectorAll('button').forEach((b) =>
    b.addEventListener('click', () => {
      const selectedFilter =
        b.getAttribute('data-value') === 'all'
          ? config
          : { tags: b.getAttribute('data-value') };
      updateNewsFilters(
        newsFilters.querySelectorAll('button'),
        b.getAttribute('data-value'),
      );
      decorateNewsFeed(block, selectedFilter);
    }),
  );
  block.appendChild(newsFilters);

  /* load and decorate news feed */
  await decorateNewsFeed(block, config);
}
