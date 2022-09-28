import { lookupPages, getLanguage } from '../../scripts/scripts.js';

function formatDate(dateStr) {
  return new Date(Math.round((+dateStr - (1 + 25567 + 1)) * 86400 * 1000));
}

export function createMatchCard(matchItem) {
  let stripeInfo = '';
  /* details for previous match */
  if (matchItem.finalscore) {
    stripeInfo = `<span class="large">${matchItem.finalscore
      .split(':')
      .join(' : ')}</span>
          <span class="small">(${matchItem.halftimescore})</span>`;
  }

  /* details for upcoming match */
  if (matchItem.matchtime) {
    const matchDate = formatDate(matchItem.matchtime);
    const matchDay = new Intl.DateTimeFormat(getLanguage(), {
      weekday: 'short',
      month: '2-digit',
      day: '2-digit',
    }).format(matchDate);
    const matchTime = new Intl.DateTimeFormat(getLanguage(), {
      timeStyle: 'short',
    }).format(matchDate);

    stripeInfo = `<span class="large">${matchDay}</span>
          <span class="small">${matchTime} Uhr</span>`;
  }

  return document.createRange().createContextualFragment(`
    <a href="${matchItem.path}">
      <p class="match-card-info">Matchcenter aufrufen für ${matchItem.team1} gegen ${matchItem.team2}</p>
      <div class="match-stripe-match">
        <div class="match-stripe-emblemes">
          <img src="${matchItem.team1emblems}" alt="${matchItem.team1}" />
          <img src="${matchItem.team2emblems}" alt="${matchItem.team2}" />
        </div>
        <div class="match-stripe-scores">
          ${stripeInfo}
        </div>
      </div>
    </a>
  `);
}

export default async function decorate(block) {
  const matchDataBucket = `matches-${getLanguage()}`;
  /* load previous and upcomming matches */
  await lookupPages([], matchDataBucket, ['matches', 'matches-upcoming']);
  const previousMatches = window.pageIndex[
    (matchDataBucket, 'matches')
  ].data.slice(0, 10);
  const upcomingMatches = window.pageIndex[
    (matchDataBucket, 'matches-upcoming')
  ].data.slice(0, 10);
  const matches = [...previousMatches, ...upcomingMatches];

  /* map match data to cards */
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

  block.replaceChildren(content);
}
