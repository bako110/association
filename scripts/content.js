import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_BASE_URL}/content`)
        .then(res => res.json())
        .then(data => {
            document.querySelector("#hero-title").textContent = data.about.title;
            document.querySelector("#hero-description").textContent = data.about.description;

            document.querySelector("#activeMembers").setAttribute("data-count", data.stats.activeMembers);
            document.querySelector("#projectsDone").setAttribute("data-count", data.stats.projectsDone);
            document.querySelector("#treesPlanted").setAttribute("data-count", data.stats.treesPlanted);
            document.querySelector("#villagesTouched").setAttribute("data-count", data.stats.villagesTouched);

            animateCounters();
        })
        .catch(err => console.error("Erreur API:", err));
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
