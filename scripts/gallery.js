import API_BASE_URL from './config.js';

function createMediaElement(item) {
  const baseMediaUrl = API_BASE_URL.replace('/api', '');
  const mediaUrl = baseMediaUrl + item.imageUrl;
  const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);

  if (isVideo) {
    const video = document.createElement('video');
    video.src = mediaUrl;
    video.controls = true;
    video.className = 'card-img-top';
    video.style.maxHeight = '250px';
    video.style.width = '100%';
    video.style.objectFit = 'cover';
    return video;
  } else {
    const img = document.createElement('img');
    img.src = mediaUrl;
    img.alt = item.title || '';
    img.className = 'card-img-top';
    img.style.maxHeight = '250px';
    img.style.width = '100%';
    img.style.objectFit = 'cover';
    return img;
  }
}

async function loadGalleryItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery`);
    if (!res.ok) throw new Error('Erreur chargement galerie');
    const items = await res.json();

    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    // Afficher seulement les 6 premiers
    const firstSix = items.slice(0, 6);

    firstSix.forEach(item => {
      const col = document.createElement('div');
      col.classList.add('col-lg-4', 'col-md-6', 'gallery-item');
      col.dataset.category = item.category;

      const card = document.createElement('div');
      card.className = 'card border-0 shadow gallery-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.dataset.title = item.title;
      card.dataset.description = item.description;

      const mediaEl = createMediaElement(item);
      card.appendChild(mediaEl);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const titleEl = document.createElement('h6');
      titleEl.className = 'card-title';
      titleEl.textContent = item.title;

      const descEl = document.createElement('p');
      descEl.className = 'card-text small text-muted';
      descEl.textContent = item.description || '';

      cardBody.appendChild(titleEl);
      cardBody.appendChild(descEl);

      card.appendChild(cardBody);
      col.appendChild(card);
      grid.appendChild(col);
    });

    // Stocker le reste dans localStorage pour la page "Découvrir plus"
    const rest = items.slice(6);
    localStorage.setItem('galleryRest', JSON.stringify(rest));

  } catch (err) {
    console.error(err);
  }
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll('.btn-group button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const items = document.querySelectorAll('.gallery-item');
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadGalleryItems();
  setupFilterButtons();
});
