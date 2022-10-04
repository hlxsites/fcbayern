import {
  createOptimizedPicture,
  getLanguage,
  lookupPages,
} from '../../scripts/scripts.js';

export default async function decorate(block) {
  // get teaser news path and fetch the news item
  const rows = [...block.children];
  const teaserConfigRow = rows[0];
  const [content] = [...teaserConfigRow.children].map((e, j) => (j ? e.textContent : e));
  let news = {};
  if (content.textContent.includes('://')) {
    // handle straight link
    const { pathname } = new URL(content.querySelector('a').href);
    const newsBucket = `news-${getLanguage()}`;
    news = await lookupPages([pathname], newsBucket);
  }

  block.textContent = '';
  if (news) {
    const entry = news[0];
    // create the picture tag1
    const picture = createOptimizedPicture(entry.image, entry.imageAlt, false, [
      { media: '(max-width: 763px)', width: '320' },
      { media: '(min-width: 764px) and (max-width: 1015px)', width: '640' },
      { media: '(min-width: 1016px)', width: '1600' },
    ]);

    // convert timeinmillis
    const date = new Date(
      parseInt(`${entry.publicationDate}000`, 10),
    ).toLocaleDateString('de-de');

    // generate the dom
    const dom = document.createRange().createContextualFragment(`
    <a class='teaser-link' href='${entry.path}'>
      <div class='teaser-image'>
      </div>
      <div class='teaser-info'>
        <div class='teaser-metadata'>
          <div class='teaser-subtitle'>${entry.subtitle}</div>
          <div class='teaser-date'>${date}</div>
        </div> 
        <h3 class='teaser-title'>${entry.title}</h3> 
      </div>
    </a>
  `);

    // append the picture
    dom.children[0].children[0].append(picture);
    block.append(dom);
  }
}
