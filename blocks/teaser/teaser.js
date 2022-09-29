import { createOptimizedPicture } from "../../scripts/scripts.js";

export default async function decorate(block) {

  // get the news path
  const path = `/de${block.children[0].children[0].children[0].href.split("/de")[1]}`;
  block.textContent = '';

  // find the metadata in the index
  const resp = await fetch("/de/news/query-index.json");
  const json = await resp.json();
  const entry = json.data.find((element) => {
    return element['path'] === `${path}`;
  })

  // create the picture tag1
  const picture = createOptimizedPicture(
    entry.image,
    entry.imageAlt,
    false,
    [
      { media: '(max-width: 763px)', width: '320' },
      { media: '(min-width: 764px) and (max-width: 1015px)', width: '640' },
      { media: '(min-width: 1016px)', width: '1600' },
    ],
  );

  // convert timeinmillis
  const date = new Date(parseInt(`${entry.publicationDate}000`))
  .toLocaleDateString('de-de');
  
  // generate the dom
  const dom = document.createRange().createContextualFragment(`
    <a href=${path}>
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
  `)

  // append the picture
  dom.children[0].append(picture);

  block.append(dom);
}