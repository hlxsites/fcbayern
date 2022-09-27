import { lookupPages, getLanguage } from '../../scripts/scripts.js';

export function createMatchCard(matchItem) {
  const card = document.createElement('a');
  card.href = matchItem.path;

  card.innerHTML = `
    <p class="match-card-info">Matchcenter aufrufen für ${matchItem.team1} gegen ${matchItem.team2}</p>
    <div class="match-stripe-match">
      <div class="match-stripe-emblemes">
      </div>
      <div class="match-stripe-scores">
        <div>${matchItem.finalscore}</div>
        <p>${matchItem.halftimescore}</p>
      </div>
    </div>`;
  return card;
}

export default async function decorate(block) {
  const matchDataBucket = 'matches-' + getLanguage();
  await lookupPages([], matchDataBucket);
  const index = window.pageIndex[matchDataBucket];

  const matches = index.data.slice(0, 10);

  const cards = [];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    console.log(match);

    const listItem = document.createElement('li');
    listItem.appendChild(createMatchCard(match));
    cards.push(listItem.outerHTML);
  }

  const html = `
    <div id="matchdata" class="match-stripe">
    <div class="match-stripe-layout">
      <ul class="match-stripe-list">
       ${cards.join("")}
      </ul>
    </div>
    </div>
    `;
  block.innerHTML = html;
}
