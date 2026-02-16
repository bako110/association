import API_BASE_URL from './config.js';
import { formatDateToMonthYear } from './utils.js';

const MAX_INITIAL_EVENTS = 2;

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return { border: 'border-success', badge: 'bg-success', label: 'En cours' };
    case 'upcoming':
      return { border: 'border-warning', badge: 'bg-warning text-dark', label: 'Prévu' };
    case 'completed':
      return { border: 'border-info', badge: 'bg-info text-dark', label: 'Terminé' };
    case 'cancelled':
      return { border: 'border-danger', badge: 'bg-danger', label: 'Annulé' };
    default:
      return { border: 'border-secondary', badge: 'bg-secondary', label: 'Statut inconnu' };
  }
}

const statusPriority = {
  upcoming: 1,
  ongoing: 2,
  completed: 3,
  cancelled: 4,
  unknown: 5,
};

function createEventCard(event, index) {
  const animation = (index % 2 === 0) ? 'fade-right' : 'fade-left';
  const delay = 200 + index * 200;
  const statusInfo = getStatusClasses(event.status);

  const imageHtml = (typeof event.image === 'string' && event.image.trim() !== '')
    ? `<div class="event-image-container mb-3">
         <img src="${event.image}" 
              alt="${event.title || 'Image événement'}" 
              class="event-image">
       </div>`
    : `<div class="event-image-placeholder mb-3">
         <i class="fas fa-calendar-alt fa-3x text-muted"></i>
       </div>`;

  return `
    <div class="col-md-6 mb-4" data-aos="${animation}" data-aos-delay="${delay}">
      <div class="card border-start ${statusInfo.border} border-4 shadow h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge ${statusInfo.badge} fw-bold text-uppercase">${statusInfo.label}</span>
            <small class="text-muted"><i class="fas fa-calendar-alt me-1"></i>${formatDateToMonthYear(event.date)}</small>
          </div>
          <h5 class="card-title">${event.title}</h5>
          ${imageHtml}
          <p class="card-text flex-grow-1">${event.description}</p>
          <p class="text-muted mb-0"><small><i class="fas fa-map-marker-alt me-1"></i>${event.location}</small></p>
        </div>
      </div>
    </div>
  `;
}

async function loadAllEvents() {
  const API_EVENTS_URL = `${API_BASE_URL}/events`;
  try {
    const res = await fetch(API_EVENTS_URL);
    if (!res.ok) throw new Error(`Erreur chargement événements: ${res.status}`);
    let events = await res.json();

    events.sort((a, b) => {
      const statusA = statusPriority[a.status?.toLowerCase()] || statusPriority.unknown;
      const statusB = statusPriority[b.status?.toLowerCase()] || statusPriority.unknown;
      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.date) - new Date(b.date);
    });

    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    events.forEach((event, i) => {
      container.insertAdjacentHTML('beforeend', createEventCard(event, i));
    });

    const showAllBtn = document.getElementById('showAllEventsBtn');
    if (showAllBtn) {
      showAllBtn.style.display = 'none';
    }

    if (window.AOS) window.AOS.refresh();

  } catch (error) {
    console.error(error);
    const container = document.getElementById('eventsContainer');
    if (container) {
      container.innerHTML = `<p class="text-danger">Impossible de charger tous les événements.<br>${error.message}</p>`;
    }
  }
}

async function loadEvents() {
  const API_EVENTS_URL = `${API_BASE_URL}/events`;
  try {
    const res = await fetch(API_EVENTS_URL);
    if (!res.ok) throw new Error(`Erreur chargement événements: ${res.status}`);
    let events = await res.json();

    events.sort((a, b) => {
      const statusA = statusPriority[a.status?.toLowerCase()] || statusPriority.unknown;
      const statusB = statusPriority[b.status?.toLowerCase()] || statusPriority.unknown;
      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.date) - new Date(b.date);
    });

    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    events.slice(0, MAX_INITIAL_EVENTS).forEach((event, i) => {
      container.insertAdjacentHTML('beforeend', createEventCard(event, i));
    });

    const showAllBtn = document.getElementById('showAllEventsBtn');

    if (events.length <= MAX_INITIAL_EVENTS) {
      showAllBtn.style.display = 'none';
    } else {
      showAllBtn.style.display = 'inline-block';
      showAllBtn.onclick = () => {
        loadAllEvents();
      };
    }

    if (window.AOS) window.AOS.refresh();

  } catch (error) {
    console.error(error);
    const container = document.getElementById('eventsContainer');
    if (container) {
      container.innerHTML = `<p class="text-danger">Impossible de charger les événements.<br>${error.message}</p>`;
    }
    const showAllBtn = document.getElementById('showAllEventsBtn');
    if (showAllBtn) showAllBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);

// CSS pour uniformiser les images
const style = document.createElement('style');
style.textContent = `
  .event-image-container {
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .event-image-placeholder {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
  }
  
  .card.h-100 {
    min-height: 400px;
  }
  
  .card-body.d-flex.flex-column {
    height: 100%;
  }
`;
document.head.appendChild(style);
