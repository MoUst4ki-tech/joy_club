let userBalance = 100;

function updateDisplay() {
    const display = document.getElementById('gold-eggs-display');
    if(display) {
        display.innerText = userBalance;
    }
}

function updateBalance(amount) {
    userBalance += amount;
    
    if (userBalance < 0) userBalance = 0;
    updateDisplay();
    console.log("Nouveau solde : " + userBalance);
}

// --- JEU 1 ---
function lancerJeu1() {
    let message = document.getElementById("message-jeu1");
    let case1 = document.getElementById("case1-jeu1");
    let resultatDe = document.getElementById("resultat-de-jeu1");

    // Vérifier si le joueur a au moins 1 œuf
    if (userBalance <= 0) {
        message.innerHTML = "<strong>Fonds insuffisants !</strong>";
        return; // Arrête la fonction ici
    }

    // Payer 1 œuf en utilisant ta fonction
    updateBalance(-1);

    // Lancer le dé (chiffre entre 1 et 6)
    let resultat = Math.floor(Math.random() * 6) + 1;
    
    // Afficher le résultat avec une petite animation basique
    resultatDe.innerText = "🎲";
    setTimeout(() => {
        resultatDe.innerText = resultat;

        // Logique de victoire
        if (resultat === 1) {
            message.innerHTML = "<strong>Bravo ! La Case 1 est ouverte.</strong>";
            case1.classList.remove("hidden");
        } else {
            message.innerHTML = "Raté... Essaie encore !";
            case1.classList.add("hidden");
        }
    }, 200); // Petit délai de 0.2s pour l'effet visuel
}
