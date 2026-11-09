const menu = {
  compartir: [
    ['Tataki de atún'],
    ['Cazuela de langostinos al pil-pil'],
    ['Berenjenas fritas con miel de caña'],
    ['Surtido de croquetas'],
    ['Tabla de jamón ibérico de bellota'],
    ['Surtido de quesos con denominación de origen']
  ],
  principales: [
    ['Arroz con bogavante', 'Bajo reserva · mínimo 2 personas'],
    ['Arroz caldoso a la marinera'],
    ['Lubina'],
    ['Carrillada de cerdo ibérica al Pedro Ximénez'],
    ['Solomillo de ternera retinta a la parrilla'],
    ['Lomo del salmón al cava']
  ],
  dulce: [
    ['Tatín de manzana'],
    ['Coulant de chocolate'],
    ['Tarta de queso'],
    ['Brownie con helado de vainilla'],
    ['Fruta de temporada'],
    ['Helado tres sabores']
  ],
  copas: [
    ['Mojito'], ['Margarita'], ['Piña colada'], ['Daiquiri'], ['Sangría'],
    ['Vinos', 'Consulta nuestra selección y disponibilidad con el equipo.']
  ]
};

const menuItems = document.querySelector('#menu-items');
function renderMenu(category) {
  const items = menu[category];
  if (!items) return;
  menuItems.replaceChildren(...items.map(([name, note], index) => {
    const row = document.createElement('article');
    row.className = 'menu-item';
    row.style.animationDelay = `${index * 25}ms`;
    const number = document.createElement('span');
    number.className = 'dish-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    const body = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'dish-name';
    const dishButton=document.createElement('button');
    dishButton.className='dish-select';
    dishButton.textContent=name;
    dishButton.setAttribute('aria-label','Ver imagen: '+name);
    dishButton.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('dish-select',{detail:{name,row}})));
    title.append(dishButton);
    body.append(title);
    if (note) {
      const description = document.createElement('p');
      description.className = 'dish-note';
      description.textContent = note;
      body.append(description);
    }
    row.append(number, body);
    return row;
  }));
}
renderMenu('compartir');
document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderMenu(button.dataset.category);
  });
});

const mobileToggle = document.querySelector('.mobile-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMobile() {
  mobileNav.hidden = true;
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Abrir menú');
}
mobileToggle.addEventListener('click', () => {
  const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobile(); });

function openDialog(dialog) {
  closeMobile();
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});
document.querySelectorAll('[data-reserve]').forEach(button => button.addEventListener('click', () => openDialog(document.querySelector('#reservation-dialog'))));
document.querySelector('[data-credits]').addEventListener('click', () => openDialog(document.querySelector('#credits-dialog')));

const galleryTiles = [...document.querySelectorAll('[data-gallery]')];
const galleryDialog = document.querySelector('#gallery-dialog');
const galleryImage = document.querySelector('#gallery-image');
let galleryIndex = 0;
function showGallery(index) {
  galleryIndex = (index + galleryTiles.length) % galleryTiles.length;
  const tile = galleryTiles[galleryIndex];
  const sourceImage = tile.querySelector('img');
  galleryImage.src = sourceImage.currentSrc || sourceImage.src;
  galleryImage.alt = sourceImage.alt;
  document.querySelector('#gallery-label').textContent = `${galleryIndex + 1} / ${galleryTiles.length} · ${sourceImage.alt}`;
}
galleryTiles.forEach((tile, index) => tile.addEventListener('click', () => { showGallery(index); openDialog(galleryDialog); }));
document.querySelector('#gallery-prev').addEventListener('click', () => showGallery(galleryIndex - 1));
document.querySelector('#gallery-next').addEventListener('click', () => showGallery(galleryIndex + 1));
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showGallery(galleryIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showGallery(galleryIndex + 1); }
});

const mapsUrl = 'https://www.google.com/maps/place/Bar+Restaurante+La+Plaza/@36.5385895,-4.6334535,15z/data=!3m1!4b1!4m6!3m5!1s0xd72e26b222448e7:0x45d46a4cb2bb097!8m2!3d36.5385899!4d-4.6231752!16s%2Fg%2F11_dz4v6l';
document.querySelectorAll('[data-maps]').forEach(link => { link.href = mapsUrl; });
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('img').forEach(img => {
  function onFailure() {
    if (img.closest('.menu-photo-wrap')) {
      img.hidden = true;
      img.parentElement.querySelector('.photo-failure').hidden = false;
    } else if (img.closest('.gallery-tile')) {
      img.style.opacity = '0';
      img.closest('.gallery-tile').setAttribute('aria-label', 'Fotografía no disponible temporalmente');
      img.closest('.gallery-tile').disabled = true;
    }
  }
  img.addEventListener('error', onFailure);
  if (img.complete && img.naturalWidth === 0) onFailure();
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
