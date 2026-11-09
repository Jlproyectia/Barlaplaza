(() => {
  const section = document.querySelector('.reviews');
  const figure = section.querySelector('.quote');
  const quote = figure.querySelector('blockquote');
  const author = figure.querySelector('.review-author');
  const stars = figure.querySelector('.review-stars');
  const note = figure.querySelector('.review-note');
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
    author.href = review.authorUrl;
    stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    stars.setAttribute('aria-label', `${review.rating} de 5 estrellas`);
    note.textContent = `${review.text ? 'Extracto de reseña' : 'Valoración'} en Google${review.translated ? ' · Traducción de Google' : ''}`;
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
