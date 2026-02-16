// Utilitaires communs pour tous les scripts

// Formater la date au format français complet
export function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Formater la date au format mois année
export function formatDateToMonthYear(dateStr) {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
}

// Capitaliser la première lettre
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Afficher un message d'erreur standardisé
export function showError(message, error) {
    console.error(message, error);
    alert(message);
}

// Vérifier si un élément existe
export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Élément #${id} non trouvé`);
    }
    return element;
}

// Créer et afficher une section de détails dynamiquement
export function createDetailSection(id, className, content) {
    let section = document.getElementById(id);
    if (!section) {
        section = document.createElement('div');
        section.id = id;
        section.className = className;
        document.body.appendChild(section);
    }
    section.innerHTML = content;
    return section;
}
