(() => {
  const section = document.querySelector('.reviews');
  const figure = section.querySelector('.quote');
  const quote = figure.querySelector('blockquote');
  const author = figure.querySelector('.review-author');
  const stars = figure.querySelector('.review-stars');
  const businessUrl = 'https://www.google.com/maps/place/Bar+Restaurante+La+Plaza/@36.5385899,-4.6257501,17z/data=!4m8!3m7!1s0xd72e26b222448e7:0x45d46a4cb2bb097!8m2!3d36.5385899!4d-4.6231752!9m1!1b1!16s%2Fg%2F11_dz4v6l';
  const counter = section.querySelector('.review-counter');
  const previous = section.querySelector('[data-review-prev]');
  const next = section.querySelector('[data-review-next]');
  let reviews = [], index = 0;
  let moving = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function render() {
    const review = reviews[index];
    quote.textContent = review.text;
    quote.lang = review.language || 'es';
    author.textContent = review.author;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    author.append(arrow);
    author.href = businessUrl;
    author.setAttribute('aria-label', `${review.author} · Ver La Plaza en Google Maps`);
    stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    stars.setAttribute('aria-label', `${review.rating} de 5 estrellas`);
    counter.textContent = `${index + 1} / ${reviews.length}`;
    previous.disabled = next.disabled = reviews.length < 2;
  }
  async function move(direction) {
    if (moving || reviews.length < 2) return;
    moving = true;
    try {
      if (!reducedMotion.matches) {
        await figure.animate([
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' }
        ], { duration: 300, easing: 'ease-in-out' }).finished;
      }
      index = (index + direction + reviews.length) % reviews.length;
      render();
      if (!reducedMotion.matches) {
        await figure.animate([
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-in-out' }).finished;
      }
    } finally {
      moving = false;
    }
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  fetch('reviews.json').then(response => {
    if (!response.ok) throw Error('Reviews unavailable');
    return response.json();
  }).then(data => {
    const seen = new Set();
    reviews = data.reviews.filter(review => {
      if (![4, 5].includes(review.rating) || !review.author || typeof review.text !== 'string' || !review.text.trim() || seen.has(review.id)) return false;
      seen.add(review.id);
      return true;
    });
    if (!reviews.length) throw Error('No matching reviews');
    render();
  }).catch(() => {
    quote.textContent = 'Consulta las reseñas en nuestro perfil de Google.';
    counter.textContent = '';
    previous.disabled = next.disabled = true;
  });
})();
