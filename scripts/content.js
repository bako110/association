import API_BASE_URL from './config.js'; 

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE_URL}/content`)
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors de la récupération des données");
      return res.json();
    })
    .then(data => {
      // Mettre à jour le contenu principal
      const heroTitle = document.querySelector("#hero-title");
      const heroDescription = document.querySelector("#hero-description");
      
      if (heroTitle && data.about?.title) {
        heroTitle.textContent = data.about.title;
      }
      if (heroDescription && data.about?.description) {
        heroDescription.textContent = data.about.description;
      }

      // Mettre à jour les compteurs avec les vraies valeurs
      if (data.stats) {
        const activeMembers = document.getElementById("activeMembers");
        const projectsDone = document.getElementById("projectsDone");
        const treesPlanted = document.getElementById("treesPlanted");
        const villagesTouched = document.getElementById("villagesTouched");

        if (activeMembers) activeMembers.setAttribute("data-count", data.stats.activeMembers || 0);
        if (projectsDone) projectsDone.setAttribute("data-count", data.stats.projectsDone || 0);
        if (treesPlanted) treesPlanted.setAttribute("data-count", data.stats.treesPlanted || 0);
        if (villagesTouched) villagesTouched.setAttribute("data-count", data.stats.villagesTouched || 0);
      }

      animateCounters();
    })
    .catch(err => {
      console.error("Erreur API:", err);
    });
});

function animateCounters() {
  document.querySelectorAll(".counter").forEach(counter => {
    const target = +counter.getAttribute("data-count");
    let count = 0;
    const increment = target / 200;

    const update = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
}
