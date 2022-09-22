import { lookupPages, createOptimizedPicture } from '../../scripts/scripts.js';

export function createNewsCard(newsItem, classPrefix, eager = false) {
    const card = document.createElement('a');
    card.className = `${classPrefix}-card`;
    card.href = newsItem.Teaserlink;

    const image = newsItem.Teaserimage;
    const pictureString = createOptimizedPicture(
        image,
        newsItem.TeaserimageAlt,
        eager,
        [{ width: 750 }]
    ).outerHTML;

    card.innerHTML = `
    <div class="${classPrefix}-card-picture">${pictureString}</div>
    <div class="${classPrefix}-card-subtitle">${newsItem.Teasersubtitle}</div>
    <div class="${classPrefix}-card-body"><h3>${newsItem.Teasertitle}</h3></div>`;
    return card;
}

export default async function decorate(block) {
    await lookupPages([], 'news-de'); //TODO
    const news = window.pageIndex['news-de'];
    block.textContent = '';

    if (news && Array.isArray(news.data)) {
        const newsList = document.createElement('ul');
        news.data.forEach((e) => {
            const newsItem = document.createElement('li');
            const newsCard = createNewsCard(e, 'news');
            newsItem.innerHTML = newsCard.outerHTML;
            newsList.append(newsItem);
        });
        block.append(newsList);
    }
}
