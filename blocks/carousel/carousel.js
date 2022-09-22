export function createCarouselCard(item, classPrefix, eager = false) {
    const card = document.createElement('a');
    card.className = `${classPrefix}-card`;
    card.href = item.Teaserlink;

    const image = item.Teaserimage;
    const pictureString = createOptimizedPicture(
        image,
        item.TeaserimageAlt,
        eager,
        [{ width: 750 }]
    ).outerHTML;

    card.innerHTML = `
    <div class="${classPrefix}-card-picture">${pictureString}</div>
    <div class="${classPrefix}-card-subtitle">${item.Teasersubtitle}</div>
    <div class="${classPrefix}-card-body"><h3>${item.Teasertitle}</h3></div>`;
    return card;
}

export default function decorate(block) {
    for (let i = 0; i < block.children.length; i++) {
        const item = block.children[i];
        const itemBody = item.children[0];
        item.classList.add('carousel-item');
        itemBody.classList.add('carousel-body');
    }

    const btnPrev = document.createElement('button');
    btnPrev.classList.add('btn');
    btnPrev.classList.add('btn-prev');
    btnPrev.innerText = '<';
    block.append(btnPrev);

    const btnNext = document.createElement('button');
    btnNext.classList.add('btn');
    btnNext.classList.add('btn-next');
    btnNext.innerText = '>';
    block.append(btnNext);

    const slides = document.querySelectorAll('.carousel-item');
    // loop through slides and set each slides translateX property to index * 100%
    slides.forEach((slide, idx) => {
        slide.style.transform = `translateX(${idx * 100}%)`;
    });

    // select next slide button
    const nextSlide = document.querySelector('.btn-next');

    // current slide counter
    let curSlide = 0;
    // maximum number of slides
    const maxSlide = slides.length - 1;

    // add event listener and navigation functionality
    nextSlide.addEventListener('click', () => {
        // check if current slide is the last and reset current slide
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide += 1;
        }
        slides.forEach((slide, idx) => {
            slide.style.transform = `translateX(${100 * (idx - curSlide)}%)`;
        });
    });

    // select prev slide button
    const prevSlide = document.querySelector('.btn-prev');

    // add event listener and navigation functionality
    prevSlide.addEventListener('click', () => {
        // check if current slide is the first and reset current slide to last
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide -= 1;
        }

        //   move slide by 100%
        slides.forEach((slide, idx) => {
            slide.style.transform = `translateX(${100 * (idx - curSlide)}%)`;
        });
    });
}
