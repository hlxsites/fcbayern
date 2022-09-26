export default function decorate(block) {
  /* attach form after heading */
  const heading = block.querySelector('h2');
  const form = document.createElement('form');

  form.innerHTML = `
    <label for="email">
    <input name="email" placeholder="E-Mail-Adresse" type="email" aria-label="E-Mail-Adresse" value="">
    </label>
    <label>
    <select aria-label="Newsletter auswählen" name="newsletter">
    <option value="select__placeholder" hidden="">Newsletter auswählen</option>
    <option value="NEWSLETTER_CLUB">FC Bayern München Newsletter</option>
    <option value="NEWSLETTER_FRAUENFUSSBALL">FCB Frauen Newsletter</option>
    <option value="NEWSLETTER_KIDSCLUB">KidsClub Newsletter</option>
    <option value="NEWSLETTER_FANSHOP">Store Newsletter</option>
    </select>
    </label>
    <button type="submit"><span>Abonnieren</span></button>`;

  heading.parentNode.insertBefore(form, heading.nextSibling);
}
