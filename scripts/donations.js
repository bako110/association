import API_BASE_URL from "./config.js";  // adapte le chemin si besoin

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("donationForm");
  
  if (!form) {
    console.error("Formulaire de don non trouvé");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer le montant sélectionné ou personnalisé
    let amount = null;
    const radios = form.querySelectorAll('input[name="amount"]');
    radios.forEach(radio => {
      if (radio.checked) amount = parseInt(radio.value, 10);
    });

    const customAmountValue = form.customAmount.value.trim();
    if (customAmountValue) {
      const customAmountNum = parseInt(customAmountValue, 10);
      if (!isNaN(customAmountNum) && customAmountNum > 0) {
        amount = customAmountNum;
      }
    }

    if (!amount || amount <= 0) {
      alert("Veuillez sélectionner ou saisir un montant de don valide.");
      return;
    }

    // Récupérer les autres champs
    const donorName = form.donorName.value.trim();
    const donorEmail = form.donorEmail.value.trim();
    const donorPhone = form.donorPhone.value.trim();
    const donationPurpose = form.donationPurpose.value;
    const paymentMethod = form.paymentMethod.value;
    const anonymous = form.anonymous.checked;

    // Si don non anonyme, vérifier les champs obligatoires
    if (!anonymous) {
      if (!donorName || !donorEmail || !donorPhone) {
        alert("Veuillez remplir nom, email et téléphone ou cocher 'Don anonyme'.");
        return;
      }
    }

    // Préparer l'objet à envoyer
    const data = {
      amount,
      donorName: anonymous ? null : donorName,
      donorEmail: anonymous ? null : donorEmail,
      donorPhone: anonymous ? null : donorPhone,
      donationPurpose,
      paymentMethod,
      anonymous
    };

    try {
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Erreur: ${errData.error || response.statusText}`);
        return;
      }

      const result = await response.json();
      alert(result.message || "Merci pour votre don !");

      form.reset();

      // Fermer la modale si tu en utilises une avec Bootstrap
      const donationModal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
      if (donationModal) donationModal.hide();

    } catch (error) {
      console.error("Erreur réseau ou serveur:", error);
      alert("Erreur réseau ou serveur, merci de réessayer plus tard.");
    }
  });
});
