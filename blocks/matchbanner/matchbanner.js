import { lookupPages, getLanguage } from '../../scripts/scripts.js';

export function createMatchCard(matchItem) {
  return document.createRange().createContextualFragment(`
    <a href="${matchItem.path}">
      <p class="match-card-info">Matchcenter aufrufen für ${matchItem.team1} gegen ${matchItem.team2}</p>
      <div class="match-stripe-match">
        <div class="match-stripe-emblemes">
          <img src="${matchItem.team1emblems}" alt="${matchItem.team1}" />
          <img src="${matchItem.team2emblems}" alt="${matchItem.team2}" />
        </div>
        <div class="match-stripe-scores">
          <span class="final">${matchItem.finalscore.split(':').join(' : ')}</span>
          <span class="halftime">(${matchItem.halftimescore})</span>
        </div>
      </div>
    </a>
  `);
}

export default async function decorate(block) {
  const matchDataBucket = `matches-${getLanguage()}`;
  await lookupPages([], matchDataBucket);
  const index = window.pageIndex[matchDataBucket];
  const matches = index.data.slice(0, 10);

  const cards = [];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];

    const listItem = document.createElement('li');
    listItem.appendChild(createMatchCard(match));
    cards.push(listItem.outerHTML);
  }

  const content = document.createRange().createContextualFragment(`
    <div id="matchdata" class="match-stripe">
      <div class="match-stripe-layout">
        <ul class="match-stripe-list">${cards.join('')}</ul>
      </div>
    </div>
  `);

  block.textContent = '';
  block.appendChild(content);
}
