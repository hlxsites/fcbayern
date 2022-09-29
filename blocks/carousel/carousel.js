import { lookupPages, getLanguage, parseDate } from '../../scripts/scripts.js';

import { createNewsCard } from '../news/news.js';

async function fetchNews(block) {
  const cards = [];
  const newsBucket = 'news-' + getLanguage();
  const rows = [...block.children];
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
        const card = createNewsCard(newsItem, 'news-teaser');
        cards.push(card);
      }
    } else {
      cards.push(`<div class="news-teaser-card">${content.outerHTML}</div>`);
    }
  }
  return cards;
}

async function fetchEvents() {
  const cards = [];
  const eventsBucket = 'events-' + getLanguage();
  await lookupPages([], eventsBucket);
  const index = window.pageIndex[eventsBucket];

  for (let i = 0; i < index.data.length; i += 1) {
    const event = index.data[i];

    const eventDate = parseDate(event.date);
    const eventDateStr = new Intl.DateTimeFormat(getLanguage(), {
      weekday: 'short',
      month: '2-digit',
      day: '2-digit',
    }).format(eventDate);

    const card = document.createElement('a');
    card.href = event.path;

    card.innerHTML = `
    
      <div class="event-card-date">${eventDateStr}</div>
      <p class="event-card-title">${event.title}</p>
      <p class="event-card-type">${event.type}</p>
      <div class="event-card-icon">
        <svg
          height="24"
          width="24"
          viewBox="0 0 24 24"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>icon</title>
          <path d="M13.75 12L11.2 8.6L12.8 7.4L15.8 11.4C16.0667 11.7556 16.0667 12.2444 15.8 12.6L12.8 16.6L11.2 15.4L13.75 12Z"></path>
        </svg>
      </div>
    `;
    cards.push(card);
  }
  return cards;
}

async function fetchResults() {
  const cards = [];
  const resultsBucket = 'results-' + getLanguage();
  await lookupPages([], resultsBucket);
  const index = window.pageIndex[resultsBucket];

  for (let i = 0; i < index.data.length; i += 1) {
    const result = index.data[i];
    
    const card = document.createElement('a');
    card.href = 'https://fcbayern.com/de/club/erfolge';
    card.innerHTML = `
      <div class="result-card-content">
        <img src="${result.image}" alt="${result.name}" />
        <span>
          ${result.name}
          <strong>${result.number}</strong>
        </span>
      </div>
    `;
    cards.push(card);
  }
  return cards;
}

export default async function decorate(block) {
  /* get block type and load content */
  let contents = [];

  if (block.classList.contains('featured-news')) {
    contents = await fetchNews(block);
  } else if (block.classList.contains('events')) {
    contents = await fetchEvents();
  } else if (block.classList.contains('results')) {
    contents = await fetchResults();
  }

  /* decorate carousel cards */
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel-wrapper');

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('carousel-content');
  carouselWrapper.append(carouselContent);

  for (let i = 0; i < contents.length; i += 1) {
    carouselContent.append(contents[i]);
  }
  block.innerHTML = carouselWrapper.outerHTML;

  // const btnPrev = document.createElement('button');
  // btnPrev.classList.add('btn');
  // btnPrev.classList.add('btn-prev');
  // btnPrev.innerText = '<';
  // block.append(btnPrev);

  // const btnNext = document.createElement('button');
  // btnNext.classList.add('btn');
  // btnNext.classList.add('btn-next');
  // btnNext.innerText = '>';
  // block.append(btnNext);

  // const slides = document.querySelectorAll('.carousel-item');
  // // loop through slides and set each slides translateX property to index * 100%
  // slides.forEach((slide, idx) => {
  //   slide.style.transform = `translateX(${idx * 100}%)`;
  // });

  // // select next slide button
  // const nextSlide = document.querySelector('.btn-next');

  // // current slide counter
  // let curSlide = 0;
  // // maximum number of slides
  // const maxSlide = slides.length - 1;

  // // add event listener and navigation functionality
  // nextSlide.addEventListener('click', () => {
  //   // check if current slide is the last and reset current slide
  //   if (curSlide === maxSlide) {
  //     curSlide = 0;
  //   } else {
  //     curSlide += 1;
  //   }
  //   slides.forEach((slide, idx) => {
  //     slide.style.transform = `translateX(${100 * (idx - curSlide)}%)`;
  //   });
  // });

  // // select prev slide button
  // const prevSlide = document.querySelector('.btn-prev');

  // // add event listener and navigation functionality
  // prevSlide.addEventListener('click', () => {
  //   // check if current slide is the first and reset current slide to last
  //   if (curSlide === 0) {
  //     curSlide = maxSlide;
  //   } else {
  //     curSlide -= 1;
  //   }

  //   //   move slide by 100%
  //   slides.forEach((slide, idx) => {
  //     slide.style.transform = `translateX(${100 * (idx - curSlide)}%)`;
  //   });
  // });
}
