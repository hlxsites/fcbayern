import { createForm } from '../form/form.js';

export default async function decorate(block) {

  const form = block.querySelector('a[href$=".json"]');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }

  // The Close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('newsletter-overlay-close');
  closeButton.addEventListener('click', (ev) => {
    block.parentElement.remove();
  })
  block.append(closeButton);

  // Close when the overlay is clicked
  block.parentElement.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('newsletter-overlay-wrapper')) {
      block.parentElement.remove();
    }
  });

  // Show the overlay after 2s
  window.setTimeout(() => {
    block.parentElement.classList.add('newsletter-overlay-wrapper--visible');
  }, 2000);
}