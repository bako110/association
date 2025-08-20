import API_BASE_URL from './config.js';

// Formater la date au format français
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Charger les actualités depuis la BD
async function loadNews() {
    try {
        const res = await fetch(`${API_BASE_URL}/news`);
        if (!res.ok) throw new Error('Erreur lors du chargement des actualités');
        const newsList = await res.json();

        const container = document.getElementById('newsList');
        container.innerHTML = '';

        newsList.forEach((news, index) => {
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
                    <p class="card-text text-truncate" style="max-height:80px;">${news.summary}</p>
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
        document.getElementById('newsList').innerHTML = '<p class="text-danger">Impossible de charger les actualités pour le moment.</p>';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadNews);
