import API_BASE_URL from './config.js'; 

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE_URL}/content/state`)
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors de la récupération des données");
      return res.json();
    })
    .then(data => {
      // data a la structure { _id, stats: {...}, __v }
      const stats = data.stats;
      // Met à jour les compteurs avec les vraies valeurs
      document.getElementById("activeMembers").setAttribute("data-count", stats.activeMembers);
      document.getElementById("projectsDone").setAttribute("data-count", stats.projectsDone);
      document.getElementById("treesPlanted").setAttribute("data-count", stats.treesPlanted);
      document.getElementById("villagesTouched").setAttribute("data-count", stats.villagesTouched);

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
