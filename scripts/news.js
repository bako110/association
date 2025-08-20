import API_BASE_URL from "./config";
// Formater la date au format français
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Charger les actualités depuis la BD
async function loadNews() {
    try {
        const res = await fetch(`${API_BASE_UR}/news`);
        if (!res.ok) throw new Error('Erreur lors du chargement des actualités');
        const newsList = await res.json();

        const container = document.getElementById('newsList');
        container.innerHTML = '';

        newsList.forEach((news, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', 200 * (index + 1));

            const card = document.createElement('div');
            card.className = 'card h-100 border-0 shadow news-card';

            // Choix de la couleur du header en fonction de la catégorie (tu peux adapter)
            let headerColor = 'bg-primary';
            if (news.category === 'culture') headerColor = 'bg-success';
            else if (news.category === 'award') headerColor = 'bg-warning';

            card.innerHTML = `
                <div class="card-header ${headerColor} text-white text-center">
                    <i class="fas fa-calendar-alt fa-2x mb-2"></i>
                    <small class="d-block">${formatDate(news.date)}</small>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.summary}</p>
                    <div class="d-flex justify-content-between align-items-center">
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
