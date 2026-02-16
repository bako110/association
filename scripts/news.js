import API_BASE_URL from './config.js';
import { formatDate } from './utils.js';

// Charger les actualités depuis la BD
async function loadNews(limit = 6) {
    try {
        const res = await fetch(`${API_BASE_URL}/news`);
        if (!res.ok) throw new Error('Erreur lors du chargement des actualités');
        const newsList = await res.json();

        const container = document.getElementById('newsList');
        container.innerHTML = '';

        newsList.slice(0, limit).forEach((news, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', 200 * (index + 1));

            const card = document.createElement('div');
            card.className = 'card h-100 border-0 shadow news-card rounded overflow-hidden';

            // Couleur header selon la catégorie
            let headerColor = 'bg-primary';
            if (news.category === 'culture') headerColor = 'bg-success';
            else if (news.category === 'award') headerColor = 'bg-warning';

            card.innerHTML = `
                ${news.image ? `<img src="${news.image}" class="card-img-top" alt="${news.title}" style="object-fit:cover; height:200px;">` : ''}
                <div class="card-header ${headerColor} text-white text-center">
                    <i class="fas fa-calendar-alt fa-2x mb-2"></i>
                    <small class="d-block">${formatDate(news.date)}</small>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${news.title}</h5>
                    <p class="card-text text-truncate" style="max-height:80px; overflow:hidden;">${news.summary}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <a href="#news-detail-${news._id}" class="btn btn-sm ${headerColor.replace('bg-', 'btn-')}">Lire la suite</a>
                        <small class="text-muted"><i class="fas fa-eye"></i> ${news.views || 0} vues</small>
                    </div>
                </div>
            `;

            col.appendChild(card);
            container.appendChild(col);
        });

    } catch (err) {
        console.error(err);
        const newsList = document.getElementById('newsList');
        if (newsList) {
            newsList.innerHTML = '<p class="text-danger">Impossible de charger les actualités pour le moment.</p>';
        }
    }
}

// Afficher les détails d'une actualité dans un vrai modal
async function showNewsDetail(newsId) {
    try {
        const res = await fetch(`${API_BASE_URL}/news/${newsId}`);
        if (!res.ok) throw new Error('Erreur lors du chargement de l\'actualité');
        const news = await res.json();

        // Créer ou mettre à jour le modal
        let modal = document.getElementById('newsDetailModal');
        if (!modal) {
            modal = createNewsModal();
            document.body.appendChild(modal);
        }

        // Mettre à jour le contenu du modal
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="news-detail-content">
                ${news.image ? `
                    <div class="news-image-container mb-4">
                        <img src="${news.image}" class="img-fluid rounded" alt="${news.title}">
                    </div>
                ` : ''}
                <div class="news-meta mb-3">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <span class="badge bg-primary">${news.category || 'Actualité'}</span>
                        <small class="text-muted">
                            <i class="fas fa-calendar-alt me-1"></i>${formatDate(news.date)}
                        </small>
                        <small class="text-muted">
                            <i class="fas fa-eye me-1"></i> ${news.views || 0} vues
                        </small>
                    </div>
                </div>
                <h3 class="mb-3">${news.title}</h3>
                <div class="news-content">
                    ${news.content || news.summary}
                </div>
            </div>
        `;

        // Afficher le modal avec Bootstrap
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        alert('Impossible de charger les détails de l\'actualité');
    }
}

// Créer le modal des détails de news
function createNewsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'newsDetailModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'newsDetailModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-md-down">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="newsDetailModalLabel">Détails de l'actualité</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    <!-- Le contenu sera inséré dynamiquement -->
                </div>
                <div class="modal-footer">
                    <div class="d-flex flex-column flex-md-row gap-2">
                        <button type="button" class="btn btn-secondary flex-fill" data-bs-dismiss="modal">
                            <i class="fas fa-arrow-left"></i> Retour
                        </button>
                        <button type="button" class="btn btn-primary flex-fill" onclick="shareNews()">
                            <i class="fas fa-share"></i> Partager
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modal;
}

// Fermer le modal des détails
function closeNewsDetail() {
    const modal = document.getElementById('newsDetailModal');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    }
}

// Partager l'actualité
function shareNews() {
    if (navigator.share) {
        navigator.share({
            title: 'APCDD - Actualité',
            text: 'Découvrez cette actualité intéressante',
            url: window.location.href
        });
    } else {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Lien copié dans le presse-papiers!');
        });
    }
}

// Gérer les changements de hash dans l'URL pour les modales
function handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#news-detail-')) {
        const newsId = hash.replace('#news-detail-', '');
        showNewsDetail(newsId);
    } else {
        // Si le hash ne correspond pas à un détail d'actualité, fermer le modal
        const modal = document.getElementById('newsDetailModal');
        if (modal && !hash) {
            closeNewsDetail();
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadNews();

    // Optionnel : bouton pour voir toutes les actualités
    const viewAllBtn = document.getElementById('viewAllNews');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            loadNews(1000); // charge toutes les actualités
        });
    }

    // Gérer les changements d'URL
    window.addEventListener('hashchange', handleHashChange);
    
    // Vérifier s'il y a un hash au chargement de la page
    if (window.location.hash) {
        handleHashChange();
    }
});
