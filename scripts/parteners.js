import  API_BASE_URL from './config.js';


// Charger les partenaires depuis la BD
async function loadPartners() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/partners`);
        if (!res.ok) throw new Error('Erreur lors du chargement des partenaires');
        const partners = await res.json();

        const partnersList = document.getElementById('partnersList');
        partnersList.innerHTML = '';

        partners.forEach((partner, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-2 col-6 mb-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', 200 * (index + 1));

            const partnerDiv = document.createElement('div');
            partnerDiv.className = 'partner-logo p-3 bg-white rounded shadow text-center';

            const img = document.createElement('img');
            img.src = partner.logoUrl || 'https://via.placeholder.com/120x80?text=Logo';
            img.alt = partner.name || 'Partenaire';
            img.className = 'img-fluid';

            partnerDiv.appendChild(img);
            col.appendChild(partnerDiv);
            partnersList.appendChild(col);
        });

    } catch (err) {
        console.error(err);
        const partnersList = document.getElementById('partnersList');
        partnersList.innerHTML = '<p class="text-danger">Impossible de charger les partenaires pour le moment.</p>';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadPartners);
