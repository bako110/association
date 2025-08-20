import API_BASE_URL from './config.js';

// Capitaliser la première lettre
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Charger les partenaires depuis la BD
async function loadPartners(limit = 8) {
    try {
        const res = await fetch(`${API_BASE_URL}/partners`);
        if (!res.ok) throw new Error('Erreur lors du chargement des partenaires');
        const partners = await res.json();

        const partnersList = document.getElementById('partnersList');
        partnersList.innerHTML = '';

        // Limiter le nombre de partenaires affichés
        partners.slice(0, limit).forEach((partner, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-6 mb-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', 100 * (index + 1));

            const partnerCard = document.createElement('div');
            partnerCard.className = 'partner-card bg-white rounded shadow p-3 text-center h-100 d-flex flex-column justify-content-between';

            // Logo
            const logo = document.createElement('img');
            logo.src = partner.logoUrl || 'https://via.placeholder.com/150x100?text=Logo';
            logo.alt = partner.name || 'Partenaire';
            logo.className = 'img-fluid mb-3 rounded';
            logo.style.maxHeight = '120px';
            logo.style.objectFit = 'contain';

            // Nom
            const name = document.createElement('h6');
            name.textContent = partner.name || '';
            name.className = 'fw-bold';

            // Type
            const type = document.createElement('small');
            type.textContent = partner.type ? capitalize(partner.type) : '';
            type.className = 'text-muted d-block mb-2';

            // Description
            const description = document.createElement('p');
            description.textContent = partner.description || '';
            description.className = 'small text-truncate';

            // Lien vers le site
            const link = document.createElement('a');
            link.href = partner.website || '#';
            link.target = '_blank';
            link.className = 'btn btn-sm btn-primary mt-auto';
            link.textContent = 'Visiter le site';

            // Assemblage
            partnerCard.appendChild(logo);
            partnerCard.appendChild(name);
            partnerCard.appendChild(type);
            partnerCard.appendChild(description);
            partnerCard.appendChild(link);

            col.appendChild(partnerCard);
            partnersList.appendChild(col);
        });

    } catch (err) {
        console.error(err);
        document.getElementById('partnersList').innerHTML = '<p class="text-danger">Impossible de charger les partenaires pour le moment.</p>';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadPartners();

    // Gestion du bouton "Voir tous les partenaires"
    document.getElementById('viewAllPartners').addEventListener('click', () => {
        loadPartners(1000); // charge tous les partenaires
    });
});
