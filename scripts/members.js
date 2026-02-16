import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("membershipForm");
  
  if (!form) {
    console.error("Formulaire d'adhésion non trouvé");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      membershipPlan: form.membershipPlan.value,
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      city: form.city.value.trim(),
      profession: form.profession.value.trim(),
      motivation: form.motivation.value.trim(),
      termsAgreement: form.termsAgreement.checked,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error || response.statusText}`);
        return;
      }

      const result = await response.json();
      alert(result.message || "Inscription réussie !");
      form.reset();

      // Fermer la modale Bootstrap après inscription réussie (optionnel)
      const membershipModal = bootstrap.Modal.getInstance(document.getElementById('membershipModal'));
      if (membershipModal) membershipModal.hide();

    } catch (err) {
      alert("Erreur réseau ou serveur, merci de réessayer plus tard.");
      console.error(err);
    }
  });
});
